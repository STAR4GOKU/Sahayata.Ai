
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Scheme } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chatSession: Chat | null = null;

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      schemeName: {
        type: Type.STRING,
        description: "The official name of the government scheme.",
      },
      description: {
        type: Type.STRING,
        description: "A brief, simple explanation of the scheme's purpose.",
      },
      eligibility: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of key eligibility criteria for the applicant.",
      },
      benefits: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of benefits provided by the scheme.",
      },
      documentsRequired: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of documents needed to apply.",
      },
      applicationProcess: {
        type: Type.STRING,
        description: "A step-by-step guide on how to apply for the scheme.",
      },
    },
    required: ["schemeName", "description", "eligibility", "benefits", "documentsRequired", "applicationProcess"],
  },
};

export const findSchemes = async (disability: string, age: string, location: string): Promise<Scheme[]> => {
  const prompt = `
    Find relevant government schemes in India for a person with the following details:
    - Disability Type: ${disability}
    - Age: ${age}
    - Location / State: ${location}

    Provide a list of 2-3 highly relevant schemes. For each scheme, give the name, a simple description, key eligibility criteria, benefits, documents required, and the application process.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const schemes: Scheme[] = JSON.parse(jsonText);
    return schemes;
  } catch (error) {
    console.error("Error fetching schemes from Gemini API:", error);
    throw new Error("Failed to parse schemes from AI response.");
  }
};


export const getChatResponse = async (message: string): Promise<string> => {
    if (!chatSession) {
        chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are an empathetic and helpful AI assistant for "Sahayata", an app for people with disabilities in India. Your goal is to provide clear, simple, and encouraging information about government schemes, documentation, and accessibility. Do not give medical or legal advice. Keep responses concise and easy to understand.',
            },
        });
    }

    try {
        const response = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error fetching chat response from Gemini API:", error);
        throw new Error("The AI assistant is currently unavailable. Please try again later.");
    }
};
