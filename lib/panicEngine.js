import { calculateBurnoutRisk } from "./burnoutEngine";

export function buildPanicPlan(entries = [], analyses = []) {
  const burnout = calculateBurnoutRisk(entries);
  const urgentJournal = analyses.some((analysis) => analysis.risk === "Urgent");

  const fiveMinute = [
    "Place both feet on the floor and name five things you can see.",
    "Breathe in for 4 seconds, hold for 2, breathe out for 6. Repeat 6 times.",
    "Move away from anything that could hurt you.",
    urgentJournal ? "Contact emergency or crisis support now." : "Text or call one trusted person.",
  ];

  const oneHour = [
    "Drink water and eat something simple if you have not eaten.",
    "Move to a safer, calmer place with another person nearby if possible.",
    "Postpone major decisions until your body settles.",
    burnout.riskPercent >= 50
      ? "Ask for academic or counseling support today."
      : "Write one sentence about what triggered the panic.",
  ];

  const twentyFourHour = [
    "Book or request a support conversation.",
    "Reduce tomorrow’s task list to three essential items.",
    "Protect sleep tonight and avoid late-night catch-up studying.",
    "Check in again tomorrow so MindPilot can update your recovery plan.",
  ];

  return {
    fiveMinute,
    oneHour,
    twentyFourHour,
  };
}
