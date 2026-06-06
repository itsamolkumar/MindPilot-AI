import Link from "next/link";
import { ClipboardPlus } from "lucide-react";

export function EmptyState() {
  return (
    <section className="card rounded-lg p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-skysoft text-ink">
        <ClipboardPlus className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-ink">Start with today’s check-in</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">
        Add your mood, stress, sleep, study load, energy, motivation, journal note, and exam date.
      </p>
      <Link
        href="/check-in"
        className="mt-5 inline-flex rounded-md bg-fern px-4 py-2 text-sm font-semibold text-white hover:bg-fern/90"
      >
        Create check-in
      </Link>
    </section>
  );
}
