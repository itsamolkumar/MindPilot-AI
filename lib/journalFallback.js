import { sanitizeText } from "@/lib/sanitize";

const emotionWords = {
  anxious: ["anxious", "panic", "worried", "nervous", "scared", "fear"],
  sad: ["sad", "empty", "hopeless", "lonely", "cry", "depressed"],
  angry: ["angry", "frustrated", "annoyed", "mad", "irritated"],
  tired: ["tired", "exhausted", "burned", "burnout", "drained"],
  positive: ["happy", "calm", "good", "confident", "ready", "grateful"],
};

const highRiskPhrases = [
  "hurt myself",
  "kill myself",
  "end my life",
  "suicide",
  "self harm",
  "can't go on",
  "want to disappear",
];

export function analyzeJournalFallback(text) {
  const journal = sanitizeText(text).toLowerCase();
  const matchedHighRisk = highRiskPhrases.some((phrase) => journal.includes(phrase));
  let emotion = "Neutral";
  let sentiment = "Neutral";

  for (const [label, words] of Object.entries(emotionWords)) {
    if (words.some((word) => journal.includes(word))) {
      emotion = label.charAt(0).toUpperCase() + label.slice(1);
      break;
    }
  }

  if (["sad", "angry", "tired", "anxious"].includes(emotion.toLowerCase())) {
    sentiment = "Negative";
  }

  if (emotion === "Positive") {
    sentiment = "Positive";
  }

  const trigger = journal.includes("exam")
    ? "Exam pressure"
    : journal.includes("family")
      ? "Family stress"
      : journal.includes("assignment") || journal.includes("deadline")
        ? "Academic workload"
        : journal.includes("friend") || journal.includes("alone")
          ? "Social connection"
          : "Not clear";

  return {
    emotion,
    trigger,
    sentiment,
    risk: matchedHighRisk ? "Urgent" : sentiment === "Negative" ? "Watch" : "Low",
    recommendations: matchedHighRisk
      ? [
          "Use Panic Mode now and contact emergency or crisis support immediately.",
          "Reach out to a trusted person and stay near someone safe.",
        ]
      : [
          "Take one small recovery action before returning to study.",
          "Write down the next manageable task instead of the whole workload.",
        ],
  };
}
