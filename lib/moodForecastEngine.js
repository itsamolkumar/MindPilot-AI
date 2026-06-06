import { averageField, sortEntriesByDate, normalizeNumber, clamp } from "@/lib/dataUtils";

export function forecastMood(entries, latestSentiment = "Neutral") {
  if (!entries?.length) {
    return {
      tomorrow: {
        futureMood: "Unknown",
        confidence: 0,
        emotionalOutlook: "Unknown",
        reasons: ["No check-ins available for forecasting."],
      },
      threeDays: {
        futureMood: "Unknown",
        confidence: 0,
        emotionalOutlook: "Unknown",
        reasons: ["No check-ins available for forecasting."],
      },
      sevenDays: {
        futureMood: "Unknown",
        confidence: 0,
        emotionalOutlook: "Unknown",
        reasons: ["No check-ins available for forecasting."],
      },
    };
  }

  const sorted = sortEntriesByDate(entries);
  const recent = sorted.slice(0, 7);
  const latest = sorted[0];
  const previous = sorted[1] || latest;
  const moodTrend = normalizeNumber(latest.mood) - normalizeNumber(previous.mood);
  const pressure =
    (averageField(recent, "stress") - 5) * 0.35 +
    Math.max(0, 6.5 - averageField(recent, "sleepHours")) * 0.4 +
    Math.max(0, averageField(recent, "studyHours") - 6) * 0.2 -
    (averageField(recent, "energyLevel") - 5) * 0.15 -
    (averageField(recent, "motivationLevel") - 5) * 0.15;

  const sentimentWeight =
    latestSentiment === "Positive"
      ? 0.35
      : latestSentiment === "Negative"
      ? -0.45
      : 0;

  const emotionTag =
    latestSentiment === "Positive"
      ? "Hopeful"
      : latestSentiment === "Negative"
      ? "Cautious"
      : moodTrend > 0
      ? "Improving"
      : moodTrend < 0
      ? "Fragile"
      : "Stable";

  const predictValue = (days) => {
    const decay = days === 1 ? 0.75 : days === 3 ? 0.52 : 0.34;
    return Math.max(
      1,
      Math.min(
        10,
        Number(latest.mood) + moodTrend * decay + sentimentWeight - pressure * decay
      )
    );
  };

  const labelMood = (value) => {
    if (value >= 8) return "Positive";
    if (value >= 6) return "Stable";
    if (value >= 4) return "Mixed";
    return "Low";
  };

  const confidence = Math.min(92, Math.max(42, 45 + recent.length * 6 - Math.abs(moodTrend) * 3));
  const reasons = [];

  if (moodTrend > 0) reasons.push("Recent mood is improving.");
  if (moodTrend < 0) reasons.push("Recent mood is declining.");
  if (averageField(recent, "stress") >= 7) reasons.push("Stress is likely to pull mood down.");
  if (averageField(recent, "sleepHours") < 6.5) reasons.push("Sleep recovery is below target.");
  if (averageField(recent, "energyLevel") >= 7) reasons.push("Energy is supporting resilience.");
  if (latestSentiment === "Positive") reasons.push("Journal sentiment is supportive of emotional resilience.");
  if (latestSentiment === "Negative") reasons.push("Journal sentiment suggests emotional strain may persist.");
  if (!reasons.length) reasons.push("Recent signals are steady.");

  return {
    tomorrow: {
      futureMood: labelMood(predictValue(1)),
      confidence: Math.round(confidence),
      emotionalOutlook: emotionTag,
      reasons,
    },
    threeDays: {
      futureMood: labelMood(predictValue(3)),
      confidence: Math.round(confidence - 8),
      emotionalOutlook: emotionTag,
      reasons,
    },
    sevenDays: {
      futureMood: labelMood(predictValue(7)),
      confidence: Math.round(confidence - 17),
      emotionalOutlook: emotionTag,
      reasons,
    },
  };
}
