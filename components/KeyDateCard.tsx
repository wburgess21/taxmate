"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarDays } from "lucide-react";

/** The app's key dates (CalculatorCatalogView.swift), for every tax year. */
const DATES = [
  { month: 1, day: 31, title: "Self Assessment deadline", detail: "File your online return and pay the tax you owe." },
  { month: 4, day: 5, title: "Tax year ends", detail: "Last day to use this year's allowances and relief." },
  { month: 7, day: 31, title: "Second payment on account", detail: "Pay towards this year's Self Assessment bill." },
  { month: 10, day: 5, title: "Register for Self Assessment", detail: "If you started working for yourself last tax year." },
  { month: 10, day: 31, title: "Paper return deadline", detail: "Filing online? You have until 31 January." },
];

function upcoming(now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return [now.getFullYear(), now.getFullYear() + 1]
    .flatMap((year) => DATES.map((d) => ({ ...d, date: new Date(year, d.month - 1, d.day) })))
    .filter((d) => d.date >= today)
    .map((d) => ({ ...d, days: Math.round((d.date.getTime() - today.getTime()) / 86_400_000) }))
    .slice(0, 3);
}

const longDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const shortDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** "Next key date" hero with a live countdown, and the two dates after it. Worked out in the visitor's browser. */
export function KeyDateCard() {
  const [dates, setDates] = useState<ReturnType<typeof upcoming> | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Worked out on the client so a statically built page never shows a stale countdown.
    const next = upcoming(new Date());
    const target = next[0].days;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1100;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      setDates(next);
      const t = duration ? Math.min(1, (now - start) / duration) : 1, e = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(target * e));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const next = dates?.[0];
  return (
    <div className="grid gap-4">
      <div className="hero-card p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="eyebrow"><CalendarDays className="h-4 w-4" aria-hidden /> Next key date</span>
          <Bell className="h-4 w-4 text-white/80" aria-label="Reminder on" />
        </div>
        <div className={`transition-opacity duration-500 ${next ? "opacity-100" : "opacity-0"}`}>
          <p className="mt-4 text-xl font-light">{next?.title ?? "Self Assessment deadline"}</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-6xl font-light tracking-tight tabular-nums">{next ? count : 0}</span>
            <span className="text-xl font-light text-white/80">{next?.days === 1 ? "day to go" : "days to go"}</span>
          </p>
          <p className="mt-2 text-[0.9375rem] text-white/75">{next ? `${longDate(next.date)} · ${next.detail}` : " "}</p>
        </div>
      </div>
      <ul className="surface-card divide-y divide-hairline">
        {(dates?.slice(1) ?? [null, null]).map((d, i) => (
          <li key={i} className="flex items-center gap-4 px-5 py-4">
            <span className="tool-badge" style={{ ["--tint" as string]: "var(--tool-planning)" }}>
              <CalendarDays className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{d?.title ?? " "}</span>
              <span className="block text-[0.9375rem] text-muted">{d ? d.detail : " "}</span>
            </span>
            <span className="text-[0.9375rem] tabular-nums text-muted">{d ? shortDate(d.date) : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
