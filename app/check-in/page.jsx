"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { DEFAULT_CHECK_IN, createCheckIn, saveAnalysis, saveCheckIn } from "@/lib/storage";
import { analyzeJournalFallback } from "@/lib/journalFallback";
import { sanitizeText } from "@/lib/sanitize";

const sliderFields = [
  { name: "mood", label: "Mood", min: 1, max: 10 },
  { name: "stress", label: "Stress", min: 1, max: 10 },
  { name: "sleepHours", label: "Sleep Hours", min: 0, max: 12, step: 0.5 },
  { name: "studyHours", label: "Study Hours", min: 0, max: 16, step: 0.5 },
  { name: "energyLevel", label: "Energy Level", min: 1, max: 10 },
  { name: "motivationLevel", label: "Motivation Level", min: 1, max: 10 },
];

export default function CheckInPage() {
  const router = useRouter();
  const [form, setForm] = useState(DEFAULT_CHECK_IN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitCheckIn = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const sanitizedEntry = sanitizeText(form.journalEntry);
      const checkIn = createCheckIn({ ...form, journalEntry: sanitizedEntry });
      saveCheckIn(checkIn);

      let analysis = analyzeJournalFallback(checkIn.journalEntry);

      if (checkIn.journalEntry) {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ journalEntry: checkIn.journalEntry }),
        });

        if (response.ok) {
          analysis = await response.json();
        }
      }

      saveAnalysis({
        id: crypto.randomUUID(),
        checkInId: checkIn.id,
        ...analysis,
        createdAt: new Date().toISOString(),
      });

      router.push("/");
    } catch (submitError) {
      setError(submitError?.message || "Could not save your check-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fern">Daily Check-in</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Log your wellness signals</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          These values stay in this browser’s LocalStorage for the MVP.
        </p>
      </div>

      <form onSubmit={submitCheckIn} className="card mt-8 rounded-lg p-5 sm:p-6">
        {error ? (
          <div role="alert" className="mb-5 rounded-md border border-coral/25 bg-red-50 p-3 text-sm text-coral">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          {sliderFields.map((field) => (
            <label key={field.name} className="rounded-lg border border-ink/10 bg-white p-4">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{field.label}</span>
                <span className="rounded-md bg-mist px-2 py-1 text-sm font-bold text-ink">
                  {form[field.name]}
                </span>
              </span>
              <input
                className="mt-4 w-full accent-fern"
                type="range"
                min={field.min}
                max={field.max}
                step={field.step || 1}
                value={form[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
              />
            </label>
          ))}
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-ink">Journal Entry</span>
          <textarea
            className="mt-2 min-h-36 w-full rounded-lg border border-ink/10 bg-white p-3 text-sm text-ink shadow-sm"
            value={form.journalEntry}
            onChange={(event) => updateField("journalEntry", event.target.value)}
            placeholder="Write what feels important today..."
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-ink">Exam Date</span>
          <input
            className="mt-2 w-full rounded-lg border border-ink/10 bg-white p-3 text-sm text-ink shadow-sm"
            type="date"
            value={form.examDate}
            onChange={(event) => updateField("examDate", event.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-fern px-5 py-2 text-sm font-semibold text-white hover:bg-fern/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {loading ? "Saving..." : "Save check-in"}
        </button>
      </form>
    </main>
  );
}
