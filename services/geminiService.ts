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
      description: "A concise, abstractive summary of the text, formatted as a bulleted list (using '*' or '-' for each point)."
    },
    diagram: {
      type: Type.STRING,
      description: "A simple, high-level Mermaid.js flowchart diagram representing the main stages or concepts. Use broad headings and ensure valid syntax. Every connection between nodes must use an arrow like '-->'. Each statement should be on a new line. Example: flowchart TD\\nA[Start] --> B{Decision};\\nB -->|Yes| C[Process 1];\\nB -->|No| D[Process 2];\\nC --> E[End];\\nD --> E[End];"
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
    1.  Provide a high-quality abstractive summary in the form of a bulleted list. Each key point should be a separate bullet point starting with '*' or '-'.
    2.  Based on the summary, create a simple, high-level Mermaid.js flowchart diagram that illustrates the main stages and concepts. The diagram should use broad headings for clarity and adhere strictly to valid Mermaid.js syntax.

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