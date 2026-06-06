"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
      <section className="card rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-6 w-6 text-coral" aria-hidden="true" />
          <div>
            <h1 className="text-xl font-semibold text-ink">Something went wrong</h1>
            <p className="mt-2 text-sm text-ink/70">
              {error?.message || "MindPilot could not complete this action."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-fern px-4 py-2 text-sm font-semibold text-white hover:bg-fern/90"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
