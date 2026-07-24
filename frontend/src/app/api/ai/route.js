import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are TechNest AI, a helpful shopping assistant for TechNest — a premium tech e-commerce store. You help customers find products, answer questions about shipping, returns, warranty, and provide personalized recommendations.

About TechNest:
- Free shipping on orders over $50
- 30-day hassle-free returns
- 2-year warranty on all products
- Products: laptops, phones, headphones, earbuds, smartwatches, tablets, monitors, keyboards, mice, cameras, speakers, chargers, cases, and more
- Premium brands at competitive prices

Guidelines:
- Be friendly, helpful, and conversational
- Give direct answers — don't just redirect to pages
- If asked "how are you" or casual chat, respond naturally and guide back to shopping
- Recommend specific product types based on user needs
- Answer questions about TechNest policies accurately
- If you don't know something specific, be honest but helpful
- Keep responses concise but informative (2-4 paragraphs max)
- Use markdown formatting: **bold** for emphasis, bullet lists for features`;

function getLocalResponse(message) {
  const lower = message.toLowerCase().trim();

  if (["hi", "hello", "hey", "howdy", "sup"].some((g) => lower.startsWith(g) || lower === g)) {
    return "Hello! Welcome to TechNest. I'm your AI shopping assistant. How can I help you today? I can recommend products, answer questions about shipping and returns, or help you find exactly what you're looking for.";
  }
  if (["thank", "thanks", "thx"].some((t) => lower.startsWith(t))) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  if (["bye", "goodbye", "see you"].some((f) => lower.startsWith(f))) {
    return "Goodbye! Thanks for visiting TechNest. Come back anytime!";
  }
  if (lower.includes("recommend") || lower.includes("suggest") || lower.includes("what should i buy")) {
    return "I'd love to help you find something great! Here are some popular categories:\n\n- **Laptops** — work, school, or gaming\n- **Phones** — latest smartphones\n- **Audio** — headphones, earbuds, speakers\n- **Wearables** — smartwatches\n\nWhat category interests you?";
  }
  if (lower.includes("shipping") || lower.includes("delivery")) {
    return "At TechNest:\n\n- **Free shipping** on orders over $50\n- **Standard delivery**: 5-7 business days\n- **Express delivery**: 2-3 business days\n- **Tracking** available for all orders\n\nWould you like to know about a specific order?";
  }
  if (lower.includes("return") || lower.includes("refund")) {
    return "Our return policy:\n\n- **30-day returns** on most items\n- **Free return shipping** for defective products\n- **Full refund** within 5-7 business days\n- **Easy exchange** process\n\nNeed to start a return?";
  }
  if (lower.includes("warranty")) {
    return "All TechNest products include:\n\n- **2-year standard warranty** on all products\n- **Extended warranty** available at checkout\n\nHave a specific warranty question?";
  }

  return "I can help you with product recommendations, shipping info, returns, and more! Try asking about a specific product category or topic.";
}

async function callGroq(apiMessages, stream) {
  const payload = {
    model: MODEL,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...apiMessages],
    temperature: 0.7,
    max_tokens: 1024,
    stream,
  };

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  return res;
}

function streamLocalResponse(text) {
  const encoder = new TextEncoder();
  const words = text.split(" ");
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: words[i] + " " })}\n\n`));
        await new Promise((r) => setTimeout(r, 20 + Math.random() * 20));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

export async function POST(request) {
  try {
    const { message, history = [], stream } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const hasApiKey = GROQ_API_KEY && !GROQ_API_KEY.includes("placeholder");

    const apiMessages = history.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));
    apiMessages.push({ role: "user", content: message });

    if (hasApiKey) {
      try {
        const res = await callGroq(apiMessages, !!stream);

        if (!res.ok) {
          const errBody = await res.text();
          console.error("Groq API error:", res.status, errBody);
          const local = getLocalResponse(message);
          if (stream) {
            return new Response(streamLocalResponse(local), {
              headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
            });
          }
          return NextResponse.json({ response: local, source: "local-fallback" });
        }

        if (stream) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();

          const streamResponse = new ReadableStream({
            async start(controller) {
              let buffer = "";
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop() || "";
                  for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const data = line.slice(6).trim();
                    if (data === "[DONE]") {
                      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                      controller.close();
                      return;
                    }
                    try {
                      const parsed = JSON.parse(data);
                      const content = parsed.choices?.[0]?.delta?.content;
                      if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
                      }
                    } catch { /* skip */ }
                  }
                }
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
              } catch (err) {
                console.error("Stream read error:", err);
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
              }
            },
          });

          return new Response(streamResponse, {
            headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
          });
        }

        const data = await res.json();
        const aiResponse = data.choices?.[0]?.message?.content;
        if (aiResponse) {
          return NextResponse.json({ response: aiResponse, source: "groq" });
        }
      } catch (err) {
        console.error("Groq fetch failed:", err.message);
      }
    }

    const localResponse = getLocalResponse(message);
    if (stream) {
      return new Response(streamLocalResponse(localResponse), {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }
    return NextResponse.json({ response: localResponse, source: "local" });
  } catch (err) {
    console.error("API route error:", err);
    const fallback = "I'm having trouble right now. Please try again in a moment.";
    if (stream) {
      return new Response(streamLocalResponse(fallback), {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }
    return NextResponse.json({ response: fallback, source: "error" });
  }
}
