export function MetricCard({ title, value, detail, tone = "default" }) {
  const tones = {
    default: "border-ink/10 bg-white",
    good: "border-fern/20 bg-emerald-50",
    warn: "border-amber/25 bg-amber-50",
    danger: "border-coral/25 bg-red-50",
  };

  return (
    <section className={`rounded-lg border p-5 shadow-soft ${tones[tone]}`}>
      <p className="text-sm font-medium text-ink/60">{title}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      {detail ? <p className="mt-2 text-sm text-ink/65">{detail}</p> : null}
    </section>
  );
}
