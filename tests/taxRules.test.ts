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
