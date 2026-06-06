import { averageField } from "@/lib/dataUtils";

export function calculateExamReadiness(entries) {
  if (!entries?.length) {
    return 0;
  }

  const recent = entries.slice(0, 5);
  const avgMood = averageField(recent, "mood");
  const avgStress = averageField(recent, "stress");
  const avgSleep = averageField(recent, "sleepHours");
  const avgStudy = averageField(recent, "studyHours");
  const avgEnergy = averageField(recent, "energyLevel");
  const avgMotivation = averageField(recent, "motivationLevel");

  const studyScore = Math.min(30, avgStudy * 3.75);
  const sleepScore = Math.min(20, avgSleep * 2.85);
  const energyScore = avgEnergy * 1.5;
  const motivationScore = avgMotivation * 1.5;
  const moodScore = avgMood;
  const stressPenalty = Math.max(0, (avgStress - 5) * 3);

  return Math.max(
    0,
    Math.min(100, Math.round(studyScore + sleepScore + energyScore + motivationScore + moodScore - stressPenalty))
  );
}
