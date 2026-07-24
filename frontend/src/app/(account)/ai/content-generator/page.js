"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const templates = [
  {
    id: "blog",
    label: "Blog Post",
    description: "Generate engaging blog articles and tech content",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  },
  {
    id: "description",
    label: "Product Description",
    description: "Create compelling product descriptions that sell",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  {
    id: "social",
    label: "Social Media",
    description: "Craft social media posts that drive engagement",
    icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
  },
];

const lengthOptions = [
  { id: "short", label: "Short", description: "~100 words" },
  { id: "medium", label: "Medium", description: "~300 words" },
  { id: "long", label: "Long", description: "~600 words" },
];

export default function ContentGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("blog");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [copied, setCopied] = useState(false);
  const abortRef = useRef(null);

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  const handleGenerate = async () => {
    if (!topic.trim() || streaming) return;

    setOutput("");
    setStreamText("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate, topic, keywords, length, stream: true }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Generation failed");

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
                setStreamText(fullText);
              }
            } catch { /* skip */ }
          }
        }
      }

      setOutput(fullText);
    } catch (err) {
      if (err.name !== "AbortError") {
        setOutput("Failed to generate content. Please try again.");
      }
    } finally {
      setStreamText("");
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleCopy = () => {
    const text = output || streamText;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownload = () => {
    const text = output || streamText;
    if (!text) return;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate}-${topic.slice(0, 50).replace(/[^a-zA-Z0-9]/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStop = () => {
    if (abortRef.current) abortRef.current.abort();
    setStreaming(false);
    if (streamText) setOutput(streamText);
    setStreamText("");
  };

  const displayText = output || streamText;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">AI Content Generator</h1>
            <p className="text-muted">Generate high-quality content for your tech business</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-white p-6">
            <h3 className="text-sm font-semibold text-primary mb-4">Content Type</h3>
            <div className="space-y-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/30"
                  }`}
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                    selectedTemplate === tmpl.id ? "bg-accent text-white" : "bg-surface text-muted"
                  }`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tmpl.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{tmpl.label}</p>
                    <p className="text-xs text-muted">{tmpl.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-white p-6">
            <h3 className="text-sm font-semibold text-primary mb-4">Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted mb-1 block">Topic / Title *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={currentTemplate?.placeholder}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1 block">Keywords (optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., wireless, premium, affordable"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-2 block">Output Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {lengthOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLength(opt.id)}
                      className={`rounded-lg border-2 p-2 text-center transition-all cursor-pointer ${
                        length === opt.id
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-border text-muted hover:border-accent/30"
                      }`}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="text-[10px] text-muted">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={streaming ? handleStop : handleGenerate}
                disabled={!topic.trim() && !streaming}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer ${
                  streaming
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gradient-to-r from-accent to-blue-600 text-white hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {streaming ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Stop Generation
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Content
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-white overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-sm font-semibold text-primary">Generated Content</h3>
              {displayText && (
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface transition-colors cursor-pointer">
                    {copied ? (
                      <>
                        <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface transition-colors cursor-pointer">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  {output && !streaming && (
                    <button onClick={handleRegenerate} className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto" style={{ minHeight: "500px" }}>
              {!displayText && !streaming ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
                    <svg className="h-8 w-8 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm font-medium text-primary">No content generated yet</p>
                  <p className="mt-1 text-xs text-muted">Select a template, enter a topic, and click Generate</p>
                </div>
              ) : streaming && streamText ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-primary">
                    {streamText}
                    <span className="inline-block h-4 w-0.5 animate-pulse bg-accent ml-0.5" />
                  </div>
                </div>
              ) : streaming ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="flex gap-1">
                    <span className="h-3 w-3 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "0ms" }} />
                    <span className="h-3 w-3 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "150ms" }} />
                    <span className="h-3 w-3 animate-bounce rounded-full bg-accent/40" style={{ animationDelay: "300ms" }} />
                  </div>
                  <p className="mt-4 text-sm text-muted">Generating your content...</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-primary">{output}</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/dashboard" className="text-sm font-medium text-accent hover:text-accent-hover">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
