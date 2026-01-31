import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Bot, Send, X, Loader2, Sparkles, History, Plus } from "lucide-react";
import type { DashboardSummary } from "../../types/analytics.types";
import { getTranslation, type Language } from "../../translations";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";

interface MerchantAIChatProps {
  summary: DashboardSummary | null;
  restaurantName: string;
  restaurantId: string;
  language: Language;
}

// Message interface for chat display
interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

// Session interface for history dropdown
interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function MerchantAIChat({ summary, restaurantName, restaurantId, language }: MerchantAIChatProps) {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Session History State
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  
  // Rate Limit State
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number; resetsAt: string } | null>(null);
  
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Translations
  const t = getTranslation(language);

  // Get greeting message based on language
  const getGreeting = useCallback(() => {
    const greetings = t.merchantDashboard.aiChat.greeting;
    const greeting = greetings[language] || greetings.en;
    return greeting.replace('{restaurantName}', restaurantName);
  }, [language, restaurantName, t]);

  // Set initial greeting when opened with no session
  useEffect(() => {
    if (isOpen && messages.length === 0 && !currentSessionId) {
      setMessages([{
        id: "init",
        role: "model",
        text: getGreeting(),
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length, currentSessionId, getGreeting]);

  // Load sessions when history dropdown is opened
  useEffect(() => {
    if (showHistory && sessions.length === 0) {
      loadSessions();
    }
  }, [showHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load chat sessions from database
  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('id, title, created_at, updated_at')
        .eq('restaurant_id', restaurantId)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Load messages for a specific session
  const loadSession = async (sessionId: string) => {
    setIsLoading(true);
    setShowHistory(false);
    
    try {
      const { data: messagesData, error } = await supabase
        .from('ai_chat_messages')
        .select('id, role, content, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = (messagesData || []).map(m => ({
        id: m.id,
        role: m.role as 'user' | 'model',
        text: m.content,
        timestamp: new Date(m.created_at)
      }));

      setMessages(loadedMessages);
      setCurrentSessionId(sessionId);
      setError(null);
    } catch (err) {
      console.error('Failed to load session:', err);
      setError(t.merchantDashboard.aiChat.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new chat session
  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([{
      id: "init",
      role: "model",
      text: getGreeting(),
      timestamp: new Date()
    }]);
    setShowHistory(false);
    setError(null);
  };

  // Send message via Edge Function with streaming
  const handleSend = async () => {
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message immediately
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      if (!summary) {
        throw new Error("Dashboard data not available yet");
      }

      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      // Call Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            sessionId: currentSessionId,
            summary: currentSessionId ? undefined : summary, // Only send summary for new sessions
            restaurantId,
            restaurantName,
            language
          }),
          signal: abortControllerRef.current.signal
        }
      );

      // Handle non-streaming error responses
      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          setError(t.merchantDashboard.aiChat.rateLimitExceeded);
          if (errorData.rateLimitStatus) {
            setRateLimitInfo({
              remaining: errorData.rateLimitStatus.messagesRemaining,
              resetsAt: errorData.rateLimitStatus.windowResetsAt
            });
          }
          return;
        }
        
        throw new Error(errorData.error || 'Request failed');
      }

      // Handle streaming response
      setIsLoading(false);
      setIsStreaming(true);

      // Add placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: "model",
        text: "",
        timestamp: new Date()
      }]);

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.chunk) {
                  fullText += data.chunk;
                  // Update the AI message with accumulated text
                  setMessages(prev => prev.map(msg => 
                    msg.id === aiMsgId ? { ...msg, text: fullText } : msg
                  ));
                }
                
                if (data.done && data.sessionId) {
                  // Update session ID if this was a new session
                  if (!currentSessionId) {
                    setCurrentSessionId(data.sessionId);
                    // Refresh sessions list
                    loadSessions();
                  }
                }
                
                if (data.error) {
                  setError(data.error);
                }
              } catch {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      console.error("Chat error:", err);
      
      // Don't show error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      setError(t.merchantDashboard.aiChat.errorGeneric);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format date for session display
  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'ms' ? 'ms-MY' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If no summary available, don't render the chat button
  if (!summary) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl border-primary/20 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="bg-primary/5 border-b p-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">{t.merchantDashboard.aiChat.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{restaurantName}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* History Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setShowHistory(!showHistory)}
                  title={t.merchantDashboard.aiChat.history}
                >
                  <History className="h-4 w-4" />
                </Button>
                
                {/* History Dropdown */}
                {showHistory && (
                  <div className="absolute right-0 top-10 w-64 bg-background border rounded-lg shadow-lg z-10 overflow-hidden">
                    <div className="p-2 border-b">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start gap-2 text-sm"
                        onClick={startNewChat}
                      >
                        <Plus className="h-4 w-4" />
                        {t.merchantDashboard.aiChat.newChat}
                      </Button>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {loadingSessions ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        </div>
                      ) : sessions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {t.merchantDashboard.aiChat.noHistory}
                        </div>
                      ) : (
                        sessions.map(session => (
                          <button
                            key={session.id}
                            className={cn(
                              "w-full p-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0",
                              currentSessionId === session.id && "bg-muted/50"
                            )}
                            onClick={() => loadSession(session.id)}
                          >
                            <p className="text-sm font-medium truncate">{session.title || 'Untitled'}</p>
                            <p className="text-xs text-muted-foreground">{formatSessionDate(session.updated_at)}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Close Button */}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    )}
                  >
                    {/* Simple Markdown rendering for bold text */}
                    {msg.text.split("**").map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                </div>
              ))}
              {/* Loading/Streaming indicator */}
              {(isLoading || isStreaming) && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{t.merchantDashboard.aiChat.thinking}</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center text-xs text-destructive bg-destructive/10 p-2 rounded-md mx-4">
                  {error}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
              {/* Rate limit indicator */}
              {rateLimitInfo && rateLimitInfo.remaining <= 5 && (
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  {rateLimitInfo.remaining} {t.merchantDashboard.aiChat.rateLimitStatus}
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.merchantDashboard.aiChat.placeholder}
                  className="flex-1 focus-visible:ring-primary/50"
                  disabled={isLoading || isStreaming}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isLoading || isStreaming}
                  size="icon"
                >
                  {(isLoading || isStreaming) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          isOpen ? "bg-muted text-foreground hover:bg-muted/80" : "bg-gradient-to-r from-primary to-purple-600 text-white"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Bot className="h-8 w-8" />
        )}
      </Button>
    </div>
  );
}
