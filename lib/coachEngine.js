import { calculateBurnoutRisk } from "./burnoutEngine";
import { forecastMood } from "./moodForecastEngine";
import { calculateExamReadiness } from "./examReadinessEngine";

const COMMAND_RESPONSES = {
  "/analyze": "Full history analysis and pattern summary.",
  "/forecast": "Mood and resilience forecast for the coming days.",
  "/burnout": "Burnout risk detection and stress warning.",
  "/readiness": "Exam readiness and pressure assessment.",
  "/recovery": "Personalized recovery actions and plans.",
  "/insights": "Key behavioral patterns and opportunity insights.",
};

function sortEntries(entries) {
  return entries
    .slice()
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function average(entries, field) {
  if (!entries?.length) return 0;
  return entries.reduce((sum, item) => sum + Number(item[field] || 0), 0) / entries.length;
}

function trendValue(entries, field, lookback = 7) {
  const sorted = sortEntries(entries);
  const recent = sorted.slice(0, lookback);
  const previous = sorted.slice(lookback, lookback * 2);
  if (!recent.length || !previous.length) return 0;
  return average(recent, field) - average(previous, field);
}

function consecutiveCount(entries, predicate) {
  let count = 0;
  for (const entry of sortEntries(entries)) {
    if (predicate(entry)) {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}

function totalClusters(entries, predicate, clusterSize = 3) {
  const sorted = sortEntries(entries).reverse();
  let clusters = 0;
  let current = 0;
  for (const entry of sorted) {
    if (predicate(entry)) {
      current += 1;
    } else {
      if (current >= clusterSize) clusters += 1;
      current = 0;
    }
  }
  if (current >= clusterSize) clusters += 1;
  return clusters;
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function getExamPressure(entries) {
  const sorted = sortEntries(entries);
  const upcoming = sorted.find((entry) => entry.examDate);
  if (!upcoming) return null;

  const today = new Date();
  const examDate = new Date(upcoming.examDate);
  const daysToExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
  if (daysToExam < 0) return null;

  return {
    entry: upcoming,
    daysToExam,
  };
}

function buildRiskMap(entries, analyses, burnout) {
  const sorted = sortEntries(entries);
  const recent = sorted.slice(0, 7);
  const lastSleep = average(recent, "sleepHours");
  const lastStudy = average(recent, "studyHours");
  const lastMotivation = average(recent, "motivationLevel");
  const lastStress = average(recent, "stress");
  const lastMood = average(recent, "mood");
  const examPressure = getExamPressure(entries);
  const motivationDrops = consecutiveCount(recent, (entry) => Number(entry.motivationLevel) <= 4);
  const sleepDebt = lastSleep < 6.5 || trendValue(entries, "sleepHours", 7) < -0.3;
  const anxiety = lastStress >= 7 && lastMood <= 4;
  const procrastination = lastStudy <= 3 && lastStress >= 5 && lastMotivation <= 5;

  return {
    burnout: burnout.riskLevel === "Critical" || burnout.riskLevel === "High",
    anxiety,
    examPressure: Boolean(examPressure && lastStress >= 5),
    procrastination,
    lowMotivation: lastMotivation <= 4,
    sleepDebt,
    examDetails: examPressure,
    motivationDrops: motivationDrops >= 2,
  };
}

function detectPatterns(entries, analyses, riskMap) {
  const sorted = sortEntries(entries);
  const recent = sorted.slice(0, 7);
  const previous = sorted.slice(7, 14);
  const late = sorted[0] || null;
  const longSleepDays = sorted.filter((entry) => Number(entry.sleepHours) >= 7);
  const shortSleepDays = sorted.filter((entry) => Number(entry.sleepHours) < 6);
  const moodAfterLongSleep = average(longSleepDays, "mood");
  const moodAfterShortSleep = average(shortSleepDays, "mood");
  const sleepMoodGap = moodAfterLongSleep - moodAfterShortSleep;
  const recurringExamStress = riskMap.examPressure && trendValue(entries, "stress", 7) > 0.8;
  const motivationCycle = consecutiveCount(sorted, (entry) => Number(entry.stress) >= 7) >= 3 && consecutiveCount(sorted, (entry) => Number(entry.motivationLevel) <= 4) >= 2;
  const burnoutClusters = totalClusters(sorted, (entry) => Number(entry.stress) >= 7 && Number(entry.mood) <= 4, 3);
  const exam = getExamPressure(entries);
  const examTrend = exam ? trendValue(entries, "stress", 7) : 0;
  const examInsight = exam ? `Exam pressure is present, with ${exam.daysToExam} day${exam.daysToExam === 1 ? "" : "s"} until the next listed exam.` : null;

  const insights = [];

  if (recurringExamStress) {
    insights.push(
      "Your stress tends to climb before exams. In the most recent week, stress rose while study demands and extra pressure increased."
    );
  }

  if (sleepMoodGap >= 1.2 && longSleepDays.length >= 2 && shortSleepDays.length >= 2) {
    insights.push(
      `Your mood is consistently better after nights with 7+ hours of sleep, averaging ${moodAfterLongSleep.toFixed(1)} vs ${moodAfterShortSleep.toFixed(1)} on shorter nights.`
    );
  }

  if (motivationCycle) {
    insights.push("Your motivation drops after several high-stress days, so recovery blocks are especially important when pressure is sustained.");
  }

  if (burnoutClusters >= 2) {
    insights.push("There is a recurring burnout pattern: clusters of high stress and low mood have appeared more than once recently.");
  }

  if (riskMap.sleepDebt) {
    insights.push("Sleep is trending lower than your healthy baseline, which can weaken mood and recovery over the next week.");
  }

  if (riskMap.procrastination) {
    insights.push("Low study output paired with moderate stress suggests procrastination is adding to pressure rather than reducing it.");
  }

  if (examInsight) {
    insights.push(examInsight);
  }

  if (!insights.length) {
    insights.push("Recent signals are stable, but keep tracking daily shifts to catch early stress or mood changes.");
  }

  return { insights, patterns: { sleepMoodGap, recurringExamStress, motivationCycle, burnoutClusters } };
}

function createActionItems(entries, burnout, riskMap, latestAnalysis) {
  const recent = sortEntries(entries).slice(0, 7);
  const lastSleep = average(recent, "sleepHours");
  const items = [];

  if (burnout.riskLevel === "Critical" || latestAnalysis?.risk === "Urgent") {
    items.push("Pause and protect your next hour with a reset: hydrate, breathe, and reduce inputs.");
    items.push("Use Panic Mode if you feel overwhelmed and ask for immediate support from a trusted person.");
    return items.slice(0, 3);
  }

  if (riskMap.sleepDebt) {
    items.push("Prioritize tonight's sleep window and stop screen work 45 minutes before bed.");
  }

  if (riskMap.examPressure) {
    items.push("Pick the two most important study goals today and keep the rest as supportive review.");
  }

  if (riskMap.anxiety) {
    items.push("Do a 10-minute grounding break with calm breathing before returning to tasks.");
  }

  if (riskMap.lowMotivation || riskMap.procrastination) {
    items.push("Start with a 15-minute focused sprint, then celebrate progress before the next block.");
  }

  if (!items.length) {
    items.push("Keep the current routine steady, and give yourself one intentional break today.");
  }

  return items.slice(0, 3);
}

function buildPlan(entries, burnout, riskMap, duration) {
  const recent = sortEntries(entries).slice(0, 7);
  const lastSleep = average(recent, "sleepHours");
  const lastStress = average(recent, "stress");
  const lastStudy = average(recent, "studyHours");
  const plan = [];

  if (duration === 3) {
    if (riskMap.sleepDebt) {
      plan.push("Rebuild sleep consistency: aim for 7+ hours for three nights in a row.");
    }
    if (riskMap.examPressure) {
      plan.push("Schedule two focused study sessions with at least one active review and one rest block.");
    }
    if (riskMap.lowMotivation) {
      plan.push("Use short, achievable windows and reward each small completion.");
    }
    if (!plan.length) {
      plan.push("Keep recovery habits stable: hydration, gentle movement, and predictable rest.");
    }
  }

  if (duration === 7) {
    if (burnout.riskLevel === "High" || burnout.riskLevel === "Critical") {
      plan.push("Limit intense work to the highest-priority assignments and keep daily recovery non-negotiable.");
    }
    plan.push("Track stress, mood, and sleep each day to spot patterns before they become pressure cycles.");
    plan.push("Build one supportive routine: morning planning, mid-day reset, or evening wind-down.");
    if (!plan.length) {
      plan.push("Stay consistent with your best existing habits and revisit this coach after seven days.");
    }
  }

  return Array.from(new Set(plan)).slice(0, duration === 3 ? 4 : 5);
}

function buildExplanation(entries, burnout, forecast, readiness, riskMap, patterns) {
  const recent = sortEntries(entries).slice(0, 7);
  const previous = sortEntries(entries).slice(7, 14);
  const currentSleep = average(recent, "sleepHours");
  const previousSleep = average(previous, "sleepHours");
  const currentStress = average(recent, "stress");
  const currentMood = average(recent, "mood");
  const sleepDelta = currentSleep - previousSleep;
  const moodTrend = trendValue(entries, "mood", 7);

  const pieces = [];
  pieces.push(
    `This coach uses your latest check-ins and journal signals. Burnout risk is ${burnout.riskLevel} at ${burnout.riskPercent}%.`
  );

  if (sleepDelta < 0) {
    pieces.push(
      `Average sleep changed from ${previousSleep.toFixed(1)}h to ${currentSleep.toFixed(1)}h, and that drop is linked to lower mood and higher recovery need.`
    );
  }

  if (currentStress >= 6) {
    pieces.push(`Recent stress is elevated at ${currentStress.toFixed(1)} and is a core driver of the recommended recovery actions.`);
  }

  if (riskMap.examPressure) {
    pieces.push(`Exam readiness is ${readiness}/100, so the plan balances exam focus with rest to avoid pushing into burnout.`);
  }

  if (forecast.tomorrow.futureMood === "Low") {
    pieces.push(`Mood forecast expects a low signal tomorrow, so today's plan emphasizes reset and manageable work.`);
  }

  return pieces.join(" ");
}

export function generateCoachResponse(entries = [], analyses = []) {
  const sorted = sortEntries(entries);
  const latestAnalysis = analyses[0] || null;
  const burnout = calculateBurnoutRisk(sorted);
  const forecast = forecastMood(sorted, latestAnalysis?.sentiment);
  const readiness = calculateExamReadiness(sorted);
  const riskMap = buildRiskMap(sorted, analyses, burnout);
  const patternResult = detectPatterns(sorted, analyses, riskMap);

  const todayAction = createActionItems(sorted, burnout, riskMap, latestAnalysis).join(" ");
  const plan3Day = buildPlan(sorted, burnout, riskMap, 3);
  const plan7Day = buildPlan(sorted, burnout, riskMap, 7);
  const explanation = buildExplanation(sorted, burnout, forecast, readiness, riskMap, patternResult.patterns);
  const summary =
    sorted.length === 0
      ? "Add your first check-in and journal entry to activate the wellness coach."
      : `The coach focuses on your most recent wellness history and builds personalized plans from your current sleep, stress, mood, and study patterns.`;
  const confidence = Math.min(
    94,
    Math.max(
      58,
      68 + Math.round(sorted.length * 2) - Math.round(Math.abs(trendValue(sorted, "stress", 7)) * 2) - Math.round(Math.abs(trendValue(sorted, "mood", 7)) * 2)
    )
  );

  const crisis = {};

  if (burnout.riskLevel === "Critical" || latestAnalysis?.risk === "Urgent") {
    crisis.immediate = [
      "Stop for a short reset and use Panic Mode if you feel overwhelmed.",
      "Contact a trusted person and stay near support until stress feels safer.",
    ];
    crisis.recovery = [
      "Simplify today's schedule and protect rest blocks.",
      "Continue journaling key feelings and actions each hour.",
    ];
    crisis.panic = "If you feel unsafe or unable to cope, use Panic Mode now and reach out for immediate help.";
  }

  return {
    summary,
    todayAction: todayAction || "Keep the routine stable and check in again tomorrow.",
    plan3Day,
    plan7Day,
    readiness,
    forecast,
    risks: {
      burnout: burnout.riskLevel,
      anxiety: riskMap.anxiety,
      examPressure: riskMap.examPressure,
      procrastination: riskMap.procrastination,
      lowMotivation: riskMap.lowMotivation,
      sleepDebt: riskMap.sleepDebt,
    },
    insights: patternResult.insights,
    explanation,
    confidence,
    emotionalOutlook: forecast.tomorrow.emotionalOutlook,
    crisis,
  };
}

export function parseCoachCommand(command = "", coachData) {
  const normalized = String(command || "").trim().toLowerCase();
  const response = {
    title: "Unknown command",
    text: "Enter one of the smart commands: /analyze, /forecast, /burnout, /readiness, /recovery, /insights.",
    details: [],
  };

  if (!normalized.startsWith("/")) {
    return response;
  }

  switch (normalized) {
    case "/analyze":
      return {
        title: "History Analysis",
        text: coachData.summary,
        details: [coachData.explanation, `Confidence ${coachData.confidence}%`].filter(Boolean),
      };
    case "/forecast":
      return {
        title: "Forecast",
        text: `Tomorrow mood forecast: ${coachData.forecast?.tomorrow?.futureMood || "Unknown"} (${coachData.forecast?.tomorrow?.emotionalOutlook || "No outlook"})`,
        details: [
          `Tomorrow confidence: ${coachData.forecast?.tomorrow?.confidence || "Unknown"}%`,
          `3-day mood: ${coachData.forecast?.threeDays?.futureMood || "Unknown"}`,
        ].filter(Boolean),
      };
    case "/burnout":
      return {
        title: "Burnout Risk",
        text: `Burnout risk is ${coachData.risks.burnout ? coachData.risks.burnout : "Low"}.`,
        details: [coachData.explanation, `Support detected risks: anxiety=${coachData.risks.anxiety}, sleepDebt=${coachData.risks.sleepDebt}`],
      };
    case "/readiness":
      return {
        title: "Exam Readiness",
        text: `Exam readiness score is ${coachData.readiness || "Unknown"}/100.`,
        details: [coachData.explanation],
      };
    case "/recovery":
      return {
        title: "Recovery Plan",
        text: coachData.todayAction,
        details: coachData.plan3Day.concat(coachData.plan7Day).slice(0, 5),
      };
    case "/insights":
      return {
        title: "Insights",
        text: coachData.insights[0] || "No insights available yet.",
        details: coachData.insights.slice(1),
      };
    default:
      return response;
  }
}
