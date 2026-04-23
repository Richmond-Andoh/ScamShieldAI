import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ScamAnalysis {
  scamProbability: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM LIKELY';
  threatType: string;
  redFlags: string[];
  psychologicalTactics: string[];
  recommendedActions: string[];
  explanation: string;
}

export async function analyzeMessage(content: string, isAudioTranscript: boolean = false): Promise<ScamAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are ScamShield AI, an intelligent fraud detection assistant designed to protect users from online scams, especially in mobile money, job offers, and voice impersonation contexts common in Africa.

Your job is to analyze suspicious messages or audio transcripts and determine whether they are scams.

🚨 SCAM TYPES TO DETECT:
* Emergency Money Scam
* Fake Job Offer
* Phishing Attempt
* Impersonation Scam
* Deepfake Voice Scam
* Investment Scam

🔍 RED FLAGS TO LOOK FOR:
* Urgent requests (“send now”, “immediately”)
* Requests for money or mobile transfers
* Too-good-to-be-true offers
* Threats or pressure
* Suspicious links
* Requests for personal or financial info
* Claims of being a relative, boss, or authority
* Emotional manipulation (fear, panic, sympathy)

🧠 PSYCHOLOGICAL TACTICS:
* Urgency pressure
* Authority impersonation
* Emotional manipulation
* Greed / opportunity bait
* Fear tactics

⚠️ IMPORTANT RULES:
* Be concise and clear
* Do NOT use technical jargon
* If unsure, mark as "SUSPICIOUS"
* Always prioritize user safety
* Keep total response explanation under 150 words
* Make it easy for non-technical users to understand

${isAudioTranscript ? "🎙️ AUDIO MODE: The input is a transcript of a voice message. Check for urgency in tone, emotional pressure, and impersonation." : ""}

Assume the user may be a student, job seeker, trader using mobile money, or a vulnerable person under pressure. Tailor advice accordingly.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: content }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scamProbability: { type: Type.NUMBER, description: "0-100 probability" },
          verdict: { type: Type.STRING, enum: ["SAFE", "SUSPICIOUS", "SCAM LIKELY"] },
          threatType: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          psychologicalTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING }
        },
        required: ["scamProbability", "verdict", "threatType", "redFlags", "psychologicalTactics", "recommendedActions", "explanation"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as ScamAnalysis;
}
