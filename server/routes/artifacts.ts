// server/routes/artifacts.ts
import { Router, Request, Response, RequestHandler } from "express";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { z } from "zod";

const router = Router();

// Apply security headers via helmet specifically optimized for an iframe environment
router.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Configure enterprise CORS settings for local dev and AI Studio preview host domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://ais-dev-zvaes6r7lucgfzx3e5xk5o-470705972669.asia-northeast1.run.app",
  "https://ais-pre-zvaes6r7lucgfzx3e5xk5o-470705972669.asia-northeast1.run.app",
];

router.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".run.app") ||
        /^https:\/\/ais-(dev|pre)-.*$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Request blocked by enterprise CORS gateway policy."));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Implement sliding-window rate limiting to protect Gemini API quota (max 15 requests per minute per IP)
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Rate limit exceeded: Maximum of 15 portfolio generations per minute is allowed.",
  },
});

// Zod validation schema for student portfolio milestone artifacts
const createArtifactSchema = z.object({
  studentId: z.string().min(1, "studentId is required"),
  teacherId: z.string().nullable().optional(),
  subject: z.string().min(1, "subject is required"),
  imageUrl: z.string().url("imageUrl must be a valid URL string"),
  tags: z.array(z.string()).default([]),
  targetMonth: z.string().regex(/^\d{4}-\d{2}$/, "targetMonth must be in YYYY-MM format"),
  studentName: z.string().min(1, "studentName is required"),
});

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
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

// Lazy initialization of Supabase client to prevent immediate startup crash if keys are temporarily missing
let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";
    
    if (!process.env.VITE_SUPABASE_URL || (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.VITE_SUPABASE_ANON_KEY)) {
      console.warn("[artifacts] Supabase environment variables are missing! Using fallback configuration.");
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

const handleCreateArtifact: RequestHandler = async (req: Request, res: Response) => {
  try {
    // 1. Structural schema validation via Zod
    const validationResult = createArtifactSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid payload parameters.",
        errors: validationResult.error.issues,
      });
      return;
    }

    const { studentId, teacherId, subject, imageUrl, tags, targetMonth, studentName } = validationResult.data;

    // 2. Generate the AI Reflection Note using gemini-3.5-flash (the modern non-deprecated model)
    const ai = getGenAI();
    const systemPrompt = `You are an expert academic director at a premium English Academy in Seoul.
Write a highly professional, 2-sentence progress narrative for a student's monthly portfolio.

Student Name: ${studentName}
Subject: ${subject}
Tags Selected by Teacher: ${tags.join(', ')}

CRITICAL CONSTRAINTS:
- Maximum 45 words. Exactly 2 sentences.
- Sentence 1: Acknowledge the specific milestone/skill demonstrated by the tags.
- Sentence 2: Provide an actionable, positive next step for the upcoming month.
- Tone: Objective, encouraging, authoritative, and academic. Do NOT use generic praise.
- Do NOT include any quotation marks, introductory text, or markdown code blocks in your output.`;

    // Generate response
    const aiResult = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
    });

    const rawText = aiResult.text || "";
    const aiReflectionText = rawText.trim().replace(/^["'\s]+|["'\s]+$/g, "");

    // 3. Persist entry directly inside Supabase Database
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('artifacts')
      .insert([
        {
          student_id: studentId,
          teacher_id: teacherId || null,
          subject: subject,
          image_url: imageUrl,
          ai_reflection: aiReflectionText,
          tags: tags,
          target_month: targetMonth
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("[Supabase DB Error in artifacts router]:", error);
      throw error;
    }

    // 4. Return successful compiled object back to Client UI
    res.status(201).json({ success: true, data });
    return;

  } catch (error: any) {
    console.error("Artifact Creation Loop Failure:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server pipeline failure." });
    return;
  }
};

// Registered with sliding-window rate limiter protection
router.post('/api/artifacts/create', aiRateLimiter, handleCreateArtifact);

export default router;

