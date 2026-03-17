import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  credibilityScore: number;
  verdict: 'True' | 'Mostly True' | 'Mixed' | 'Mostly False' | 'False';
  analysis: string;
  sourceVerification: string;
  redFlags: string[];
  supportingEvidence: string[];
}

export async function analyzeContent(
  type: 'text' | 'link' | 'image',
  content: string | { data: string; mimeType: string }
): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    You are an expert fact-checker and misinformation analyst. 
    Analyze the provided content (text, URL, or image) for its credibility and accuracy.
    
    Perform the following:
    1. NLP-based content analysis: Check for sensationalism, emotional manipulation, logical fallacies, and factual inconsistencies.
    2. Source verification: Evaluate the credibility of the source if identifiable.
    3. Fact-checking: Cross-reference claims with reliable information using Google Search.
    
    Return a structured JSON response with:
    - credibilityScore: A number from 0 to 100 (100 being completely credible).
    - verdict: One of "True", "Mostly True", "Mixed", "Mostly False", "False".
    - analysis: A detailed paragraph explaining the NLP analysis and reasoning.
    - sourceVerification: Information about the source's reliability.
    - redFlags: An array of strings detailing any suspicious elements (e.g., "Clickbait title", "Unverified quotes").
    - supportingEvidence: An array of strings detailing evidence that supports or refutes the claims.
  `;

  let parts: any[] = [{ text: prompt }];

  if (type === 'text' || type === 'link') {
    parts.push({ text: `Content to analyze:\n${content}` });
  } else if (type === 'image') {
    parts.push({ inlineData: content as { data: string; mimeType: string } });
    parts.push({ text: "Analyze the text and context within this image." });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          credibilityScore: { type: Type.INTEGER, description: "0-100 score" },
          verdict: { type: Type.STRING },
          analysis: { type: Type.STRING },
          sourceVerification: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          supportingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["credibilityScore", "verdict", "analysis", "sourceVerification", "redFlags", "supportingEvidence"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AnalysisResult;
}
