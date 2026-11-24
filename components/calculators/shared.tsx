"use client";

import { createContext, useContext } from "react";
import { ArrowUpRight } from "lucide-react";
import { appStoreUrl } from "@/lib/site";
import { SpinCoins } from "@/components/site/SpinCoins";
import type { ReactNode } from "react";
import type { Region } from "@/lib/taxRules";

export const REGIONS: [Region, string][] = [["rUK", "England, Wales & NI"], ["scotland", "Scotland"]];

export type Period = "year" | "month" | "week";
export const PERIODS: [Period, string][] = [["year", "Year"], ["month", "Month"], ["week", "Week"]];
export const per = (n: number, p: Period) => (p === "month" ? n / 12 : p === "week" ? n / 52 : n);
export const perLabel = (p: Period) => (p === "month" ? "a month" : p === "week" ? "a week" : "a year");

/** Which page a calculator is on, so its "save this in the app" link carries the right campaign. */
export const CalcContext = createContext<{ placement: string; tool: string } | null>(null);

export function CalcProvider({ placement, tool, children }: { placement: string; tool: string; children: ReactNode }) {
  return <CalcContext.Provider value={{ placement, tool }}>{children}</CalcContext.Provider>;
}

/** The two halves of a calculator card. The results end with a link to carry on in the app, at the moment it's most useful. */
export function Calc({ inputs, results, cta = true }: { inputs: ReactNode; results: ReactNode; cta?: boolean }) {
  const ctx = useContext(CalcContext);
  return (
    <div className="surface-card calc">
      <div className="calc-inputs">{inputs}</div>
      <div className="calc-results">
        {results}
        {ctx && cta && (
          <a href={appStoreUrl(`${ctx.placement}-result`)} data-cta={`${ctx.placement}-result`} target="_blank" rel="noopener noreferrer" className="calc-save green">
            {/* The two-coin mark, which plays the header button's spin on hover. */}
            <span className="calc-save-coin" aria-hidden><SpinCoins className="h-6 w-6" delay={0} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[1.0625rem] font-medium leading-snug">Go further in the app</span>
              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-white/70">The full {ctx.tool} tool, free on iPhone and iPad</span>
            </span>
            <span className="calc-save-go" aria-hidden><ArrowUpRight className="h-5 w-5" strokeWidth={2.4} /></span>
          </a>
        )}
      </div>
    </div>
  );
}
