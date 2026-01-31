# AI Chat Edge Function

Secure AI chat assistant for the Merchant Dashboard. Provides streaming responses with rate limiting and session persistence.

## Features

- **Secure API Key**: Gemini API key stored server-side, not exposed to client
- **Streaming Responses**: Real-time text streaming via Server-Sent Events (SSE)
- **Rate Limiting**: 20 messages per hour per user
- **Session Persistence**: Chat history saved to database for future reference
- **Multi-language Support**: Responds in user's preferred language (EN/MS/ZH)

## Deployment

### 1. Set Environment Variables

Add the Gemini API key to your Supabase project secrets:

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Run Database Migration

Apply the migration to create the required tables:

```bash
supabase db push
```

Or manually run the migration file:
`supabase/migrations/20260131000001_ai_chat_tables.sql`

This creates:

- `ai_chat_sessions` - Chat session metadata
- `ai_chat_messages` - Individual messages
- `ai_chat_rate_limits` - Rate limiting tracking

### 3. Deploy the Edge Function

```bash
supabase functions deploy ai-chat
```

## API Reference

### Endpoint

```
POST /functions/v1/ai-chat
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token from Supabase Auth |
| `Content-Type` | Yes | `application/json` |

### Request Body

```json
{
  "message": "What's my virality coefficient?",
  "sessionId": "uuid-optional",
  "summary": { /* DashboardSummary object - required for new sessions */ },
  "restaurantId": "uuid",
  "restaurantName": "Restaurant Name",
  "language": "en"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User's message |
| `sessionId` | string | No | Existing session ID to continue conversation |
| `summary` | object | Yes* | Dashboard data for AI context (*required for new sessions) |
| `restaurantId` | string | Yes | Restaurant UUID |
| `restaurantName` | string | Yes | Restaurant name for personalization |
| `language` | string | Yes | User's language preference (`en`, `ms`, `zh`) |

### Response

**Success (Streaming)**

Content-Type: `text/event-stream`

```
data: {"chunk": "Based on your dashboard..."}

data: {"chunk": " your virality coefficient is **1.5**"}

data: {"done": true, "sessionId": "uuid"}
```

**Error (Rate Limited)**

Status: 429

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please wait before sending more messages.",
  "rateLimitStatus": {
    "messagesUsed": 20,
    "messagesRemaining": 0,
    "windowResetsAt": "2026-01-31T16:00:00Z"
  }
}
```

**Error (Other)**

Status: 400/401/500

```json
{
  "success": false,
  "error": "Error description"
}
```

## Rate Limiting

- **Limit**: 20 messages per hour per user
- **Window**: Rolling 1-hour window from first message
- **Reset**: Counter resets when window expires

## Database Schema

### ai_chat_sessions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Owner (merchant) |
| restaurant_id | UUID | Restaurant context |
| title | VARCHAR(100) | Auto-generated from first message |
| context_snapshot | JSONB | Dashboard data at session start |
| created_at | TIMESTAMP | Session creation time |
| updated_at | TIMESTAMP | Last message time |

### ai_chat_messages

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Parent session |
| role | VARCHAR(10) | `user` or `model` |
| content | TEXT | Message text |
| token_count | INTEGER | For cost tracking |
| created_at | TIMESTAMP | Message time |

### ai_chat_rate_limits

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Primary key |
| message_count | INTEGER | Messages in current window |
| window_start | TIMESTAMP | Window start time |
| updated_at | TIMESTAMP | Last update |

## Security

- RLS policies ensure users can only access their own sessions/messages
- Rate limit function uses `SECURITY DEFINER` with explicit `search_path`
- JWT validation required for all requests
