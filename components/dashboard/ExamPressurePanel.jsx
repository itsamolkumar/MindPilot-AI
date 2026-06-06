export function ExamPressurePanel({ examInfo }) {
  return (
    <section className="card rounded-lg p-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink">
          E
        </span>
        <h2 className="text-lg font-bold text-ink">Exam Support</h2>
      </div>
      {examInfo ? (
        <div className="mt-4 space-y-3 text-sm text-ink/75">
          <p>
            Next scheduled exam is on <strong>{examInfo.displayDate}</strong>,<br />
            which is {examInfo.daysToExam} day{examInfo.daysToExam === 1 ? "" : "s"} away.
          </p>
          <p>
            Keep sleep consistent and manage study load to reduce exam-related burnout risk.
          </p>
          {examInfo.isSoon ? (
            <p className="rounded-md border border-amber/20 bg-amber-50 p-3 text-amber">Exam is coming soon — prioritize sleep, planning, and short recovery breaks.</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink/65">No upcoming exam is scheduled. Add one during your next check-in.</p>
      )}
    </section>
  );
}
