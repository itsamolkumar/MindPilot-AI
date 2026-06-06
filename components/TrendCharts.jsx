"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export function TrendCharts({ entries }) {
  const data = entries
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      mood: Number(entry.mood),
      stress: Number(entry.stress),
      sleep: Number(entry.sleepHours),
      study: Number(entry.studyHours),
      energy: Number(entry.energyLevel),
      motivation: Number(entry.motivationLevel),
    }));

  if (!data.length) {
    return null;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="card rounded-lg p-5">
        <h2 className="text-lg font-bold text-ink">Mood, Stress, Energy</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e4df" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#26735b" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="stress" stroke="#e3655b" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="energy" stroke="#2f78a8" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card rounded-lg p-5">
        <h2 className="text-lg font-bold text-ink">Sleep And Study Load</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e4df" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sleep" fill="#26735b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="study" fill="#d99a2b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
