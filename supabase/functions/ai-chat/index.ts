// Supabase Edge Function: AI Chat for Merchant Dashboard
// Provides secure, streaming AI chat with rate limiting and session persistence
// Date: 2026-01-31

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Request body interface
interface ChatRequest {
  message: string
  sessionId?: string // Optional: if provided, continues existing session
  summary?: object // Dashboard summary for context (required for new sessions)
  restaurantId: string
  restaurantName: string
  language: 'en' | 'ms' | 'zh'
}

// Response types
interface ChatResponse {
  success: boolean
  sessionId: string
  messageId?: string
  error?: string
  rateLimitStatus?: {
    messagesUsed: number
    messagesRemaining: number
    windowResetsAt: string
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Initialize Supabase client with user's JWT for RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    // Get authorization header from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '')

    // Create service role client for rate limiting and auth verification (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Verify user authentication using service role client with the user's token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      console.error('Auth error:', authError?.message || 'No user found')
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log('Authenticated user:', user.id, user.email)

    // Create Supabase client with user's JWT for RLS policies
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Parse request body
    const body: ChatRequest = await req.json()
    const { message, sessionId, summary, restaurantId, restaurantName, language } = body

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!restaurantId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Restaurant ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check rate limit using service role (bypasses RLS)
    const { data: rateLimitAllowed, error: rateLimitError } = await supabaseAdmin
      .rpc('check_ai_chat_rate_limit', { p_user_id: user.id })

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
      throw new Error('Failed to check rate limit')
    }

    if (!rateLimitAllowed) {
      // Get rate limit status for response
      const { data: rateLimitStatus } = await supabaseAdmin
        .rpc('get_ai_chat_rate_limit_status', { p_user_id: user.id })

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded. Please wait before sending more messages.',
          rateLimitStatus: rateLimitStatus?.[0] ? {
            messagesUsed: rateLimitStatus[0].messages_used,
            messagesRemaining: rateLimitStatus[0].messages_remaining,
            windowResetsAt: rateLimitStatus[0].window_resets_at
          } : undefined
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get or create session
    let currentSessionId = sessionId
    let conversationHistory: { role: string; content: string }[] = []

    if (currentSessionId) {
      // Load existing session and messages
      const { data: existingSession, error: sessionError } = await supabaseUser
        .from('ai_chat_sessions')
        .select('id, context_snapshot')
        .eq('id', currentSessionId)
        .single()

      if (sessionError || !existingSession) {
        return new Response(
          JSON.stringify({ success: false, error: 'Session not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Load conversation history
      const { data: messages } = await supabaseUser
        .from('ai_chat_messages')
        .select('role, content')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true })

      if (messages) {
        conversationHistory = messages.map(m => ({ role: m.role, content: m.content }))
      }
    } else {
      // Create new session
      if (!summary) {
        return new Response(
          JSON.stringify({ success: false, error: 'Dashboard summary required for new session' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Generate title from first message (truncate to 50 chars)
      const title = message.length > 50 ? message.substring(0, 47) + '...' : message

      const { data: newSession, error: createError } = await supabaseUser
        .from('ai_chat_sessions')
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          title: title,
          context_snapshot: summary
        })
        .select('id')
        .single()

      if (createError || !newSession) {
        console.error('Session creation error:', createError)
        throw new Error('Failed to create chat session')
      }

      currentSessionId = newSession.id
    }

    // Save user message to database
    const { data: userMsg, error: userMsgError } = await supabaseUser
      .from('ai_chat_messages')
      .insert({
        session_id: currentSessionId,
        role: 'user',
        content: message
      })
      .select('id')
      .single()

    if (userMsgError) {
      console.error('User message save error:', userMsgError)
      throw new Error('Failed to save message')
    }

    // Get context snapshot for this session
    let contextData = summary
    if (!contextData && currentSessionId) {
      const { data: session } = await supabaseUser
        .from('ai_chat_sessions')
        .select('context_snapshot')
        .eq('id', currentSessionId)
        .single()
      contextData = session?.context_snapshot
    }

    // Build system instruction based on language
    const languageInstruction = language === 'zh' 
      ? '请用中文回复用户。'
      : language === 'ms'
      ? 'Sila balas dalam Bahasa Melayu.'
      : 'Please respond in English.'

    const systemInstruction = `You are an expert restaurant business analyst assistant for "${restaurantName}".

Your goal is to help the merchant understand their business performance based on the provided dashboard data.

Guidelines:
1. Be concise, professional, and encouraging.
2. Use specific numbers from the data to back up your points.
3. Formatting: Use Markdown for bolding key figures (e.g., **RM 1,200**).
4. If the user asks about something not in the data, politely explain you only have access to the current dashboard summary.
5. Analyze trends if you see them (e.g., high viral coefficient but low retention).
6. ${languageInstruction}

Current Dashboard Data (JSON):
${JSON.stringify(contextData)}`

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction
    })

    // Build chat history for Gemini
    const geminiHistory = conversationHistory.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }))

    // Start chat with history
    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      }
    })

    // Send message and get streaming response
    const result = await chat.sendMessageStream(message)

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = ''
        
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              fullResponse += text
              // Send chunk as Server-Sent Event format
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: text })}\n\n`))
            }
          }

          // Save AI response to database after streaming completes
          await supabaseUser
            .from('ai_chat_messages')
            .insert({
              session_id: currentSessionId,
              role: 'model',
              content: fullResponse
            })

          // Send completion event with session ID
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            done: true, 
            sessionId: currentSessionId 
          })}\n\n`))
          
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            error: 'Streaming failed' 
          })}\n\n`))
          controller.close()
        }
      }
    })

    // Return streaming response
    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Check for rate limit errors from Gemini
    if (errorMessage.includes('429') || errorMessage.includes('quota')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI service is temporarily busy. Please try again in a moment.' 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
