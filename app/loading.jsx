import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white px-5 py-4 shadow-soft">
        <Loader2 className="h-5 w-5 animate-spin text-fern" aria-hidden="true" />
        <p className="text-sm font-medium text-ink">Loading MindPilot AI...</p>
      </div>
    </main>
  );
}
