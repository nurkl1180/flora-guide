import { GoogleGenAI, Type } from "@google/genai";
import { PlantInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const identifyPlant = async (base64Image: string): Promise<PlantInfo> => {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `Identify this plant and provide detailed gardening information. 
  Return the response in JSON format matching this schema:
  {
    "name": "Common Name",
    "scientificName": "Scientific Name",
    "description": "General description",
    "isEdible": boolean,
    "careInstructions": {
      "planting": "Instructions for planting (especially if edible)",
      "wateringSchedule": "Watering frequency and tips",
      "nutrientSchedule": "Fertilizing schedule",
      "growthMilestones": ["Milestone 1", "Milestone 2"]
    },
    "pestsAndDiseases": {
      "commonIssues": ["Issue 1", "Issue 2"],
      "prevention": "How to prevent these issues",
      "treatment": "How to treat these issues"
    }
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image,
          },
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          description: { type: Type.STRING },
          isEdible: { type: Type.BOOLEAN },
          careInstructions: {
            type: Type.OBJECT,
            properties: {
              planting: { type: Type.STRING },
              wateringSchedule: { type: Type.STRING },
              nutrientSchedule: { type: Type.STRING },
              growthMilestones: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          pestsAndDiseases: {
            type: Type.OBJECT,
            properties: {
              commonIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
              prevention: { type: Type.STRING },
              treatment: { type: Type.STRING }
            }
          }
        },
        required: ["name", "scientificName", "description", "isEdible", "careInstructions", "pestsAndDiseases"]
      }
    },
  });

  return JSON.parse(response.text || '{}') as PlantInfo;
};

export const getChatResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const model = "gemini-3.1-pro-preview";
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: "You are an expert gardening assistant. Provide helpful, accurate, and encouraging advice to gardeners of all levels. Keep responses concise but detailed where necessary.",
    },
    history: history,
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
