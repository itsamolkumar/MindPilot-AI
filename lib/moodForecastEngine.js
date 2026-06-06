export function forecastMood(entries) {
  if (!entries?.length) {
    return {
      tomorrow: {
        futureMood: "Unknown",
        confidence: 0,
        reasons: ["No check-ins available for forecasting."],
      },
      threeDays: {
        futureMood: "Unknown",
        confidence: 0,
        reasons: ["No check-ins available for forecasting."],
      },
      sevenDays: {
        futureMood: "Unknown",
        confidence: 0,
        reasons: ["No check-ins available for forecasting."],
      },
    };
  }

  const sorted = entries.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recent = sorted.slice(0, 7);
  const avg = (field) => recent.reduce((sum, item) => sum + Number(item[field] || 0), 0) / recent.length;
  const latest = sorted[0];
  const previous = sorted[1] || latest;
  const moodTrend = Number(latest.mood) - Number(previous.mood);
  const pressure =
    (avg("stress") - 5) * 0.35 +
    Math.max(0, 6.5 - avg("sleepHours")) * 0.4 +
    Math.max(0, avg("studyHours") - 6) * 0.2 -
    (avg("energyLevel") - 5) * 0.15 -
    (avg("motivationLevel") - 5) * 0.15;

  const predictValue = (days) => {
    const decay = days === 1 ? 0.75 : days === 3 ? 0.52 : 0.34;
    return Math.max(1, Math.min(10, Number(latest.mood) + moodTrend * decay - pressure * decay));
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
  if (avg("stress") >= 7) reasons.push("Stress is likely to pull mood down.");
  if (avg("sleepHours") < 6.5) reasons.push("Sleep recovery is below target.");
  if (avg("energyLevel") >= 7) reasons.push("Energy is supporting resilience.");
  if (!reasons.length) reasons.push("Recent signals are steady.");

  return {
    tomorrow: {
      futureMood: labelMood(predictValue(1)),
      confidence: Math.round(confidence),
      reasons,
    },
    threeDays: {
      futureMood: labelMood(predictValue(3)),
      confidence: Math.round(confidence - 8),
      reasons,
    },
    sevenDays: {
      futureMood: labelMood(predictValue(7)),
      confidence: Math.round(confidence - 17),
      reasons,
    },
  };
}
