export function CoachPanel({
  coach,
  coachCommand,
  setCoachCommand,
  submitCoachCommand,
  coachResult,
  processingCoachCommand,
}) {
  return (
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
        <div role="status" aria-live="polite" className="mt-5 rounded-3xl border border-ink/10 bg-mist p-4 text-sm text-ink/75">
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
  );
}
