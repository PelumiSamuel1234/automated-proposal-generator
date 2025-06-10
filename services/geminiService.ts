
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters } from "@google/genai";

// Ensure API_KEY is available in the environment.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  // This will prevent the AI client from being initialized if the key is missing.
  console.error("API_KEY environment variable is not set. Please ensure it's configured.");
  // Throwing an error here will stop execution if the key is missing.
  // This aligns with the strict requirement that the API key must be available.
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });
const modelName = 'gemini-2.5-flash-preview-04-17';

export const generateProposalWithGemini = async (promptContents: string, systemInstruction?: string): Promise<string> => {
  // API key check is implicitly handled by the GoogleGenAI constructor now throwing if apiKey is undefined.
  
  try {
    const params: GenerateContentParameters = {
      model: modelName,
      contents: promptContents,
    };

    if (systemInstruction && systemInstruction.trim() !== "") {
      params.config = {
        systemInstruction: systemInstruction,
        // Optional: Add other configs like temperature, topK, topP if needed
        // temperature: 0.7, 
      };
    }

    const response: GenerateContentResponse = await ai.models.generateContent(params);
    
    const text = response.text;
    if (text) {
      return text;
    } else {
      console.error('Gemini API returned an empty or unexpected response:', response);
      throw new Error('Gemini API returned no text. The content might have been blocked or an issue occurred.');
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID') || error.message.includes('permission') || error.message.includes('API key not valid')) {
             throw new Error(`API Key error: ${error.message}. Please check your Gemini API key configuration.`);
        }
        throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
