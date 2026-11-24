"use client";

import { RULES, expenseSaving, gbp, homeOffice, type Region } from "@/lib/taxRules";
import { Note, NumberField, Warning, ResultHero, ResultRows, Segmented, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

const FLAT_MAX = RULES.homeOffice[RULES.homeOffice.length - 1][1] * 12;
const MIN_HOURS = RULES.homeOffice[0][0];

/**
 * HMRC's two ways for the self-employed to claim working from home, side by side: the simplified flat rate plus a
 * business share of fixed costs, or a business share of all household costs. Hours drive both: the flat-rate band, and
 * the time split of a room that's also used for other things.
 */
export function HomeOfficeCalculator() {
  const [s, set] = useQueryState({
    hours: 87, months: 12, rooms: 5, workRooms: 1, use: "shared", other: 87, running: 2_000, fixed: 4_800, profit: 40_000, region: "rUK" as Region,
  });
  const shared = s.use === "shared";
  const r = homeOffice({ hours: s.hours, months: s.months, running: s.running, fixed: s.fixed, rooms: s.rooms, workRooms: s.workRooms, shared, otherHours: s.other });
  const { saving, loss, wipesOut } = expenseSaving(s.profit, r.claim, s.region);
  const gap = Math.abs(r.flatClaim - r.actualClaim);
  const sub = !r.claim
    ? "Enter your hours, rooms and bills to see a claim."
    : r.best === "flat"
      ? `The flat rate (${gbp(r.monthly)} a month for ${r.months} month${r.months === 1 ? "" : "s"})${r.fixedShare ? " plus your share of fixed costs" : ""}${gap >= 1 ? `, ${gbp(gap)} more than a share of all your bills` : ""}.`
      : `A share of all your bills, ${gap >= 1 ? `${gbp(gap)} more than the flat rate plus fixed costs` : "level with the flat rate"}.`;
  return (
    <Calc
      inputs={<>
        <p className="kicker -mb-2">Your work at home</p>
        <NumberField name="hours" label="Hours you work at home in a month" prefix="" suffix="hours" decimals={0} max={744} value={s.hours} onChange={set("hours")}
          hint="Time on the business itself: the work, your records and finding customers. 4 hours a day, Monday to Friday, is about 87." />
        <NumberField name="months" label="Months you work from home" prefix="" suffix="of 12" decimals={0} max={12} value={s.months} onChange={set("months")} />
        <p className="kicker -mb-2 mt-2">The rooms you use</p>
        <NumberField name="rooms" label="Rooms in your home" prefix="" suffix="rooms" decimals={0} max={50} value={s.rooms} onChange={set("rooms")} hint="The main rooms. Count them the same way each year." />
        <NumberField name="workRooms" label="Rooms you work in" prefix="" suffix="rooms" decimals={0} max={50} value={s.workRooms} onChange={set("workRooms")} />
        <Segmented name="use" label="The room you work in is" value={s.use} onChange={set("use")} options={[["work", "Only for work"], ["shared", "Shared"]]}
          hint={shared ? undefined : "Kept for work, with no other use. Otherwise choose shared."} />
        {shared && (
          <NumberField name="other" label="Hours a month it’s used for other things" prefix="" suffix="hours" decimals={0} max={744} value={s.other} onChange={set("other")}
            hint="Such as family time in the evenings. Leave out time it sits empty." />
        )}
        <p className="kicker -mb-2 mt-2">Your bills for the year</p>
        <NumberField name="running" label="Running costs" hint="Heating, electricity and metered water: bills that go up the more you use them." value={s.running} onChange={set("running")} />
        <NumberField name="fixed" label="Fixed costs" hint="Council tax, mortgage interest (not repayments), rent, home insurance and water rates." value={s.fixed} onChange={set("fixed")} />
        <p className="kicker -mb-2 mt-2">Your tax</p>
        <NumberField name="profit" label="Your business profit" hint="Used to work out the tax the claim saves." value={s.profit} onChange={set("profit")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
      </>}
      results={<>
        <ResultHero label="Best claim for the year" value={gbp(r.claim)} sub={sub} />
        <ResultRows rows={[
          { label: <>Flat rate + share of fixed costs{r.best === "flat" && r.claim ? " (best)" : ""}</>, value: gbp(r.flatClaim) },
          { label: <>Share of all your bills{r.best === "actual" && r.claim ? " (best)" : ""}</>, value: gbp(r.actualClaim) },
          { label: "Tax and NI the best claim saves", value: gbp(saving), strong: true },
        ]} />
        {s.hours < MIN_HOURS && s.months > 0 && (
          <Note>The flat rate starts at {MIN_HOURS} hours a month, so below that only a share of your bills can be claimed.</Note>
        )}
        {wipesOut && (
          <Warning>
            That claim is more than your {gbp(s.profit)} profit, so it would cancel all your tax and leave a {gbp(loss)} loss. Check the bills and rooms: home costs rarely come close to a business’s profit.
          </Warning>
        )}
        {!wipesOut && r.area > 0.5 && (
          <Warning>Working in more than half your home is unusual. HMRC expects a split you can explain, such as a room set aside for work.</Warning>
        )}
        <Note>
          Both methods include {gbp(r.fixedShare)} of fixed costs: the flat rate only replaces running costs, so HMRC lets you claim a business share of fixed costs on top.
          Running costs come to {gbp(r.runningShare)} by share, against {gbp(r.flat)} at the flat rate ({gbp(FLAT_MAX)} a year at most).
          {shared ? " For a shared room, fixed costs are split by your hours out of the whole day, and running costs by your hours out of the room’s total use." : ""}
          {" "}Phone and broadband can be claimed on top of either.
        </Note>
      </>}
    />
  );
}
