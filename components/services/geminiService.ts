import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../../types";

/**
 * Robust AI Instance Getter
 * Fetches the API key directly from the environment
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("❌ MASTER SAHAB ERROR: API_KEY is missing in environment.");
    throw new Error("API_KEY_MISSING");
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
      ? "You are 'Master Sahab', a brilliant Indian teacher. Explain complex topics using Hinglish (Hindi + English). Provide step-by-step solutions. Technical terms should be in English, explanations in Hindi. Use clean Markdown formatting."
      : "You are 'Master Sahab', an expert academic tutor. Provide clear, professional, step-by-step solutions in English using clean Markdown formatting.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `Solve this academic question: ${prompt}` }] },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 } // Disabled for faster text-only response
      }
    });

    if (!response.text) {
      console.warn("⚠️ AI returned empty text.");
      throw new Error("EMPTY_RESPONSE");
    }
    return response.text;
  } catch (error: any) {
    console.error("❌ Solve Question Error:", error);
    throw new Error("Master Sahab is thinking too much. Please try a simpler question.");
  }
}

/**
 * Quick definitions/explanations
 */
export async function fastExplain(prompt: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const systemInstruction = language === 'hi'
      ? "Give a quick 2-sentence explanation in Hindi, keeping technical words in English."
      : "Give a quick 2-sentence explanation in clear English.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `Briefly define: ${prompt}` }] },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "I'm sorry, I couldn't find a quick explanation.";
  } catch (error) {
    console.error("❌ Fast Explain Error:", error);
    return "Master Sahab is busy teaching another class. Try again in a bit?";
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
      contents: { parts: [{ text: `Generate 20 MCQ questions for Class ${grade}, Subject: ${subject}. Questions must be academically accurate for Indian school curriculum. Provide questions in both English and Hindi.` }] },
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
    console.error("❌ Quiz Generation Error:", error);
    throw error;
  }
}

/**
 * Solve from photo using Multimodal Gemini Flash
 */
export async function solveWithImage(base64Image: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const systemInstruction = language === 'hi'
      ? "Identify and solve the academic question in this image. Use Hindi for explanation and English for technical terms. Provide step-by-step solution."
      : "Identify and solve the academic question in this image step-by-step in English. Use clean Markdown formatting.";

    // Strictly structured multimodal input
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Read the question from this image and solve it step-by-step." }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4
      }
    });

    if (!response.text) throw new Error("Could not process image.");
    return response.text;
  } catch (error: any) {
    console.error("❌ Camera Solve Error:", error);
    throw new Error("Master Sahab couldn't read the image clearly. Please try again with better light.");
  }
}