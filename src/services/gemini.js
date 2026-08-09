import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generatePalette(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `
You are a professional UI/UX color designer.

Generate exactly five HEX colors based on this prompt.

Prompt:
${prompt}

Rules:
- Return ONLY a JSON array.
- No markdown.
- No explanations.
- Example:
["#1E293B","#3B82F6","#A855F7","#F8FAFC","#FACC15"]
`,
  });

  return JSON.parse(response.text);
}