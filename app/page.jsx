"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Brain, CalendarCheck, RefreshCw, ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ForecastCards } from "@/components/dashboard/ForecastCards";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { CoachPanel } from "@/components/dashboard/CoachPanel";
import { RecoveryPlanPanel } from "@/components/dashboard/RecoveryPlanPanel";
import { JournalAnalysisPanel } from "@/components/dashboard/JournalAnalysisPanel";
import { ExamPressurePanel } from "@/components/dashboard/ExamPressurePanel";
import { TrendCharts } from "@/components/TrendCharts";
import { calculateBurnoutRisk } from "@/lib/burnoutEngine";
import { calculateExamReadiness } from "@/lib/examReadinessEngine";
import { forecastMood } from "@/lib/moodForecastEngine";
import { generateRecoveryPlan } from "@/lib/recoveryPlanEngine";
import { generateCoachResponse, parseCoachCommand } from "@/lib/coachEngine";
import { getUpcomingExam } from "@/lib/dataUtils";
import { useWellnessData } from "@/hooks/useWellnessData";

export default function DashboardPage() {
  const { entries, analyses, ready } = useWellnessData();
  const [coachCommand, setCoachCommand] = useState("");
  const [coachResult, setCoachResult] = useState(null);
  const [processingCoachCommand, setProcessingCoachCommand] = useState(false);

  const burnout = useMemo(() => calculateBurnoutRisk(entries), [entries]);
  const readiness = useMemo(() => calculateExamReadiness(entries), [entries]);
  const latest = entries[0] || null;
  const latestAnalysis = analyses[0] || null;
  const forecast = useMemo(
    () => forecastMood(entries, latestAnalysis?.sentiment),
    [entries, latestAnalysis?.sentiment]
  );
  const coach = useMemo(
    () => generateCoachResponse(entries, analyses),
    [entries, analyses]
  );
  const examInfo = useMemo(() => getUpcomingExam(entries), [entries]);
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

  if (!ready) {
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
          <DashboardMetrics burnout={burnout} readiness={readiness} forecast={forecast} />

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
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

              <ExamPressurePanel examInfo={examInfo} />
            </div>

            <JournalAnalysisPanel latestAnalysis={latestAnalysis} />
          </section>

          <CoachPanel
            coach={coach}
            coachCommand={coachCommand}
            setCoachCommand={setCoachCommand}
            submitCoachCommand={submitCoachCommand}
            coachResult={coachResult}
            processingCoachCommand={processingCoachCommand}
          />

          <ForecastCards forecast={forecast} />

          <RecoveryPlanPanel recoveryPlan={recoveryPlan} />

          <TrendCharts entries={entries} />
        </div>
      )}
    </main>
  );
}
