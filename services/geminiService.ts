
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_API_MODEL, MAX_AI_RESPONSE_LENGTH } from "../constants";

/**
 * Generates an AI response based on a given prompt using the Gemini API.
 * The model used is 'gemini-3-flash-preview' for basic text tasks.
 *
 * @param prompt The text prompt to send to the AI.
 * @returns A promise that resolves to the AI's text response.
 * @throws An error if the API key is not found or the API call fails.
 */
export async function generateAIResponse(prompt: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key is not configured. Please set process.env.API_KEY.");
  }

  // Create a new GoogleGenAI instance for each call to ensure the latest API key is used
  // in case it's updated via window.aistudio.openSelectKey().
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: MAX_AI_RESPONSE_LENGTH, // Limit output length
      },
    });

    const text = response.text;
    if (text === undefined) {
      throw new Error("Gemini API response did not contain text content.");
    }
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Check if the error is due to an invalid API key
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      // This is a common error for invalid/unselected API keys.
      // In a real application, you'd trigger window.aistudio.openSelectKey() here.
      console.warn("Gemini API key might be invalid or not selected. Prompting user to select key if 'window.aistudio' is available.");
      if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
        (window as any).aistudio.openSelectKey();
      }
      throw new Error("Invalid or unselected Gemini API key. Please ensure a valid API key from a paid GCP project is selected.");
    }
    throw new Error(`Failed to get AI response: ${(error as Error).message}`);
  }
}

/**
 * Checks if the user has selected a Gemini API key.
 * @returns A promise that resolves to true if an API key is selected, false otherwise.
 */
export async function hasApiKeySelected(): Promise<boolean> {
  if (typeof (window as any).aistudio === 'object' && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
    return (window as any).aistudio.hasSelectedApiKey();
  }
  // If aistudio is not available, we can only rely on process.env.API_KEY
  return !!process.env.API_KEY;
}

/**
 * Opens the API key selection dialog.
 */
export async function openApiKeySelection(): Promise<void> {
  if (typeof (window as any).aistudio === 'object' && typeof (window as any).aistudio.openSelectKey === 'function') {
    (window as any).aistudio.openSelectKey();
  } else {
    console.warn("window.aistudio.openSelectKey is not available. Cannot open API key selection dialog.");
  }
}
