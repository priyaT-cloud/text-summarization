
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise, abstractive summary of the text."
    },
    diagram: {
      type: Type.STRING,
      description: "A Mermaid.js flowchart diagram representing the key points of the summary. Example: flowchart TD\\nA[Start] --> B[Point 1];\\nB --> C[Point 2];"
    }
  },
  required: ["summary", "diagram"]
};

export async function generateSummary(text: string): Promise<{ summary: string; diagram: string }> {
  if (!text) {
    throw new Error("Input text cannot be empty.");
  }

  const prompt = `
    You are an expert in text summarization and data visualization. Your task is to perform two actions based on the provided text:
    1.  Provide a high-quality abstractive summary. The summary should be concise, coherent, and capture the main ideas in your own words.
    2.  Based on the summary, create a simple Mermaid.js flowchart diagram that illustrates the main points and their relationships.

    The final output must be a JSON object matching the required schema.

    Original Text:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    
    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    return {
      summary: result.summary || 'No summary could be generated.',
      diagram: result.diagram || 'flowchart TD\n  A["No diagram could be generated."]',
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}
