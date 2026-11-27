/**
 * The website's tax engine (lib/taxRules.ts) checked against the iOS app's own independent fixtures
 * (taxmate-ios Documentation/TaxRules/Release1-4.md), so the web calculators and the app can't drift apart.
 * Run with `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as T from "../lib/taxRules.ts";

const eq = (name: string, got: number, want: number) =>
  test(name, () => assert.ok(Math.abs(got - want) < 0.006, `${name}: got ${got}, want ${want}`));

eq("SE £30k total", T.selfEmployedTax(30000, "rUK").total, 4531.8);
eq("SE £50,270 total", T.selfEmployedTax(50270, "rUK").total, 9802);
eq("SE £110k tax", T.selfEmployedTax(110000, "rUK").tax, 33432);
eq("SE £110k NI", T.selfEmployedTax(110000, "rUK").ni, 3456.6);
eq("Scot £30k tax", T.incomeTax(30000, "scotland").tax, 3451.07);
eq("Plan 2 £30k", T.studentLoan(30000, ["plan2"]), 55);
eq("Postgrad £30k", T.studentLoan(30000, ["postgrad"]), 540);
eq("Plan1+Plan2 £30k (lowest once)", T.studentLoan(30000, ["plan1", "plan2"]), Math.floor((30000 - 26900) * 0.09));
eq("POA £1,000 each", T.paymentsOnAccount(1000).each, 500);
eq("POA £999.99", T.paymentsOnAccount(999.99).each, 0);
eq("POA exactly 80% at source still due", T.paymentsOnAccount(1000, 4000).each, 500);
eq("Mileage 10,000", T.mileageAllowance(10000, "car"), 5500);
eq("Mileage 10,001", T.mileageAllowance(10001, "car"), 5500.25);
eq("Mileage 11,000", T.mileageAllowance(11000, "car"), 5750);
eq("Motorcycle 1,000", T.mileageAllowance(1000, "motorcycle"), 240);
eq("Trading £30k−£750", T.selfEmployedTax(29250, "rUK").total, 4336.8);
eq("Pension £60,270 / £8k net extra", T.pensionRelief(60270, 8000, "rUK").extra, 2000);
eq("Pension £60,270 / £8k net cost", T.pensionRelief(60270, 8000, "rUK").realCost, 6000);
eq("Pension £110k / £10k gross extra", T.pensionRelief(110000, 8000, "rUK").extra, 4000);
eq("Pension Scot £30k / £1k gross", T.pensionRelief(30000, 800, "scotland").extra, 4.74);
eq("Pension Scot £50k / £1k gross", T.pensionRelief(50000, 800, "scotland").extra, 220);
eq("Pension Scot £15k", T.pensionRelief(15000, 800, "scotland").extra, 0);
eq("Combined £50k/£10k total IT", T.combinedIncome(50000, 10000, "rUK").tax, 11432);
eq("Combined £50k/£10k SA tax", T.combinedIncome(50000, 10000, "rUK").tax - T.combinedIncome(50000, 10000, "rUK").paye, 3946);
eq("Combined £50k/£10k Class 4", T.combinedIncome(50000, 10000, "rUK").class4, 0);
eq("VAT £100 +20%", T.vatSplit(100, 0.2, "add").gross, 120);

test("MTD: exactly on a threshold doesn't trigger it", () => {
  assert.equal(T.mtdStart(50_000)?.from, 2027);
  assert.equal(T.mtdStart(50_000.01)?.from, 2026);
  assert.equal(T.mtdStart(20_000), null);
});

test("An expense can't save more than the tax on the profit; the rest is a loss", () => {
  const r = T.expenseSaving(40_000, 100_000, "rUK");
  assert.equal(Math.round(r.saving * 100) / 100, Math.round(T.selfEmployedTax(40_000, "rUK").total * 100) / 100);
  assert.equal(r.loss, 60_000);
  assert.equal(r.wipesOut, true);
  assert.equal(T.expenseSaving(40_000, 300, "rUK").wipesOut, false);
});

// Combined income: Class 4 at the main rate is capped by the annual maximum once Class 1 has used it (app: SharedIncomeRules.class4).
eq("Combined £60k/£20k Class 4 (main rate used up by Class 1)", T.combinedIncome(60000, 20000, "rUK").class4, 148.6);
eq("Combined £30k/£30k Class 4 (part headroom)", T.combinedIncome(30000, 30000, "rUK").class4, 927);
eq("Combined £10k/£30k Class 4 (no Class 1)", T.combinedIncome(10000, 30000, "rUK").class4, 1045.8);

// Pension relief is limited to relevant earnings, or £3,600 gross if more (app: PensionCalculator).
test("Pension relief stops at earnings", () => {
  const r = T.pensionRelief(20000, 24000, "rUK");
  assert.equal(r.overEarnings, true);
  assert.ok(Math.abs(r.basic - 4000) < 0.006, `basic ${r.basic}`);
  assert.equal(T.pensionRelief(0, 2880, "rUK").overEarnings, false);
  assert.ok(Math.abs(T.pensionRelief(0, 2880, "rUK").basic - 720) < 0.006);
  assert.equal(T.pensionRelief(60270, 8000, "rUK").overEarnings, false);
});

// Home office, HMRC BIM75010 / BIM47820: the flat rate replaces running costs only; fixed costs are claimed on top.
test("Home office: shared room, flat rate plus fixed costs wins", () => {
  const r = T.homeOffice({ hours: 87, months: 12, running: 2000, fixed: 4800, rooms: 5, workRooms: 1, shared: true, otherHours: 87 });
  assert.equal(r.flat, 216);
  assert.equal(r.fixedShare, 114.41);
  assert.equal(r.runningShare, 200);
  assert.equal(r.best, "flat");
  assert.equal(r.claim, 330.41);
});
test("Home office: room used only for work, actual costs win", () => {
  const r = T.homeOffice({ hours: 120, months: 12, running: 2000, fixed: 4800, rooms: 5, workRooms: 1, shared: false, otherHours: 0 });
  assert.equal(r.flat, 312);
  assert.equal(r.fixedShare, 960);
  assert.equal(r.runningShare, 400);
  assert.equal(r.best, "actual");
  assert.equal(r.claim, 1360);
});
test("Home office: hours change both methods", () => {
  const at = (hours: number) => T.homeOffice({ hours, months: 12, running: 2000, fixed: 4800, rooms: 5, workRooms: 1, shared: true, otherHours: 60 }).claim;
  assert.ok(at(30) < at(60) && at(60) < at(110), `${at(30)} ${at(60)} ${at(110)}`);
});
test("Home office: band edges and part years", () => {
  const flat = (hours: number, months = 12) => T.homeOffice({ hours, months, running: 0, fixed: 0, rooms: 1, workRooms: 1, shared: true, otherHours: 0 }).flat;
  assert.deepEqual([flat(24), flat(25), flat(50), flat(50.9), flat(51), flat(100), flat(101)], [0, 120, 120, 120, 216, 216, 312]);
  assert.equal(flat(101, 6), 156);
});
