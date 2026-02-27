import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface StoryPlot {
  title: string;
  characters: {
    name: string;
    role: string;
    description: string;
  }[];
  conflict: string;
  plotPoints: string[];
  twist: string;
}

export async function generateStoryPlot(): Promise<StoryPlot> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate a short story plot with a central conflict, three distinct characters, and a surprising twist.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["name", "role", "description"],
            },
          },
          conflict: { type: Type.STRING },
          plotPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          twist: { type: Type.STRING },
        },
        required: ["title", "characters", "conflict", "plotPoints", "twist"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse story plot:", e);
    throw new Error("Failed to generate a valid story plot.");
  }
}
