"use client";

import { useState } from "react";
import { AUDIENCE_LABEL, type Audience } from "@/lib/keyDates";

/** `iso` is a plain calendar date (YYYY-MM-DD), read as a local date so no time zone can shift it. */
export type DateRow = { key: string; iso: string; title: string; detail: string; who: Audience; days: number };

const TINTS: Record<Audience, string> = {
  everyone: "var(--tool-income)",
  "self-assessment": "var(--tool-claims)",
  employees: "var(--tool-income)",
  employers: "var(--pay-pension)",
  mtd: "var(--tool-planning)",
};

const FILTERS: [Audience | "all", string][] = [
  ["all", "All dates"],
  ["self-assessment", "Self Assessment"],
  ["mtd", "Making Tax Digital"],
  ["employees", "Employees"],
  ["employers", "Employers"],
];

const local = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const when = (days: number) => (days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`);

/**
 * The year's dates, one card per month with a row for each date, and a filter for who they apply to. "Everyone"
 * dates (the tax year's end and start) always show. Rendered on the server with every date, so it reads fine
 * without JavaScript.
 */
export function KeyDatesList({ dates }: { dates: DateRow[] }) {
  const [filter, setFilter] = useState<Audience | "all">("all");
  const shown = dates.filter((d) => filter === "all" || d.who === filter || d.who === "everyone");
  const months = new Map<string, DateRow[]>();
  for (const d of shown) {
    const k = local(d.iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    months.set(k, [...(months.get(k) ?? []), d]);
  }
  return (
    <div className="min-w-0">
      <div role="group" aria-label="Show dates for" className="chip-row">
        {FILTERS.map(([v, l]) => (
          <button key={v} type="button" className="check flex-none" data-active={filter === v || undefined} aria-pressed={filter === v} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>
      {[...months].map(([month, items]) => (
        <section key={month} aria-label={month} className="mt-8 first-of-type:mt-6">
          <h2 className="kicker">{month}</h2>
          <ul className="surface-card mt-3 divide-y divide-[var(--hairline)] overflow-hidden">
            {items.map((d) => {
              const at = local(d.iso);
              return (
                <li key={d.key} className="flex gap-4 p-4 sm:gap-5 sm:p-5" style={{ ["--tint" as string]: TINTS[d.who] }}>
                  <div className="flex w-12 flex-none flex-col items-center justify-center self-start rounded-xl py-2 text-center sm:w-14 sm:py-2.5" style={{ background: "color-mix(in srgb, var(--tint) 13%, transparent)", color: "var(--tint)" }}>
                    <span className="text-xl font-light leading-none tabular-nums sm:text-2xl">{at.getDate()}</span>
                    <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.08em] sm:text-[0.6875rem]">{at.toLocaleDateString("en-GB", { month: "short" })}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <h3 className="font-medium leading-snug sm:text-[1.0625rem]">{d.title}</h3>
                      <span className="text-[0.8125rem] tabular-nums text-muted">{when(d.days)}</span>
                    </div>
                    <p className="mt-1 text-[0.875rem] leading-relaxed text-muted sm:text-[0.9375rem]">{d.detail}</p>
                    <p className="mt-2 text-[0.75rem] font-medium" style={{ color: "var(--tint)" }}>{AUDIENCE_LABEL[d.who]}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
