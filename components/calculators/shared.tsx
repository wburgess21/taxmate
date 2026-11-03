import type { ReactNode } from "react";
import type { Region } from "@/lib/taxRules";

export const REGIONS: [Region, string][] = [["rUK", "England, Wales & NI"], ["scotland", "Scotland"]];

export type Period = "year" | "month" | "week";
export const PERIODS: [Period, string][] = [["year", "Year"], ["month", "Month"], ["week", "Week"]];
export const per = (n: number, p: Period) => (p === "month" ? n / 12 : p === "week" ? n / 52 : n);
export const perLabel = (p: Period) => (p === "month" ? "a month" : p === "week" ? "a week" : "a year");

/** The two halves of a calculator card. */
export function Calc({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="surface-card calc">
      <div className="calc-inputs">{inputs}</div>
      <div className="calc-results">{results}</div>
    </div>
  );
}
