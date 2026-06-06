import { MetricCard } from "@/components/MetricCard";

export function DashboardMetrics({ burnout, readiness, forecast }) {
  const burnoutTone =
    burnout.riskPercent >= 75 ? "danger" : burnout.riskPercent >= 50 ? "warn" : "good";
  const readinessTone = readiness >= 70 ? "good" : readiness >= 45 ? "warn" : "danger";

  return (
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
  );
}
