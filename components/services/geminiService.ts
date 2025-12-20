
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../../types";

/**
 * Complex solving using Gemini 3 Pro.
 * Optimized for bilingual clarity (Hindi + English).
 */
export async function solveQuestion(prompt: string, language: 'en' | 'hi') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = language === 'hi' 
    ? "You are 'Master Sahab', a brilliant Indian teacher. Your goal is to explain complex topics using a mix of Hindi and English (Hinglish). Provide the main explanation in Hindi but use English for technical terms and provide a summary in English. Structure your response with clear headings."
    : "You are 'Master Sahab', an expert academic tutor. Provide clear, step-by-step solutions in professional English. Use clear headings and simple language.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Question: ${prompt}`,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      topP: 0.95,
    }
  });

  return response.text;
}

/**
 * Fast responses using Gemini Flash Lite.
 */
export async function fastExplain(prompt: string, language: 'en' | 'hi') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = language === 'hi'
    ? "Provide a quick 1-2 sentence explanation in Hindi, keeping technical terms in English."
    : "Provide a quick 1-2 sentence explanation in clear English.";

  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: `Topic: ${prompt}`,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.5,
    }
  });

  return response.text;
}

/**
 * Generate 20 random bilingual academic questions.
 */
export async function generateAIQuiz(grade: string, subject: string): Promise<Question[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 20 random multiple-choice questions for Class ${grade}, Subject: ${subject}. Each question must have both English and Hindi text. Provide a clear explanation for the answer. Ensure high variety and random topics within the subject.`,
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
            correctAnswer: { type: Type.INTEGER, description: "Index 0 to 3" },
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

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI Quiz:", e);
    throw new Error("Could not generate quiz. Try again.");
  }
}

/**
 * Image analysis using Flash Image model.
 */
export async function solveWithImage(base64Image: string, language: 'en' | 'hi') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = language === 'hi'
    ? "You are Master Sahab. Identify the question in the image. Solve it step-by-step using a mix of Hindi and English. Ensure technical terms are in English."
    : "You are Master Sahab. Identify the question in the image and solve it step-by-step in clear English.";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: "Identify and solve the question in this image."
        }
      ]
    },
    config: {
      systemInstruction: systemInstruction
    }
  });

  return response.text;
}
