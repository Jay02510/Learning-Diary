// white-label-mvp/app/api/generate-narrative/generateTeacherReflection.ts

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

/**
 * ==========================================
 *              TYPE VALIDATION
 * ==========================================
 * Zod schema to validate incoming client requests
 * before processing with the LLM.
 */
export const GenerateReflectionSchema = z.object({
  studentName: z.string({
    required_error: "Student name is required",
    invalid_type_error: "Student name must be a string",
  }).trim().min(1, "Student name cannot be empty"),
  
  subjectName: z.string({
    required_error: "Subject name is required",
    invalid_type_error: "Subject name must be a string",
  }).trim().min(1, "Subject focus is required"),
  
  selectedTags: z.array(
    z.string().trim().min(1, "Tags cannot be empty strings")
  ).min(1, "At least one pedagogical tag must be selected"),
});

export type GenerateReflectionInput = z.infer<typeof GenerateReflectionSchema>;

/**
 * ==========================================
 *             THE SYSTEM PROMPT
 * ==========================================
 * Specific instructions tailored to the Korean ESL (Hakwon) parent demographic.
 * Parents expect formal politeness, objective learning markers, and structured developmental actions.
 */
export const KOREAN_ESL_SYSTEM_PROMPT = `
You are an expert academic director at a premium English Academy (Hakwon) in Seoul. 
Your job is to read a set of pedagogical tags and generate a highly professional, 2-sentence progress narrative for a student's monthly portfolio PDF.

CRITICAL FORMATTING CONSTRAINTS:
- Maximum word count: 45 words total.
- Exactly 2 sentences. No more, no less.
- Avoid generic praise like "They did a good job!" Instead, use clear, objective, progress-oriented language.
- Use an encouraging but strictly professional, authoritative academic tone.
- Do NOT wrap the output in quotation marks or markdown blocks. Do not return introductory text.

Sentence 1 Structure: Acknowledge the specific milestone/skill demonstrated by the tags.
Sentence 2 Structure: Provide an actionable, positive next step or point of focus for the upcoming month.

Example input tags: ["Strong Argument Structure", "Spelling Errors", "Excellent Participation"]
Example output: "Jay demonstrated exceptional critical thinking and structural clarity during our monthly opinion writing task. Moving forward, we will focus on micro-level spelling patterns to further elevate his written fluency."
`;

/**
 * Lazy-initializes the modern @google/genai SDK client.
 * This prevents the server from crashing on boot if the environment variable is not defined.
 */
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing in the environment config.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * ==========================================
 *             THE SERVER ACTION
 * ==========================================
 * Modular TypeScript backend handler (Next.js Server Action / API Route controller)
 * to generate professional, parent-facing educational commentary.
 * 
 * @param input Validate-ready input matching GenerateReflectionInput schema
 * @returns Object containing the generated teacher's reflection text
 */
export async function generateTeacherReflection(input: unknown): Promise<{ reflection: string }> {
  // 1. Zod input assertion to ensure type safety
  const validationResult = GenerateReflectionSchema.safeParse(input);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.errors.map(err => err.message).join(", ");
    throw new Error(`Inbound payload validation failed: ${errorDetails}`);
  }

  const { studentName, subjectName, selectedTags } = validationResult.data;

  // 2. Format context fields elegantly for the generative model
  const tagBulletList = selectedTags.map(tag => `- ${tag}`).join("\n");
  const modelPrompt = `
Generate a 2-sentence teacher reflection for:
- Student Name: ${studentName}
- Subject: ${subjectName}
- Demonstrated Indicators/Tags:
${tagBulletList}

Write the reflection strictly according to the system rules of professional Hakwon parent communication.
`;

  // 3. Perform generative transaction inside a safe try-catch with a structured fallback
  try {
    const ai = getGenAIClient();
    
    // Use the recommended basic text model 'gemini-3.5-flash'
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modelPrompt,
      config: {
        systemInstruction: KOREAN_ESL_SYSTEM_PROMPT,
        temperature: 0.6,
      },
    });

    const responseText = result.text?.trim() || "";

    if (!responseText) {
      throw new Error("Received empty or corrupt generation from Gemini.");
    }

    // Secondary sanitization to strip optional markdown or surrounding quotes a generic model might return
    const sanitizedReflection = responseText
      .replace(/^["'\s]+|["'\s]+$/g, "")
      .replace(/\s+/g, " ");

    return { reflection: sanitizedReflection };

  } catch (error: any) {
    console.error("Failed to generate AI Teacher Reflection:", error);

    // 4. Elegant production fallback to maintain app stability for parents and teachers
    const tagSummary = selectedTags.length > 1
      ? `${selectedTags.slice(0, -1).join(", ")}, and ${selectedTags[selectedTags.length - 1]}`
      : selectedTags[0];
      
    const defaultFallback = `${studentName} showed steady commitment when handling core classroom objectives in ${subjectName}, successfully demonstrating progress in ${tagSummary.toLowerCase()}. We will continue providing targeted materials in the coming weeks to build upon these foundational gains.`;

    return { reflection: defaultFallback };
  }
}
