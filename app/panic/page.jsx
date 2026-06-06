"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HeartPulse, Home, Loader2, Phone, ShieldAlert } from "lucide-react";
import { getAnalyses, getCheckIns } from "@/lib/storage";
import { calculateBurnoutRisk } from "@/lib/burnoutEngine";

function buildPanicPlan(entries, analyses) {
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

export default function PanicPage() {
  const [loading, setLoading] = useState(false);
  const entries = useMemo(() => getCheckIns(), []);
  const analyses = useMemo(() => getAnalyses(), []);
  const plan = useMemo(() => buildPanicPlan(entries, analyses), [entries, analyses]);

  const activateGrounding = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-coral/20 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-coral">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              Panic Mode
            </div>
            <h1 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">You are not alone right now</h1>
            <p className="mt-3 max-w-2xl text-sm text-ink/70">
              If there is immediate danger, call local emergency services now. This MVP provides support steps,
              not emergency medical care.
            </p>
          </div>
          <a
            href="tel:988"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-bold text-white hover:bg-coral/90"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call 988
          </a>
        </div>

        <button
          type="button"
          onClick={activateGrounding}
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md bg-fern px-5 py-3 text-sm font-bold text-white hover:bg-fern/90 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
          )}
          {loading ? "Starting grounding..." : "Start grounding"}
        </button>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <PlanCard title="5 Minute Plan" items={plan.fiveMinute} tone="danger" />
        <PlanCard title="1 Hour Plan" items={plan.oneHour} tone="warn" />
        <PlanCard title="24 Hour Plan" items={plan.twentyFourHour} tone="good" />
      </section>

      <section className="card mt-8 rounded-lg p-5">
        <h2 className="text-lg font-bold text-ink">Immediate contacts</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <a className="rounded-md border border-ink/10 bg-white p-4 text-sm font-semibold text-ink hover:bg-mist" href="tel:988">
            988 Crisis Lifeline
          </a>
          <a className="rounded-md border border-ink/10 bg-white p-4 text-sm font-semibold text-ink hover:bg-mist" href="tel:911">
            Emergency Services
          </a>
          <Link className="rounded-md border border-ink/10 bg-white p-4 text-sm font-semibold text-ink hover:bg-mist" href="/">
            <span className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" aria-hidden="true" />
              Return Dashboard
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

function PlanCard({ title, items, tone }) {
  const styles = {
    danger: "border-coral/25 bg-red-50",
    warn: "border-amber/25 bg-amber-50",
    good: "border-fern/20 bg-emerald-50",
  };

  return (
    <section className={`rounded-lg border p-5 shadow-soft ${styles[tone]}`}>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 text-sm text-ink/75">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-ink">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
