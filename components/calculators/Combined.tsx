"use client";

import { combinedIncome, gbp, pct, type Region } from "@/lib/taxRules";
import { COLORS, Note, NumberField, ResultHero, ResultRows, Segmented, SplitBar, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

export function CombinedIncomeCalculator() {
  const [s, set] = useQueryState({ salary: 32_000, profit: 12_000, region: "rUK" as Region });
  const r = combinedIncome(s.salary, s.profit, s.region);
  return (
    <Calc
      inputs={<>
        <NumberField name="salary" label="Salary from your job" hint="Taxed through PAYE before it reaches you." value={s.salary} onChange={set("salary")} />
        <NumberField name="profit" label="Self-employed profit" hint="Turnover from your side business, minus allowable expenses." value={s.profit} onChange={set("profit")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
      </>}
      results={<>
        <ResultHero label="Due through Self Assessment" value={gbp(r.selfAssessment)} sub={s.profit ? `That’s ${pct(r.selfAssessment / s.profit)} of your side profit, on top of what PAYE takes from your salary.` : "Add your side profit to see what you’ll owe on it."} />
        <SplitBar parts={[{ value: r.keep, color: COLORS.keep }, { value: r.tax, color: COLORS.tax }, { value: r.ni + r.class4, color: COLORS.ni }]} />
        <ResultRows rows={[
          { label: "Total income", value: gbp(s.salary + s.profit) },
          { label: "Income Tax through PAYE", value: gbp(r.paye), color: COLORS.tax },
          { label: "Income Tax on your profit", value: gbp(r.tax - r.paye), color: COLORS.tax },
          { label: "Employee NI", value: gbp(r.ni), color: COLORS.ni },
          { label: "Class 4 NI", value: gbp(r.class4), color: COLORS.ni },
          { label: "You keep", value: gbp(r.keep), color: COLORS.keep, strong: true },
        ]} />
        <Note>Your top rate of Income Tax is {pct(r.marginal)}. Assumes your tax code gives you the full Personal Allowance against your salary.</Note>
      </>}
    />
  );
}
