import { GoogleGenerativeAI } from "@google/generative-ai";
import { analyzeJournalFallback } from "@/lib/journalFallback";
import { sanitizeText, safePromptString } from "@/lib/sanitize";

export async function POST(request) {
  try {
    const body = await request.json();
    const journalEntry = sanitizeText(body?.journalEntry);

    if (!journalEntry) {
      return Response.json({
        emotion: "Neutral",
        trigger: "Not provided",
        sentiment: "Neutral",
        risk: "Low",
        recommendations: ["Complete a journal entry for deeper analysis."],
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(analyzeJournalFallback(journalEntry));
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const prompt = `
Analyze this student wellness journal entry and return only strict JSON.

JSON schema:
{
  "emotion": "one short emotion label",
  "trigger": "one short likely trigger",
  "sentiment": "Positive | Neutral | Negative",
  "risk": "Low | Watch | Elevated | Urgent",
  "recommendations": ["3 concise supportive recommendations"]
}

Rules:
- Do not diagnose.
- Do not include markdown.
- If self-harm, suicide, immediate danger, or inability to stay safe appears, set risk to "Urgent".
- Keep recommendations practical, supportive, and non-clinical.

Journal:
${safePromptString(journalEntry)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    return Response.json({
      emotion: String(parsed.emotion || "Neutral"),
      trigger: String(parsed.trigger || "Not clear"),
      sentiment: ["Positive", "Neutral", "Negative"].includes(parsed.sentiment)
        ? parsed.sentiment
        : "Neutral",
      risk: ["Low", "Watch", "Elevated", "Urgent"].includes(parsed.risk) ? parsed.risk : "Low",
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.map(String).slice(0, 5)
        : ["Take one small recovery action and check in again later."],
    });
  } catch {
    return Response.json(
      {
        emotion: "Unknown",
        trigger: "Analysis unavailable",
        sentiment: "Neutral",
        risk: "Watch",
        recommendations: [
          "The AI analysis could not complete.",
          "Use the dashboard scores and Panic Mode if you feel unsafe.",
        ],
      },
      { status: 200 }
    );
  }
}
