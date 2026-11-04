"use client";

import { expenseSaving, gbp, pct, type Region } from "@/lib/taxRules";
import { Note, NumberField, Warning, ResultHero, ResultRows, Segmented, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

export function ExpensesCalculator() {
  const [s, set] = useQueryState({ cost: 1_200, profit: 40_000, region: "rUK" as Region });
  const { saving, realCost, loss, wipesOut } = expenseSaving(s.profit, s.cost, s.region);
  return (
    <Calc
      inputs={<>
        <NumberField name="cost" label="What the expense costs" hint="A laptop, software, travel, training: anything used wholly for your business." value={s.cost} onChange={set("cost")} />
        <NumberField name="profit" label="Your profit before this expense" value={s.profit} onChange={set("profit")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
      </>}
      results={<>
        <ResultHero label="What it really costs you" value={gbp(realCost)} sub={s.cost ? `Claiming it saves ${gbp(saving)} in Income Tax and NI, ${pct(saving / s.cost)} of the price.` : "Enter a cost to see what claiming it saves."} />
        <ResultRows rows={[
          { label: "Price", value: gbp(s.cost) },
          { label: "Tax and NI saved", value: `−${gbp(saving)}` },
          { label: "Real cost", value: gbp(realCost), strong: true },
        ]} />
        {wipesOut && <Warning>This cost is more than your {gbp(s.profit)} profit, so it saves all your tax for the year and leaves a {gbp(loss)} loss, which can sometimes be set against other income or carried forward.</Warning>}
        <Note>An expense saves tax, but it still costs money: only buy what the business needs. Assumes self-employment is your only income.</Note>
      </>}
    />
  );
}
