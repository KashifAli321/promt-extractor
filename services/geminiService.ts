import { GoogleGenAI } from "@google/genai";
import { BreakdownResult } from "../types";
import { GEMINI_MODEL } from "../constants";

export const SYSTEM_INSTRUCTION = `
You are a professional video cinematographer and AI prompt engineer.
Your task is to analyze a video and create a "Video Breakdown" that serves as a perfect recreation prompt.

Output format:
Title: [A Creative and Descriptive Title for the Video]
Prompt: [The detailed paragraph]

The prompt must be a single, long, detailed, cinematic paragraph including:
- Lighting setups
- Environment details
- Camera shots (angles, movement)
- Action descriptions
- Art style and Film grain
- Character details (clothing, expression)
- Color palette
- VFX/SFX
- Timing markers/transitions implicitly described

Requirements:
- The Title must be engaging, professional, and summarize the visual content effectively.
- The Prompt must follow the original video scene-by-scene.
- No missing scenes.
- No invented elements.
- Highly accurate.
`;

// Helper to convert File to Base64 string
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateBreakdown = async (base64Data: string, mimeType: string): Promise<BreakdownResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: "Analyze this video and provide the Title and Prompt as requested in the system instructions.",
        },
      ],
    };

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for factual accuracy
      },
    });

    const text = response.text || "";
    
    // Parse the specifically formatted output
    const titleMatch = text.match(/Title:\s*(.+)/);
    const promptMatch = text.match(/Prompt:\s*([\s\S]*)/);

    const title = titleMatch ? titleMatch[1].trim() : "Video Recreation Prompt";
    const prompt = promptMatch ? promptMatch[1].trim() : text; // Fallback to full text if parsing fails

    return {
      title,
      prompt,
    };

  } catch (error) {
    console.error("Error generating breakdown:", error);
    throw error;
  }
};