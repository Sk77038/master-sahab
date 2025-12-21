
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../../types";

/**
 * Robust AI Instance Getter
 * Injected via Vite Define at build time
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("CRITICAL: Master Sahab API Key is missing. Check deployment environment variables.");
    throw new Error("SERVER_CONFIG_ERROR");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Solve complex questions using Gemini 3 Flash
 */
export async function solveQuestion(prompt: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const systemInstruction = language === 'hi' 
      ? "You are 'Master Sahab', an expert teacher. Explain in Hinglish (mix of Hindi and English). Use step-by-step formatting."
      : "You are 'Master Sahab', an expert teacher. Explain clearly in English with step-by-step formatting.";

    // Using the simplest string content format for maximum stability
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `${systemInstruction}\n\nQuestion: ${prompt}` }] }],
      config: {
        temperature: 0.7,
      }
    });

    if (!response.text) throw new Error("EMPTY_RESPONSE");
    return response.text;
  } catch (error: any) {
    console.error("AI Solve Error:", error);
    throw new Error("Master Sahab is taking a break. Please check your internet or try again later.");
  }
}

/**
 * Quick definitions/explanations
 */
export async function fastExplain(prompt: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Give a 2-sentence quick explanation of: ${prompt} (${language === 'hi' ? 'Explain in Hindi' : 'Explain in English'})` }] }],
      config: { temperature: 0.5 }
    });
    return response.text || "I couldn't find a quick answer.";
  } catch (error) {
    console.error("Fast Explain Error:", error);
    return "Master Sahab is busy. Try again?";
  }
}

/**
 * Generate AI Quiz with strictly formatted JSON
 */
export async function generateAIQuiz(grade: string, subject: string): Promise<Question[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Generate a 20-question MCQ quiz for Class ${grade}, Subject: ${subject}. Return valid JSON.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text_en: { type: Type.STRING },
              text_hi: { type: Type.STRING },
              options_en: { type: Type.ARRAY, items: { type: Type.STRING } },
              options_hi: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation_en: { type: Type.STRING },
              explanation_hi: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["id", "text_en", "text_hi", "options_en", "options_hi", "correctAnswer", "explanation_en", "explanation_hi", "difficulty", "type"]
          }
        }
      }
    });

    const text = response.text?.trim() || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    throw error;
  }
}

/**
 * Solve from photo using Multimodal Gemini Flash
 */
export async function solveWithImage(base64Image: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Read the academic question from this image and solve it step-by-step." }
        ]
      },
      config: {
        temperature: 0.4
      }
    });
    return response.text;
  } catch (error: any) {
    console.error("Camera Error:", error);
    throw new Error("Master Sahab couldn't read the photo. Please use better lighting.");
  }
}
