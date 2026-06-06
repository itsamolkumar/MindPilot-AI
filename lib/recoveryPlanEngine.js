export function generateRecoveryPlan(checkIn, burnoutRisk, journalAnalysis) {
  const risk = burnoutRisk?.riskLevel || "No Data";
  const highStress = Number(checkIn?.stress || 0) >= 7;
  const lowSleep = Number(checkIn?.sleepHours || 0) < 6.5;
  const lowEnergy = Number(checkIn?.energyLevel || 0) <= 4;
  const lowMotivation = Number(checkIn?.motivationLevel || 0) <= 4;

  const plan = [];

  if (risk === "Critical" || risk === "High") {
    plan.push("Reduce today to the two most important academic tasks.");
    plan.push("Schedule a support conversation with an advisor, counselor, mentor, or trusted person.");
  }

  if (highStress) {
    plan.push("Use a 10 minute reset: breathe slowly, write the next action, and start only that action.");
  }

  if (lowSleep) {
    plan.push("Protect tonight’s sleep window and stop heavy study at least 45 minutes before bed.");
  }

  if (lowEnergy) {
    plan.push("Add one recovery block: water, food, light movement, and no screen switching for 15 minutes.");
  }

  if (lowMotivation) {
    plan.push("Start with a 15 minute study sprint and stop when the timer ends.");
  }

  if (journalAnalysis?.recommendations?.length) {
    plan.push(...journalAnalysis.recommendations.slice(0, 2));
  }

  if (!plan.length) {
    plan.push("Keep the current routine stable and check in again tomorrow.");
    plan.push("Plan one small enjoyable break before the day ends.");
  }

  return Array.from(new Set(plan)).slice(0, 6);
}
