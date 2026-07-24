"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "What laptop do you recommend for gaming?",
  "Tell me about your return policy",
  "What's the best headphones under $200?",
  "Compare phones vs tablets for productivity",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const idCounter = useRef(0);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm TechNest AI, your shopping assistant. I can help you find products, compare options, answer questions about shipping, returns, and more. What can I help you with?",
      suggestions: [...SUGGESTIONS],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, []);

  const getNextId = () => {
    idCounter.current += 1;
    return idCounter.current;
  };

  const generateSuggestions = (responseText) => {
    const lower = responseText.toLowerCase();
    const suggestions = [];
    if (lower.includes("laptop") || lower.includes("computer")) {
      suggestions.push("Show me gaming laptops", "What's the cheapest laptop?", "Compare MacBook vs ThinkPad");
    } else if (lower.includes("phone") || lower.includes("smartphone")) {
      suggestions.push("Best camera phone?", "iPhone vs Samsung?", "Budget phones under $300");
    } else if (lower.includes("headphone") || lower.includes("audio") || lower.includes("earbuds")) {
      suggestions.push("Noise cancelling options?", "Best for workouts?", "Wired vs wireless?");
    } else if (lower.includes("shipping") || lower.includes("delivery")) {
      suggestions.push("How do I track my order?", "Do you offer express shipping?");
    } else if (lower.includes("return") || lower.includes("refund")) {
      suggestions.push("How long do returns take?", "Can I exchange an item?");
    } else {
      suggestions.push("Recommend a product", "What's new?", "Help me find something");
    }
    return suggestions.slice(0, 3);
  };

  const sendToAI = async (messageText, historyForAPI) => {
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, history: historyForAPI, stream: true }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setStreamingText(fullText);
              }
            } catch { /* skip malformed chunks */ }
          }
        }
      }

      return fullText;
    } catch (err) {
      if (err.name === "AbortError") return "";
      throw err;
    } finally {
      abortRef.current = null;
    }
  };

  const addAssistantMessage = (text, parentId) => {
    const suggestions = generateSuggestions(text);
    setMessages((prev) => [
      ...prev,
      { id: `reply-${parentId}`, role: "assistant", text, suggestions },
    ]);
    setStreamingText("");
  };

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const msgId = getNextId();
    const userMsg = { id: `user-${msgId}`, role: "user", text: trimmed };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    const historyForAPI = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      const responseText = await sendToAI(trimmed, historyForAPI);
      if (responseText) addAssistantMessage(responseText, msgId);
    } catch {
      addAssistantMessage("Sorry, I'm having trouble connecting. Please try again.", msgId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleSuggestion = (suggestion) => {
    handleSend(suggestion);
  };

  const handleClear = () => {
    if (abortRef.current) abortRef.current.abort();
    idCounter.current = 0;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Chat cleared! How can I help you?",
        suggestions: [...SUGGESTIONS],
      },
    ]);
    setStreamingText("");
    setIsLoading(false);
  };

  const renderMarkdown = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("- **")) {
        const parts = line.split("**");
        return (
          <div key={i} className="flex gap-1 py-0.5">
            <span className="text-muted">-</span>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold">{part}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </div>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-1 py-0.5">
            <span className="text-muted">-</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        return <div key={i} className="py-0.5 font-medium">{line}</div>;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <div key={i} className="py-0.5 font-bold">{line.slice(2, -2)}</div>;
      }
      return <span key={i}>{line}{i < text.split("\n").length - 1 ? "\n" : ""}</span>;
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 flex w-[380px] flex-col rounded-2xl border border-border bg-white shadow-2xl sm:right-6"
          >
            <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-gradient-to-r from-accent to-blue-700 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">TechNest AI</h3>
                  <p className="text-[11px] text-white/70">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  title="Clear chat"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: "420px", minHeight: "320px" }}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                        {msg.role === "assistant" && (
                          <div className="mb-1 flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white font-bold">AI</div>
                          </div>
                        )}
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-accent text-white rounded-br-md"
                            : "bg-surface text-primary rounded-bl-md"
                        }`}>
                          {renderMarkdown(msg.text)}
                        </div>
                      </div>
                    </div>

                    {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && !isLoading && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-7">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestion(s)}
                            className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-accent transition-colors hover:bg-accent hover:text-white cursor-pointer"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && streamingText && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%]">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white font-bold">AI</div>
                      </div>
                      <div className="rounded-2xl rounded-bl-md bg-surface px-4 py-2.5 text-sm leading-relaxed text-primary whitespace-pre-wrap">
                        {renderMarkdown(streamingText)}
                        <span className="inline-block h-4 w-0.5 animate-pulse bg-accent ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {isLoading && !streamingText && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%]">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white font-bold">AI</div>
                      </div>
                      <div className="inline-flex gap-1.5 rounded-2xl rounded-bl-md bg-surface px-4 py-3">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-primary placeholder-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white transition-all hover:bg-accent-hover hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-600 text-white shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/40 hover:scale-105 sm:right-6 cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
