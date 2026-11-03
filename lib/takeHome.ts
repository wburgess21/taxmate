export type Region = "rUK" | "scotland";

/** 2026/27 bands as in the app's TaxRules.swift: (upper limit of taxable income, rate). */
const BANDS: Record<Region, [number, number][]> = {
  rUK: [[37_700, 0.2], [125_140, 0.4], [Infinity, 0.45]],
  scotland: [[3_967, 0.19], [16_956, 0.2], [31_092, 0.21], [62_430, 0.42], [125_140, 0.45], [Infinity, 0.48]],
};

/** A rough annual take-home estimate from salary alone: no pension, loans or benefits in kind. */
export function takeHome(salary: number, region: Region) {
  const allowance = Math.max(0, 12_570 - Math.max(0, salary - 100_000) / 2);
  const taxable = Math.max(0, salary - allowance);
  let tax = 0, lower = 0;
  for (const [upper, rate] of BANDS[region]) {
    tax += Math.max(0, Math.min(taxable, upper) - lower) * rate;
    lower = upper;
  }
  const ni = Math.max(0, Math.min(salary, 50_270) - 12_570) * 0.08 + Math.max(0, salary - 50_270) * 0.02;
  return { tax, ni, keep: salary - tax - ni };
}

export const gbp = (n: number, pence = false) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: pence ? 2 : 0, minimumFractionDigits: pence ? 2 : 0 }).format(n);
