export function RecoveryPlanPanel({ recoveryPlan }) {
  return (
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
  );
}
