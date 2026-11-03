import { takeHomePay, type Region } from "./taxRules";

export type { Region };
export { gbp } from "./taxRules";

/** A rough annual take-home estimate from salary alone: no pension, loans or benefits in kind. */
export function takeHome(salary: number, region: Region) {
  const r = takeHomePay({ salary, region });
  return { tax: r.tax, ni: r.ni, keep: r.keep };
}
