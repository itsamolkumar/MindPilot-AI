export function calculateBurnoutRisk(entries) {
  if (!entries?.length) {
    return {
      riskPercent: 0,
      riskLevel: "No Data",
      reasons: ["Complete a daily check-in to calculate burnout risk."],
    };
  }

  const recent = entries.slice(0, 7);
  const latest = recent[0];
  const average = (field) =>
    recent.reduce((sum, entry) => sum + Number(entry[field] || 0), 0) / recent.length;

  const avgMood = average("mood");
  const avgStress = average("stress");
  const avgSleep = average("sleepHours");
  const avgStudy = average("studyHours");
  const avgEnergy = average("energyLevel");
  const avgMotivation = average("motivationLevel");
  const reasons = [];

  let score = 0;

  if (avgStress >= 8) {
    score += 25;
    reasons.push("Stress has stayed very high recently.");
  } else if (avgStress >= 6) {
    score += 16;
    reasons.push("Stress is trending above a healthy range.");
  }

  if (avgSleep < 5) {
    score += 24;
    reasons.push("Sleep is critically low.");
  } else if (avgSleep < 6.5) {
    score += 15;
    reasons.push("Sleep recovery is below the recommended range.");
  }

  if (avgStudy >= 9) {
    score += 18;
    reasons.push("Study load is extremely heavy.");
  } else if (avgStudy >= 7) {
    score += 11;
    reasons.push("Study hours are elevated.");
  }

  if (avgEnergy <= 3) {
    score += 18;
    reasons.push("Energy levels are low.");
  } else if (avgEnergy <= 5) {
    score += 10;
    reasons.push("Energy is showing strain.");
  }

  if (avgMotivation <= 3) {
    score += 16;
    reasons.push("Motivation is low.");
  } else if (avgMotivation <= 5) {
    score += 9;
    reasons.push("Motivation is below your usual working range.");
  }

  if (avgMood <= 3) {
    score += 18;
    reasons.push("Mood has been low.");
  } else if (avgMood <= 5) {
    score += 10;
    reasons.push("Mood is somewhat reduced.");
  }

  if (latest?.examDate) {
    const daysToExam = Math.ceil(
      (new Date(latest.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysToExam >= 0 && daysToExam <= 7) {
      score += 8;
      reasons.push("An exam is coming soon.");
    }
  }

  const riskPercent = Math.max(0, Math.min(100, Math.round(score)));
  let riskLevel = "Low";

  if (riskPercent >= 75) {
    riskLevel = "Critical";
  } else if (riskPercent >= 50) {
    riskLevel = "High";
  } else if (riskPercent >= 25) {
    riskLevel = "Moderate";
  }

  return {
    riskPercent,
    riskLevel,
    reasons: reasons.length ? reasons : ["Current check-ins show stable wellness signals."],
  };
}
