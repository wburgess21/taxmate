"use client";

import { RULES, expenseSaving, gbp, mileageAllowance, pct, type Region, type Vehicle, pence } from "@/lib/taxRules";
import { Note, NumberField, Warning, ResultHero, ResultRows, Segmented, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

const VEHICLES: [Vehicle, string][] = [["car", "Car or van"], ["motorcycle", "Motorcycle"], ["bicycle", "Bicycle"]];
const RATES: [string, string][] = [["0.2", "20%"], ["0.4", "40%"], ["0.45", "45%"]];

export function MileageCalculator() {
  const [s, set] = useQueryState({ work: "self", miles: 6_000, vehicle: "car" as Vehicle, paid: 0, profit: 40_000, rate: "0.2", region: "rUK" as Region });
  const allowance = mileageAllowance(s.miles, s.vehicle);
  const self = s.work === "self";
  const claim = self ? allowance : Math.max(0, allowance - s.miles * (s.paid / 100));
  const se = expenseSaving(s.profit, claim, s.region);
  const saving = self ? se.saving : claim * Number(s.rate);
  return (
    <Calc
      inputs={<>
        <Segmented name="work" label="You drive for" value={s.work} onChange={set("work")} options={[["self", "My own business"], ["employee", "My employer"]]} />
        <NumberField name="miles" label="Business miles this tax year" prefix="" suffix="miles" decimals={0} value={s.miles} onChange={set("miles")} hint="Not your usual commute: only journeys made for work." />
        <Segmented name="vehicle" label="Vehicle" value={s.vehicle} onChange={set("vehicle")} options={VEHICLES} />
        {self ? (<>
          <NumberField name="profit" label="Your business profit" hint="Used to work out the tax the claim saves." value={s.profit} onChange={set("profit")} />
          <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
        </>) : (<>
          <NumberField name="paid" label="Your employer pays you" prefix="" suffix="pence a mile" decimals={1} max={100} value={s.paid} onChange={set("paid")} hint="Enter 0 if they don’t pay mileage." />
          <Segmented name="rate" label="Your Income Tax rate" value={s.rate} onChange={set("rate")} options={RATES} />
        </>)}
      </>}
      results={<>
        <ResultHero
          label={self ? "Mileage you can deduct" : "Mileage Allowance Relief to claim"}
          value={gbp(claim)}
          sub={self ? `At HMRC’s approved rates, saving about ${gbp(saving)} in tax and NI.` : claim ? `Worth about ${gbp(saving)} in tax at ${pct(Number(s.rate))}. Claim it from HMRC online.` : "Your employer already pays the approved rate or more, so there’s nothing to claim."}
        />
        <ResultRows rows={[
          { label: "Approved mileage amount", value: gbp(allowance) },
          ...(self ? [] : [{ label: "Paid by your employer", value: `−${gbp(s.miles * (s.paid / 100))}` }]),
          { label: "Tax saved", value: gbp(saving), strong: true },
        ]} />
        {self && se.wipesOut && <Warning>That mileage is worth more than your {gbp(s.profit)} profit, so it cancels all your tax and leaves a {gbp(se.loss)} loss.</Warning>}
        <Note>
          {s.vehicle === "car" ? `Cars and vans: ${pence(RULES.mileage.carFirst10k)} a mile for the first 10,000 business miles, then 25p. The first 10,000 miles are shared across all your cars and vans.` : s.vehicle === "motorcycle" ? "Motorcycles: 24p a mile." : "Bicycles: 20p a mile."} The rate covers fuel, wear and insurance, so you can’t claim those as well.
        </Note>
      </>}
    />
  );
}
