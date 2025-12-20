import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../../types";

/**
 * Robust AI Instance Getter
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("❌ CRITICAL ERROR: API_KEY is missing!");
    throw new Error("API_KEY_MISSING");
  }
  
  return new GoogleGenAI({ apiKey });
};

/**
 * Solve complex questions using Gemini 3 Flash (Multimodal & Fast)
 */
export async function solveQuestion(prompt: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const systemInstruction = language === 'hi' 
      ? "You are 'Master Sahab', a brilliant Indian teacher. Explain complex topics using Hinglish (Hindi + English). Provide step-by-step solutions. Technical terms should be in English, explanations in Hindi. Use clean Markdown formatting."
      : "You are 'Master Sahab', an expert academic tutor. Provide clear, professional, step-by-step solutions in English using clean Markdown formatting.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Question: ${prompt}` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error: any) {
    console.error("Solve Error:", error);
    throw new Error("Master Sahab's brain is tired. Please try again later.");
  }
}

/**
 * Quick definitions/explanations using Flash
 */
export async function fastExplain(prompt: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const systemInstruction = language === 'hi'
      ? "Give a quick 2-sentence explanation in Hindi, keeping technical words in English."
      : "Give a quick 2-sentence explanation in clear English.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Explain briefly: ${prompt}` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Fast Explain Error:", error);
    return "Something went wrong with the quick ask feature.";
  }
}

/**
 * Generate Bilingual Academic Quiz
 */
export async function generateAIQuiz(grade: string, subject: string): Promise<Question[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Generate 20 MCQ questions for Class ${grade}, Subject: ${subject}. Questions must be academically accurate for Indian curriculum. Output MUST be an array of objects.` }] }],
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

    const quizData = JSON.parse(response.text?.trim() || "[]");
    return quizData;
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw new Error("Could not generate quiz at this moment.");
  }
}

/**
 * Solve from photo using Multimodal Gemini Flash
 */
export async function solveWithImage(base64Image: string, language: 'en' | 'hi') {
  try {
    const ai = getAI();
    const systemInstruction = language === 'hi'
      ? "Identify and solve the question in this image. Use Hindi for explanation and English for technical terms. Provide step-by-step solution."
      : "Identify and solve the question in this image step-by-step in English. Use clean Markdown formatting.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Identify the academic question and solve it completely." }
        ]
      }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4
      }
    });

    return response.text;
  } catch (error) {
    console.error("Image Solve Error:", error);
    throw new Error("Could not process the image. Please try typing the question.");
  }
}