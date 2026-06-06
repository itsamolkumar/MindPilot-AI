export function calculateExamReadiness(entries) {
  if (!entries?.length) {
    return 0;
  }

  const recent = entries.slice(0, 5);
  const average = (field) =>
    recent.reduce((sum, entry) => sum + Number(entry[field] || 0), 0) / recent.length;

  const avgMood = average("mood");
  const avgStress = average("stress");
  const avgSleep = average("sleepHours");
  const avgStudy = average("studyHours");
  const avgEnergy = average("energyLevel");
  const avgMotivation = average("motivationLevel");

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
