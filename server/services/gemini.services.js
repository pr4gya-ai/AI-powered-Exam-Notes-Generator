import { buildPrompt } from "../utils/promptBuilder.js";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
];

const buildUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export const generateGeminiResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }

  let lastError;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(`${buildUrl(model)}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`Gemini API error: ${errorText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error("Gemini returned empty response");
      }

      const cleanText = generatedText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        return JSON.parse(cleanText);
      } catch {
        return { content: cleanText };
      }
    } catch (error) {
      // If quota problem, try next model; otherwise stop and bubble it up
      lastError = error;

      if (error?.status === 429) {
        console.warn(`Quota exceeded for model ${model}, trying next model...`);
        continue;
      }

      console.error("Gemini Service Error:", error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  // If all models failed, report the last error (likely quota)
  console.error("Gemini Service Error (all models failed):", lastError);

  // Check if it's a quota error and provide a user-friendly message
  if (lastError?.status === 429 || lastError?.message?.includes('quota') || lastError?.message?.includes('RESOURCE_EXHAUSTED')) {
    throw new Error("AI service quota exceeded. Please try again later or upgrade your API plan at https://ai.google.dev/gemini-api/docs/rate-limits");
  }

  throw new Error(`AI generation failed: ${lastError?.message}`);
};