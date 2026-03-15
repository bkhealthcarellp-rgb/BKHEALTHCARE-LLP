import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: process.env.API_KEY is expected to be available in the environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  if (!apiKey) return "AI Analysis unavailable: No API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a medical triage assistant for 'Sehat Ka Saathi'. 
      Analyze the following symptoms provided by a patient: "${symptoms}".
      
      Provide a concise 2-sentence summary recommending the type of specialist they should see or if a lab test is relevant. 
      Do not give a medical diagnosis.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over depth for UI responsiveness
      }
    });

    return response.text || "Could not analyze symptoms.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Unable to perform AI analysis at this time.";
  }
};