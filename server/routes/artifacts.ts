// server/routes/artifacts.ts
import { Router, Request, Response, RequestHandler } from "express";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const router = Router();

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
    const { studentId, teacherId, subject, imageUrl, tags, targetMonth, studentName } = req.body;

    // 1. Validation check
    if (!studentId || !subject || !imageUrl || !targetMonth || !studentName) {
      res.status(400).json({ success: false, message: "Missing required artifact fields." });
      return;
    }

    const currentTags = Array.isArray(tags) ? tags : [];

    // 2. Generate the AI Reflection Note using gemini-3.5-flash (the modern non-deprecated model for basic text)
    const ai = getGenAI();
    const systemPrompt = `You are an expert academic director at a premium English Academy in Seoul.
Write a highly professional, 2-sentence progress narrative for a student's monthly portfolio.

Student Name: ${studentName}
Subject: ${subject}
Tags Selected by Teacher: ${currentTags.join(', ')}

CRITICAL CONSTRAINTS:
- Maximum 45 words. Exactly 2 sentences.
- Sentence 1: Acknowledge the specific milestone/skill demonstrated by the tags.
- Sentence 2: Provide an actionable, positive next step for the upcoming month.
- Tone: Objective, encouraging, authoritative, and academic. Do NOT use generic praise.
- Do NOT include any quotation marks, introductory text, or markdown code blocks in your output.`;

    // generate content
    const aiResult = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
    });

    const rawText = aiResult.text || "";
    const aiReflectionText = rawText.trim().replace(/^["'\s]+|["'\s]+$/g, "");

    // 3. Write directly to Supabase Database
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
          tags: currentTags,
          target_month: targetMonth
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("[Supabase DB Error in artifacts router]:", error);
      throw error;
    }

    // 4. Return successful compiled object back to Vite UI
    res.status(201).json({ success: true, data });
    return;

  } catch (error: any) {
    console.error("Artifact Creation Loop Failure:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server pipeline failure." });
    return;
  }
};

router.post('/api/artifacts/create', handleCreateArtifact);

export default router;
