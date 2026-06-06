export function ForecastCards({ forecast }) {
  return (
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
          <p className="mt-1 text-sm text-ink/60">Outlook: {item.emotionalOutlook}</p>
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
  );
}
