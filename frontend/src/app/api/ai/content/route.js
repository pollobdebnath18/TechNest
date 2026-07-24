import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-8b-8192";

const templatePrompts = {
  blog: {
    label: "Blog Post",
    placeholder: "e.g., The future of wireless earbuds in 2026",
    prompt: (topic, keywords, length) =>
      `Write a professional blog post about "${topic}" for a tech e-commerce store called TechNest.${keywords ? ` Include these keywords naturally: ${keywords}.` : ""} Make it engaging, informative, and SEO-friendly. Use markdown formatting with headers (##), bullet lists, and bold text. The post should be ${length === "short" ? "around 150 words" : length === "long" ? "around 700 words" : "around 350 words"}.`,
  },
  description: {
    label: "Product Description",
    placeholder: "e.g., Wireless noise-cancelling headphones with 30hr battery",
    prompt: (topic, keywords, length) =>
      `Write a compelling product description for "${topic}" for a tech store called TechNest.${keywords ? ` Highlight these features: ${keywords}.` : ""} Include: key features, why it's special, technical highlights, and a call to action. Use markdown formatting with **bold** for feature names, bullet lists, and a specs section. Make it ${length === "short" ? "around 100 words" : length === "long" ? "around 500 words" : "around 250 words"}. Mention TechNest's 2-year warranty and free shipping over $50.`,
  },
  social: {
    label: "Social Media Post",
    placeholder: "e.g., New product launch announcement for wireless earbuds",
    prompt: (topic, keywords, length) =>
      `Write a ${length === "short" ? "short and punchy" : length === "long" ? "detailed and compelling" : "engaging"} social media post about "${topic}" for TechNest's tech store.${keywords ? ` Include: ${keywords}.` : ""} Make it shareable with a clear call to action. Include relevant hashtags. Use emojis where appropriate. The tone should be modern, exciting, and tech-savvy.`,
  },
};

function generateFallback(template, topic, keywords, length) {
  const kw = keywords || topic;
  if (template === "blog") {
    return `# ${topic}\n\nIn today's rapidly evolving tech landscape, ${topic.toLowerCase()} has become a hot topic among consumers and enthusiasts alike.\n\n## Why It Matters\n\nThe technology space continues to innovate at breakneck speed. ${topic} is at the forefront of this revolution, offering consumers unprecedented capabilities and value.\n\n## Key Takeaways\n\n- Innovation in this space is accelerating\n- Quality and reliability remain top priorities\n- Smart shopping means comparing features and understanding your needs\n\n## What to Look For\n\nWhen evaluating ${topic.toLowerCase()}, consider build quality, performance benchmarks, user reviews, and after-sales support.\n\n## Conclusion\n\n${topic} represents an exciting chapter in consumer technology. Visit our shop for the latest arrivals.`;
  }
  if (template === "description") {
    return `**${topic}**\n\nIntroducing the ${topic} — engineered for those who demand excellence.\n\n**Key Features:**\n\n- Premium build quality with lasting durability\n- Advanced technology for superior performance\n- Intuitive design for your lifestyle\n- Backed by our 2-year warranty\n\n**What's in the Box:**\n\n- 1x ${topic}\n- Premium carrying case\n- Quick start guide\n\n*Free shipping on orders over $50. 30-day hassle-free returns.*`;
  }
  return `**${topic}**\n\nTech just got an upgrade at TechNest! Discover the difference.\n\n#TechNest #Tech #Innovation`;
}

export async function POST(request) {
  try {
    const { template, topic, keywords, length, stream } = await request.json();

    if (!template || !topic) {
      return NextResponse.json({ error: "Template and topic are required" }, { status: 400 });
    }

    const tmpl = templatePrompts[template];
    if (!tmpl) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const hasApiKey = GROQ_API_KEY && !GROQ_API_KEY.includes("placeholder");

    if (!hasApiKey) {
      const content = generateFallback(template, topic, keywords, length);
      if (stream) {
        const encoder = new TextEncoder();
        const words = content.split(" ");
        const streamResponse = new ReadableStream({
          async start(controller) {
            for (let i = 0; i < words.length; i++) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: words[i] + " " })}\n\n`));
              await new Promise((r) => setTimeout(r, 20 + Math.random() * 25));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          },
        });
        return new Response(streamResponse, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
        });
      }
      return NextResponse.json({ content });
    }

    const systemMessage = "You are a professional content writer for TechNest, a premium tech e-commerce store. Write high-quality, engaging content. Use markdown formatting. Be specific and informative.";
    const userMessage = tmpl.prompt(topic, keywords, length);

    if (stream) {
      const payload = {
        model: MODEL,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        temperature: 0.8,
        max_tokens: 2048,
        stream: true,
      };

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return NextResponse.json({ error: "AI service error" }, { status: 502 });
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const streamResponse = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
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
            controller.error(err);
          }
        },
      });

      return new Response(streamResponse, {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
      });
    }

    const payload = {
      model: MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    };

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || generateFallback(template, topic, keywords, length);

    return NextResponse.json({ content, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
