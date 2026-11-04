"use client";

import { RULES, expenseSaving, gbp, homeOfficeMonthly, type Region } from "@/lib/taxRules";
import { Note, NumberField, Warning, ResultHero, ResultRows, Segmented, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

const HOURS: [string, string][] = [["0", "0–24"], ["25", "25–50"], ["51", "51–100"], ["101", "101+"]];
const FLAT_MAX = RULES.homeOffice[RULES.homeOffice.length - 1][1] * 12;

/**
 * HMRC's two ways for the self-employed to claim working from home, side by side, as the app does: the simplified
 * flat rate (capped at £26 a month, so £312 a year) and a reasonable business share of the actual household costs.
 */
export function HomeOfficeCalculator() {
  const [s, set] = useQueryState({ hours: "51", months: 12, bills: 3_000, share: 10, profit: 40_000, region: "rUK" as Region });
  const months = Math.min(12, Math.round(s.months));
  const monthly = homeOfficeMonthly(Number(s.hours));
  const flat = monthly * months;
  const actual = Math.round(s.bills * Math.min(100, s.share)) / 100;
  const best = actual > flat ? "actual" : "flat";
  const claim = Math.max(flat, actual);
  const { saving, loss, wipesOut } = expenseSaving(s.profit, claim, s.region);
  return (
    <Calc
      inputs={<>
        <p className="kicker -mb-2">Flat rate</p>
        <Segmented name="hours" label="Hours you work at home each month" value={s.hours} onChange={set("hours")} options={HOURS} />
        <NumberField name="months" label="Months you work from home" prefix="" suffix="of 12" decimals={0} max={12} value={s.months} onChange={set("months")} />
        <p className="kicker -mb-2 mt-2">Or a share of your bills</p>
        <NumberField name="bills" label="Household running costs for the year" hint="Heating, electricity, water, council tax, and rent or mortgage interest (not repayments)." value={s.bills} onChange={set("bills")} />
        <NumberField name="share" label="Business share" prefix="" suffix="%" decimals={1} max={100} value={s.share} onChange={set("share")} hint="A reasonable split, such as the rooms you work in and the hours you use them. 1 room of 5, used a third of the time, is about 7%." />
        <p className="kicker -mb-2 mt-2">Your tax</p>
        <NumberField name="profit" label="Your business profit" hint="Used to work out the tax the claim saves." value={s.profit} onChange={set("profit")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
      </>}
      results={<>
        <ResultHero
          label="Best claim for the year"
          value={gbp(claim)}
          sub={claim ? (best === "actual" ? `A ${s.share}% share of your bills beats the flat rate by ${gbp(actual - flat)}.` : `The flat rate: ${gbp(monthly)} a month for ${months} month${months === 1 ? "" : "s"}.`) : "Work at least 25 hours a month at home, or enter your bills, to see a claim."}
        />
        <ResultRows rows={[
          { label: <>Flat rate{best === "flat" && claim ? " (best)" : ""}</>, value: gbp(flat) },
          { label: <>Share of bills{best === "actual" ? " (best)" : ""}</>, value: gbp(actual) },
          { label: "Tax and NI the best claim saves", value: gbp(saving), strong: true },
        ]} />
        {wipesOut && (
          <Warning>
            That claim is more than your {gbp(s.profit)} profit, so it would cancel all your tax and leave a {gbp(loss)} loss. Check the bills and business share: home costs rarely come close to a business’s profit.
          </Warning>
        )}
        {!wipesOut && s.share > 50 && actual > flat && (
          <Warning>A {s.share}% business share is high for a home. HMRC expects a split you can explain, such as a room used only for work.</Warning>
        )}
        <Note>
          The flat rate is £10, £18 or £26 a month depending on hours, so it can never be more than {gbp(FLAT_MAX)} a year. Use one method or the other, not both.
          Business use of your phone and broadband can be claimed on top of either.
        </Note>
      </>}
    />
  );
}
