-- ============================================================================
-- Migration: AI Chat Tables for Merchant Dashboard
-- Date: 2026-01-31
-- Description: Creates tables for AI chat sessions, messages, and rate limiting
-- ============================================================================

-- ============================================================================
-- 1. AI CHAT SESSIONS TABLE
-- Stores chat sessions for merchants (like ChatGPT conversations)
-- ============================================================================

CREATE TABLE ai_chat_sessions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Association (merchant who owns this session)
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Restaurant Context (for scoping data access)
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  
  -- Session Details
  title VARCHAR(100), -- Auto-generated from first message, truncated to ~30 chars
  
  -- Context Snapshot (dashboard data at session start for AI context)
  context_snapshot JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for ai_chat_sessions
CREATE INDEX idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_sessions_restaurant_id ON ai_chat_sessions(restaurant_id);
CREATE INDEX idx_ai_chat_sessions_created_at ON ai_chat_sessions(created_at DESC);
CREATE INDEX idx_ai_chat_sessions_user_restaurant ON ai_chat_sessions(user_id, restaurant_id);

COMMENT ON TABLE ai_chat_sessions IS 'AI chat sessions for merchant dashboard assistant';
COMMENT ON COLUMN ai_chat_sessions.title IS 'Auto-generated title from first user message';
COMMENT ON COLUMN ai_chat_sessions.context_snapshot IS 'Dashboard summary JSON at session creation time';

-- ============================================================================
-- 2. AI CHAT MESSAGES TABLE
-- Stores individual messages within a chat session
-- ============================================================================

CREATE TABLE ai_chat_messages (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Session Association
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  
  -- Message Content
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  
  -- Token Tracking (for cost monitoring)
  token_count INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for ai_chat_messages
CREATE INDEX idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX idx_ai_chat_messages_created_at ON ai_chat_messages(created_at);
CREATE INDEX idx_ai_chat_messages_session_created ON ai_chat_messages(session_id, created_at);

COMMENT ON TABLE ai_chat_messages IS 'Individual messages within AI chat sessions';
COMMENT ON COLUMN ai_chat_messages.role IS 'Message sender: user (merchant) or model (AI)';
COMMENT ON COLUMN ai_chat_messages.token_count IS 'Estimated token count for cost tracking';

-- ============================================================================
-- 3. AI CHAT RATE LIMITS TABLE
-- Tracks message counts per user for rate limiting (20 messages/hour)
-- ============================================================================

CREATE TABLE ai_chat_rate_limits (
  -- Primary Key (one row per user)
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Rate Limit Tracking
  message_count INTEGER DEFAULT 0,
  window_start TIMESTAMP DEFAULT NOW(),
  
  -- Metadata
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE ai_chat_rate_limits IS 'Rate limiting for AI chat (20 messages per hour per user)';
COMMENT ON COLUMN ai_chat_rate_limits.message_count IS 'Number of messages sent in current window';
COMMENT ON COLUMN ai_chat_rate_limits.window_start IS 'Start of current rate limit window (1 hour)';

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. RLS POLICIES FOR AI CHAT SESSIONS
-- ============================================================================

-- Merchants can view their own sessions
CREATE POLICY merchant_view_own_sessions ON ai_chat_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Merchants can create sessions for themselves
CREATE POLICY merchant_create_own_sessions ON ai_chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Merchants can update their own sessions (for title updates)
CREATE POLICY merchant_update_own_sessions ON ai_chat_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Merchants can delete their own sessions
CREATE POLICY merchant_delete_own_sessions ON ai_chat_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 6. RLS POLICIES FOR AI CHAT MESSAGES
-- ============================================================================

-- Users can view messages in their own sessions
CREATE POLICY user_view_own_messages ON ai_chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_chat_sessions
      WHERE ai_chat_sessions.id = ai_chat_messages.session_id
        AND ai_chat_sessions.user_id = auth.uid()
    )
  );

-- Users can create messages in their own sessions
CREATE POLICY user_create_own_messages ON ai_chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_chat_sessions
      WHERE ai_chat_sessions.id = ai_chat_messages.session_id
        AND ai_chat_sessions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 7. RLS POLICIES FOR AI CHAT RATE LIMITS
-- ============================================================================

-- Users can view their own rate limit
CREATE POLICY user_view_own_rate_limit ON ai_chat_rate_limits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own rate limit record
CREATE POLICY user_create_own_rate_limit ON ai_chat_rate_limits
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own rate limit
CREATE POLICY user_update_own_rate_limit ON ai_chat_rate_limits
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 8. HELPER FUNCTION: Check and Update Rate Limit
-- Returns TRUE if user is within rate limit, FALSE if exceeded
-- ============================================================================

CREATE OR REPLACE FUNCTION check_ai_chat_rate_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_rate_limit RECORD;
  v_max_messages INTEGER := 20;
  v_window_hours INTEGER := 1;
BEGIN
  -- Get or create rate limit record
  SELECT * INTO v_rate_limit
  FROM ai_chat_rate_limits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- If no record exists, create one
  IF v_rate_limit IS NULL THEN
    INSERT INTO ai_chat_rate_limits (user_id, message_count, window_start)
    VALUES (p_user_id, 1, NOW())
    ON CONFLICT (user_id) DO NOTHING;
    RETURN TRUE;
  END IF;
  
  -- Check if window has expired (older than 1 hour)
  IF v_rate_limit.window_start < NOW() - INTERVAL '1 hour' THEN
    -- Reset the window
    UPDATE ai_chat_rate_limits
    SET message_count = 1,
        window_start = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    RETURN TRUE;
  END IF;
  
  -- Check if within limit
  IF v_rate_limit.message_count >= v_max_messages THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE ai_chat_rate_limits
  SET message_count = message_count + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION check_ai_chat_rate_limit IS 'Checks and updates rate limit for AI chat (20 messages/hour). Returns TRUE if allowed, FALSE if rate limited.';

-- ============================================================================
-- 9. HELPER FUNCTION: Get Rate Limit Status
-- Returns current rate limit status for display in UI
-- ============================================================================

CREATE OR REPLACE FUNCTION get_ai_chat_rate_limit_status(p_user_id UUID)
RETURNS TABLE (
  messages_used INTEGER,
  messages_remaining INTEGER,
  window_resets_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_rate_limit RECORD;
  v_max_messages INTEGER := 20;
BEGIN
  SELECT * INTO v_rate_limit
  FROM ai_chat_rate_limits
  WHERE user_id = p_user_id;
  
  -- If no record or window expired, user has full quota
  IF v_rate_limit IS NULL OR v_rate_limit.window_start < NOW() - INTERVAL '1 hour' THEN
    RETURN QUERY SELECT 
      0::INTEGER,
      v_max_messages::INTEGER,
      (NOW() + INTERVAL '1 hour')::TIMESTAMP;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT
    v_rate_limit.message_count::INTEGER,
    (v_max_messages - v_rate_limit.message_count)::INTEGER,
    (v_rate_limit.window_start + INTERVAL '1 hour')::TIMESTAMP;
END;
$$;

COMMENT ON FUNCTION get_ai_chat_rate_limit_status IS 'Returns current rate limit status for UI display';

-- ============================================================================
-- 10. TRIGGER: Update session updated_at on message insert
-- ============================================================================

CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE ai_chat_sessions
  SET updated_at = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_session_timestamp
  AFTER INSERT ON ai_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_timestamp();

COMMENT ON FUNCTION update_session_timestamp IS 'Updates session updated_at when new message is added';
