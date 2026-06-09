// server.ts
// Express backend proxying server-side Gemini AI calls to protect secrets,
// and wrapping the Vite development middleware.

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import reflectionRouter from "./server/routes/reflection.ts";
import artifactsRouter from "./server/routes/artifacts.ts";

// Load local environment variables for non-sandboxed executions
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Lazy-construct server-side Google GenAI client to prevent crashing if the key is missing on launch
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Mount the customized reflection route handler
  app.use(reflectionRouter);
  app.use(artifactsRouter);

  // ==================== CORS-ENABLED BULLETPROOF KOREAN FONT PROXY ====================
  // Resolves, proxies, and streams a verified CJK/Korean TrueType font (.ttf) to bypass transient 404s
  // and CORS constraints. This is highly optimized for React-PDF client-side embed engines.
  let fontCache: Buffer | null = null;
  app.get("/api/font/noto-sans-kr.ttf", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

      if (fontCache) {
        res.setHeader("Content-Type", "font/ttf");
        return res.send(fontCache);
      }

      // Try Google Fonts CSS API to scrape the current active TrueType Font (.ttf) URL
      try {
        console.log("[FontProxy] Scraping Noto Sans KR CSS API form Google Fonts...");
        const cssResponse = await fetch("https://fonts.googleapis.com/css?family=Noto+Sans+KR:400", {
          headers: {
            // An older browser User-Agent forces Google Fonts classic API to serve standard .ttf format
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30"
          }
        });
        if (cssResponse.ok) {
          const cssText = await cssResponse.text();
          const ttfUrlMatch = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
          if (ttfUrlMatch) {
            const actualFontUrl = ttfUrlMatch[1].replace(/['"]/g, "");
            console.log("[FontProxy] Successfully resolved active gstatic URL:", actualFontUrl);
            const fontResponse = await fetch(actualFontUrl);
            if (fontResponse.ok) {
              const buf = Buffer.from(await fontResponse.arrayBuffer());
              fontCache = buf;
              res.setHeader("Content-Type", "font/ttf");
              return res.send(buf);
            }
          }
        }
      } catch (innerErr) {
        console.error("[FontProxy] Google Fonts CSS scraping failed, trying primary CDN fallback:", innerErr);
      }

      // Fallback 1: Noto Sans KR Variable TrueType font from Google Fonts original github branch on jsDelivr
      try {
        console.log("[FontProxy] Primary CDN fallback: Pulling Noto Sans KR Var ttf from Google Fonts GitHub...");
        const cdnUrl = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf";
        const fontResponse = await fetch(cdnUrl);
        if (fontResponse.ok) {
          const buf = Buffer.from(await fontResponse.arrayBuffer());
          fontCache = buf;
          res.setHeader("Content-Type", "font/ttf");
          return res.send(buf);
        }
      } catch (innerErr) {
        console.error("[FontProxy] Primary CDN fallback failed:", innerErr);
      }

      // Fallback 2: Nanum Gothic Regular TrueType font from Google Fonts original github branch on jsDelivr
      try {
        console.log("[FontProxy] Secondary CDN fallback: Pulling Nanum Gothic Regular ttf from Google Fonts GitHub...");
        const cdnUrl = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanumgothic/NanumGothic-Regular.ttf";
        const fontResponse = await fetch(cdnUrl);
        if (fontResponse.ok) {
          const buf = Buffer.from(await fontResponse.arrayBuffer());
          fontCache = buf;
          res.setHeader("Content-Type", "font/ttf");
          return res.send(buf);
        }
      } catch (innerErr) {
        console.error("[FontProxy] Secondary CDN fallback failed:", innerErr);
      }

      throw new Error("All resolved font pipelines collapsed.");
    } catch (err: any) {
      console.error("[FontProxy] Critical front-end fonts failure:", err);
      return res.status(500).json({ error: "Failed to resolve Korean font", details: err.message });
    }
  });

  // ==================== API ENDPOINT: AI PORTFOLIO NARRATIVE GENERATOR ====================
  // Combines brief teacher bulletins and ESL curriculum tags into cohesive, professional, 
  // encouraging progress diary commentaries written for Korean families.
  app.post("/api/generate-narrative", async (req, res) => {
    try {
      const { teacherNotes, tags, studentName, subjectName } = req.body;

      if (!studentName || !subjectName) {
        return res.status(400).json({ error: "Missing required profile context: studentName and subjectName are required." });
      }

      const activeNotes = teacherNotes || "Working steadily on core classroom interactions.";
      const activeTags = tags && Array.isArray(tags) ? tags.join(", ") : "General Mastery";

      const prompt = `Compose a highly professional, encouraging, parent-friendly ESL portfolio progress diary entry (narrative comment) for the student named **${studentName}** under the subject focus **${subjectName}**.
      
      We work in a high-prestige private language academy (Hakwon) in South Korea. The narrative is read by Korean parents who expect elite, objective, and action-oriented feedback.

      The user provided the following inputs (Curated Autonomy model):
      - Observer Core Feedback: "${activeNotes}"
      - Curriculum Target Badges: "${activeTags}"

      Formatting Directives:
      - Length: Approximately 100-150 words.
      - Tone: Formally polite, constructive, and descriptive of educational growth. Use "curriculum-inspired" vocabulary (e.g. "phonological processing", "syntactic alignment", "expressive capability") over generic adjectives.
      - Style: Start by praising a specific behavioral pattern or skill demonstrated in the tasks. Connect it directly to the curriculum targets. Transition to an practical description of what the student mastered, and end with a concrete, welcoming NEXT period step (academic goal) to eliminate teacher writing overhead.
      - Pronouns: Use the student's name (${studentName}) or appropriate pronouns (he/him, she/her) naturally.
      
      Output ONLY the resulting English narrative paragraph. Do not wrap in markdown quotes or preface with other labels.`;

      // Acquire initialized AI client
      const ai = getGenAIClient();
      
      // Request progress narrative generation from the recommended basic text model 'gemini-3.5-flash'
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const rawText = response.text || "Working diligently with high classroom interaction scores.";
      const cleanedText = rawText.replace(/^["'\s]+|["'\s]+$/g, ""); // strip outer wrapping quotes if any

      return res.json({ narrative: cleanedText });
    } catch (err: any) {
      console.error("AI Narrative compiler endpoint registry error:", err);
      return res.status(500).json({ 
        error: "AI Generation failed", 
        details: err.message,
        missingKey: !process.env.GEMINI_API_KEY
      });
    }
  });

  // ==================== APP DEV AND STATIC STORAGE RESOLVERS ====================
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist/ folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`White-Label ESL diary full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
