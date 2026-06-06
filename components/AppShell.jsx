"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, HeartPulse, ShieldAlert } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/check-in", label: "Check-in", icon: Activity },
  { href: "/panic", label: "Panic Mode", icon: ShieldAlert },
];

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f7faf8_0%,#eef4f1_52%,#dcecf8_100%)]">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-fern text-white">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-bold leading-5 text-ink">MindPilot AI</span>
              <span className="block text-xs text-ink/60">Student wellness cockpit</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-fern text-white"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
