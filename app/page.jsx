"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Brain, CalendarCheck, RefreshCw, ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { TrendCharts } from "@/components/TrendCharts";
import { getAnalyses, getCheckIns } from "@/lib/storage";
import { calculateBurnoutRisk } from "@/lib/burnoutEngine";
import { calculateExamReadiness } from "@/lib/examReadinessEngine";
import { forecastMood } from "@/lib/moodForecastEngine";
import { generateRecoveryPlan } from "@/lib/recoveryPlanEngine";
import { generateCoachResponse, parseCoachCommand } from "@/lib/coachEngine";

export default function DashboardPage() {
  const [entries, setEntries] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coachCommand, setCoachCommand] = useState("");
  const [coachResult, setCoachResult] = useState(null);
  const [processingCoachCommand, setProcessingCoachCommand] = useState(false);

  useEffect(() => {
    setEntries(getCheckIns());
    setAnalyses(getAnalyses());
    setLoading(false);
  }, []);

  const burnout = useMemo(() => calculateBurnoutRisk(entries), [entries]);
  const readiness = useMemo(() => calculateExamReadiness(entries), [entries]);
  const forecast = useMemo(() => forecastMood(entries), [entries]);
  const coach = useMemo(
    () => generateCoachResponse(entries, analyses),
    [entries, analyses]
  );
  const latest = entries[0] || null;
  const latestAnalysis = analyses[0] || null;
  const recoveryPlan = useMemo(
    () => generateRecoveryPlan(latest, burnout, latestAnalysis),
    [latest, burnout, latestAnalysis]
  );

  const burnoutTone =
    burnout.riskPercent >= 75 ? "danger" : burnout.riskPercent >= 50 ? "warn" : "good";
  const readinessTone = readiness >= 70 ? "good" : readiness >= 45 ? "warn" : "danger";

  const submitCoachCommand = async (event) => {
    event.preventDefault();
    if (!coachCommand.trim()) {
      setCoachResult(null);
      return;
    }

    setProcessingCoachCommand(true);
    const result = parseCoachCommand(coachCommand, coach);
    setCoachResult(result);
    setProcessingCoachCommand(false);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <RefreshCw className="h-5 w-5 animate-spin text-fern" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink">Loading your wellness dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fern">Wellness Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Today’s wellness overview</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/65">
              Your personal student wellness cockpit uses check-ins, journal analysis, and trend forecasting to guide support.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/check-in"
            className="inline-flex items-center gap-2 rounded-md bg-fern px-4 py-2 text-sm font-semibold text-white hover:bg-fern/90"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Daily check-in
          </Link>
          <Link
            href="/panic"
            className="inline-flex items-center gap-2 rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral/90"
          >
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            Panic mode
          </Link>
        </div>
      </div>

      {!entries.length ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Burnout Risk"
              value={`${burnout.riskPercent}%`}
              detail={burnout.riskLevel}
              tone={burnoutTone}
            />
            <MetricCard
              title="Exam Readiness"
              value={`${readiness}/100`}
              detail={readiness >= 70 ? "Ready range" : "Needs support"}
              tone={readinessTone}
            />
            <MetricCard
              title="Tomorrow Mood"
              value={forecast.tomorrow.futureMood}
              detail={`${forecast.tomorrow.confidence}% confidence`}
              tone={forecast.tomorrow.futureMood === "Low" ? "danger" : "good"}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card rounded-lg p-5">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber" aria-hidden="true" />
                <h2 className="text-lg font-bold text-ink">Burnout Reasons</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {burnout.reasons.map((reason) => (
                  <li key={reason} className="rounded-md bg-mist px-3 py-2 text-sm text-ink/75">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card rounded-lg p-5">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-fern" aria-hidden="true" />
                <h2 className="text-lg font-bold text-ink">Latest Journal Analysis</h2>
              </div>
              {latestAnalysis ? (
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-md bg-mist p-3">
                    <dt className="font-semibold text-ink">Emotion</dt>
                    <dd className="mt-1 text-ink/70">{latestAnalysis.emotion}</dd>
                  </div>
                  <div className="rounded-md bg-mist p-3">
                    <dt className="font-semibold text-ink">Trigger</dt>
                    <dd className="mt-1 text-ink/70">{latestAnalysis.trigger}</dd>
                  </div>
                  <div className="rounded-md bg-mist p-3">
                    <dt className="font-semibold text-ink">Risk</dt>
                    <dd className="mt-1 text-ink/70">{latestAnalysis.risk}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-ink/65">Submit a journal entry to generate analysis.</p>
              )}
            </div>
          </section>

          <section className="card rounded-lg p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fern">AI Wellness Coach</p>
                <h2 className="mt-2 text-2xl font-bold text-ink">Personalized guidance from your history</h2>
              </div>
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/75">
                Confidence {coach.confidence}%
              </span>
            </div>

            <p className="mt-4 text-sm text-ink/70">{coach.summary}</p>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-ink/10 bg-white p-4 text-sm text-ink/75 shadow-sm">
                <p className="font-semibold text-ink">Today’s Action</p>
                <p className="mt-3 text-sm leading-6">{coach.todayAction}</p>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white p-4 text-sm text-ink/75 shadow-sm">
                <p className="font-semibold text-ink">3-Day Plan</p>
                <ul className="mt-3 space-y-2">
                  {coach.plan3Day.map((item) => (
                    <li key={item} className="list-disc pl-4 text-sm leading-6 text-ink/75">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white p-4 text-sm text-ink/75 shadow-sm">
                <p className="font-semibold text-ink">7-Day Plan</p>
                <ul className="mt-3 space-y-2">
                  {coach.plan7Day.map((item) => (
                    <li key={item} className="list-disc pl-4 text-sm leading-6 text-ink/75">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-ink/10 bg-mist p-4 text-sm text-ink/75">
                <p className="font-semibold text-ink">Detected Risks</p>
                <ul className="mt-3 space-y-2">
                  {Object.entries(coach.risks).map(([label, value]) => (
                    <li key={label} className="text-sm text-ink/70">
                      <span className="font-semibold text-ink">{label.replace(/([A-Z])/g, " $1").trim()}:</span> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-mist p-4 text-sm text-ink/75">
                <p className="font-semibold text-ink">Key Insights</p>
                <ul className="mt-3 space-y-2">
                  {coach.insights.slice(0, 4).map((item) => (
                    <li key={item} className="text-sm text-ink/70">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {coach.crisis?.immediate?.length ? (
              <div className="mt-6 rounded-3xl border border-coral/20 bg-coral/10 p-4 text-sm text-coral">
                <p className="font-semibold text-coral">Crisis awareness</p>
                <ul className="mt-3 space-y-2">
                  {coach.crisis.immediate.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-coral/80">{coach.crisis.panic}</p>
              </div>
            ) : null}

            <form onSubmit={submitCoachCommand} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-2">
                <label htmlFor="coachCommand" className="sr-only">
                  Smart coach command
                </label>
                <input
                  id="coachCommand"
                  className="w-full rounded-lg border border-ink/10 bg-white p-3 text-sm text-ink shadow-sm"
                  placeholder="Run a smart command like /insights or /burnout"
                  aria-describedby="coachCommandHelp"
                  value={coachCommand}
                  onChange={(event) => setCoachCommand(event.target.value)}
                />
                <p id="coachCommandHelp" className="sr-only">
                  Use smart commands to query the wellness coach.
                </p>
              </div>
              <button
                type="submit"
                disabled={processingCoachCommand}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-fern px-4 py-3 text-sm font-semibold text-white hover:bg-fern/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {processingCoachCommand ? "Running..." : "Run command"}
              </button>
            </form>

            {coachResult ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-5 rounded-3xl border border-ink/10 bg-mist p-4 text-sm text-ink/75"
              >
                <p className="font-semibold text-ink">{coachResult.title}</p>
                <p className="mt-2 text-sm leading-6 text-ink/75">{coachResult.text}</p>
                {coachResult.details?.length ? (
                  <ul className="mt-3 space-y-2">
                    {coachResult.details.map((detail) => (
                      <li key={detail} className="text-sm text-ink/70">{detail}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {[
              ["Tomorrow", forecast.tomorrow],
              ["3 Days", forecast.threeDays],
              ["7 Days", forecast.sevenDays],
            ].map(([label, item]) => (
              <div key={label} className="card rounded-lg p-5">
                <h2 className="text-base font-bold text-ink">{label} Forecast</h2>
                <p className="mt-3 text-2xl font-bold text-fern">{item.futureMood}</p>
                <p className="mt-1 text-sm text-ink/60">{item.confidence}% confidence</p>
                <ul className="mt-4 space-y-2">
                  {item.reasons.slice(0, 2).map((reason) => (
                    <li key={`${label}-${reason}`} className="text-sm text-ink/65">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="card rounded-lg p-5">
            <h2 className="text-lg font-bold text-ink">Recovery Plan</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {recoveryPlan.map((item) => (
                <li key={item} className="rounded-md border border-ink/10 bg-white p-3 text-sm text-ink/75">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <TrendCharts entries={entries} />
        </div>
      )}
    </main>
  );
}
