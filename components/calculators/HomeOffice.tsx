"use client";

import { RULES, expenseSaving, gbp, homeOfficeMonthly, type Region } from "@/lib/taxRules";
import { Note, NumberField, ResultHero, ResultRows, Segmented, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

const HOURS: [string, string][] = [["0", "Under 25"], ["25", "25–50"], ["51", "51–100"], ["101", "101+"]];

export function HomeOfficeCalculator() {
  const [s, set] = useQueryState({ hours: "51", months: 12, profit: 40_000, region: "rUK" as Region });
  const months = Math.min(12, Math.round(s.months));
  const monthly = homeOfficeMonthly(Number(s.hours));
  const claim = monthly * months;
  const { saving } = expenseSaving(s.profit, claim, s.region);
  return (
    <Calc
      inputs={<>
        <Segmented name="hours" label="Hours you work at home each month" value={s.hours} onChange={set("hours")} options={HOURS} />
        <NumberField name="months" label="Months you work from home" prefix="" suffix="of 12" decimals={0} max={12} value={s.months} onChange={set("months")} />
        <NumberField name="profit" label="Your business profit" hint="Used to work out the tax the claim saves." value={s.profit} onChange={set("profit")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
      </>}
      results={<>
        <ResultHero label="Flat-rate claim for the year" value={gbp(claim)} sub={monthly ? `${gbp(monthly)} a month for ${months} month${months === 1 ? "" : "s"}, using HMRC’s simplified expenses.` : "You need to work at least 25 hours a month at home to use the flat rate."} />
        <ResultRows rows={[
          { label: "Monthly flat rate", value: gbp(monthly) },
          { label: "Tax and NI it saves", value: gbp(saving), strong: true },
        ]} />
        <Note>
          Flat rates for {RULES.taxYear}: £10 a month for 25 to 50 hours, £18 for 51 to 100, £26 for 101 or more. Broadband and phone can be claimed on top.
          Working out a share of your actual bills instead can give more; TaxMate compares both.
        </Note>
      </>}
    />
  );
}
