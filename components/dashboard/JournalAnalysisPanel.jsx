export function JournalAnalysisPanel({ latestAnalysis }) {
  return (
    <section className="card rounded-lg p-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink">
          J
        </span>
        <h2 className="text-lg font-bold text-ink">Latest Journal Analysis</h2>
      </div>
      {latestAnalysis ? (
        <>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="rounded-md bg-mist p-3">
              <dt className="font-semibold text-ink">Emotion</dt>
              <dd className="mt-1 text-ink/70">{latestAnalysis.emotion}</dd>
            </div>
            <div className="rounded-md bg-mist p-3">
              <dt className="font-semibold text-ink">Sentiment</dt>
              <dd className="mt-1 text-ink/70">{latestAnalysis.sentiment}</dd>
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

          <div className="mt-4 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/75">
            <p className="font-semibold text-ink">Journal Recommendations</p>
            <ul className="mt-3 space-y-2">
              {latestAnalysis.recommendations?.map((item) => (
                <li key={item} className="list-disc pl-4 text-sm leading-6 text-ink/70">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-ink/65">Submit a journal entry to generate analysis.</p>
      )}
    </section>
  );
}
