import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import type { DashboardSummary } from "../../types/analytics.types";
import { type Language } from "../../translations";
import { cn } from "../../lib/utils";

interface MerchantAIChatProps {
  summary: DashboardSummary | null;
  restaurantName: string;
  language: Language;
}

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export function MerchantAIChat({ summary, restaurantName, language }: MerchantAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Set initial greeting when opened, but don't start API session yet
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "init",
          role: "model",
          text: language === 'zh' 
            ? `您好！我已经准备好分析 **${restaurantName}** 的数据。请告诉我您想了解什么？`
            : language === 'ms'
            ? `Hai! Saya bersedia untuk menganalisis data **${restaurantName}**. Apa yang anda ingin tahu?`
            : `Hello! I'm ready to analyze your dashboard for **${restaurantName}**. What would you like to know?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, restaurantName, language, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

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

    try {
      let currentSession = chatSession;

      // Lazy initialization on first message
      if (!currentSession) {
        if (!summary) {
          throw new Error("Dashboard data not available yet");
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("API Key not found");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash", // Reverted to 2.5-flash as requested
          systemInstruction: `You are an expert restaurant business analyst assistant for "${restaurantName}".
          
          Your goal is to help the merchant understand their business performance based on the provided dashboard data.
          
          Guidelines:
          1. Be concise, professional, and encouraging.
          2. Use specific numbers from the data to back up your points.
          3. Formatting: Use Markdown for bolding key figures (e.g., **RM 1,200**).
          4. If the user asks about something not in the data, politely explain you only have access to the current dashboard summary.
          5. Analyze trends if you see them (e.g., high viral coefficient but low retention).
          
          Current Dashboard Data (JSON):
          ${JSON.stringify(summary)}
          `
        });

        currentSession = model.startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });

        setChatSession(currentSession);
      }

      const result = await currentSession.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      if (err.message?.includes("429") || err.status === 429) {
        setError("Usage limit reached. Please wait a moment before trying again.");
      } else {
        setError("Failed to send message. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If hidden or no summary, don't render anything (or just render button)
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
                <CardTitle className="text-sm font-bold">AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">{restaurantName}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
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
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
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
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your dashboard..."
                  className="flex-1 focus-visible:ring-primary/50"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isLoading}
                  size="icon"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
