/**
 * 2026/27 UK tax rules used by the website's calculators and reference pages, mirroring the app's TaxRules.swift.
 * Every figure lives here so the yearly update is one file: check each against GOV.UK when the tax year changes.
 */

export type Region = "rUK" | "scotland";
export type StudentLoanPlan = "plan1" | "plan2" | "plan4" | "plan5" | "postgrad";

export const RULES = {
  taxYear: "2026/27",
  /** When these figures were last checked against GOV.UK and the app (YYYY-MM-DD). Shown on /tax-rates. */
  checked: "2026-11-04",
  /** 6 April of the year the tax year starts. */
  startYear: 2026,

  personalAllowance: 12_570,
  /** The allowance falls by £1 for every £2 of adjusted net income over this. */
  allowanceTaperFrom: 100_000,

  /** (upper limit of taxable income, rate, band name). */
  bands: {
    rUK: [
      [37_700, 0.2, "Basic rate"],
      [125_140, 0.4, "Higher rate"],
      [Infinity, 0.45, "Additional rate"],
    ],
    scotland: [
      [3_967, 0.19, "Starter rate"],
      [16_956, 0.2, "Basic rate"],
      [31_092, 0.21, "Intermediate rate"],
      [62_430, 0.42, "Higher rate"],
      [125_140, 0.45, "Advanced rate"],
      [Infinity, 0.48, "Top rate"],
    ],
  } satisfies Record<Region, [number, number, string][]>,

  /** Class 1 employee National Insurance. */
  employeeNI: { primaryThreshold: 12_570, upperEarningsLimit: 50_270, main: 0.08, upper: 0.02 },
  /** Class 4 self-employed National Insurance. Class 2 is voluntary since April 2024. */
  class4NI: { lowerProfitsLimit: 12_570, upperProfitsLimit: 50_270, main: 0.06, upper: 0.02 },
  /** Employer (secondary Class 1) National Insurance. */
  employerNI: { secondaryThreshold: 5_000, rate: 0.15, employmentAllowance: 10_500 },

  studentLoans: {
    plan1: { label: "Plan 1", threshold: 26_900, rate: 0.09 },
    plan2: { label: "Plan 2", threshold: 29_385, rate: 0.09 },
    plan4: { label: "Plan 4 (Scotland)", threshold: 33_795, rate: 0.09 },
    plan5: { label: "Plan 5", threshold: 25_000, rate: 0.09 },
    postgrad: { label: "Postgraduate loan", threshold: 21_000, rate: 0.06 },
  } satisfies Record<StudentLoanPlan, { label: string; threshold: number; rate: number }>,

  dividends: { allowance: 500, basic: 0.1075, higher: 0.3575, additional: 0.3935 },
  savings: { startingRate: 5_000, allowanceBasic: 1_000, allowanceHigher: 500 },
  capitalGains: { annualExempt: 3_000, basic: 0.18, higher: 0.24 },
  pensions: { annualAllowance: 60_000, basicRelief: 0.2 },
  marriageAllowance: 1_260,
  tradingAllowance: 1_000,
  propertyAllowance: 1_000,
  childBenefitCharge: { from: 60_000, to: 80_000 },
  isaAllowance: 20_000,

  vat: { standard: 0.2, reduced: 0.05, registration: 90_000, deregistration: 88_000 },

  /** Approved mileage rates, pounds per business mile. Cars and vans rose from 45p to 55p on 6 April 2026. */
  mileage: { carFirst10k: 0.55, carAfter: 0.25, motorcycle: 0.24, bicycle: 0.2, passenger: 0.05 },

  /** Simplified expenses for working from home (self-employed): hours a month → flat amount a month. */
  homeOffice: [
    [25, 10],
    [51, 18],
    [101, 26],
  ] as [minHours: number, monthly: number][],

  paymentsOnAccount: { minimumBill: 1_000, collectedAtSourceShare: 0.8 },

  /** Making Tax Digital for Income Tax: qualifying income over the threshold → required from 6 April of that year. */
  mtd: [
    { from: 2026, over: 50_000, basedOn: "2024/25" },
    { from: 2027, over: 30_000, basedOn: "2025/26" },
    { from: 2028, over: 20_000, basedOn: "2026/27" },
  ],

  corporationTax: { small: 0.19, main: 0.25, smallProfitsLimit: 50_000, mainRateFrom: 250_000 },
} as const;

/** The personal allowance after the taper for incomes over £100,000. */
export function personalAllowance(adjustedNetIncome: number) {
  return Math.max(0, RULES.personalAllowance - Math.max(0, adjustedNetIncome - RULES.allowanceTaperFrom) / 2);
}

export type TaxBand = { name: string; rate: number; amount: number; tax: number };

/**
 * Income Tax on non-savings income. `bandExtension` is a gross relief-at-source pension contribution (or Gift Aid):
 * it widens the bands from the basic rate up and lowers adjusted net income, as HMRC does.
 */
export function incomeTax(income: number, region: Region, bandExtension = 0) {
  const r = taxByBand(income, region, bandExtension);
  return { ...r, marginal: marginalRate(income, region, bandExtension) };
}

/** The Income Tax rate on the next pound, including the 60% effect of the allowance taper. */
export function marginalRate(income: number, region: Region, bandExtension = 0) {
  const a = taxByBand(income, region, bandExtension).tax, b = taxByBand(income + 100, region, bandExtension).tax;
  return Math.round(((b - a) / 100) * 1000) / 1000;
}

function taxByBand(income: number, region: Region, ext: number) {
  const allowance = personalAllowance(income - ext);
  const taxable = Math.max(0, income - allowance);
  const bands: TaxBand[] = [];
  let tax = 0, lower = 0;
  RULES.bands[region].forEach(([upper, rate, name], i) => {
    // Scotland's starter band isn't widened; everything from the basic rate up is.
    const top = upper + (upper === Infinity || (region === "scotland" && i === 0) ? 0 : ext);
    const amount = Math.max(0, Math.min(taxable, top) - lower);
    if (amount > 0) bands.push({ name, rate, amount, tax: amount * rate });
    tax += amount * rate;
    lower = top;
  });
  return { tax, allowance, taxable, bands };
}

export function employeeNI(pay: number) {
  const { primaryThreshold: pt, upperEarningsLimit: uel, main, upper } = RULES.employeeNI;
  return Math.max(0, Math.min(pay, uel) - pt) * main + Math.max(0, pay - uel) * upper;
}

export function class4NI(profit: number) {
  const { lowerProfitsLimit: lpl, upperProfitsLimit: upl, main, upper } = RULES.class4NI;
  return Math.max(0, Math.min(profit, upl) - lpl) * main + Math.max(0, profit - upl) * upper;
}

/**
 * Student loan repayments. With more than one undergraduate plan you repay once, from the lowest threshold; a
 * postgraduate loan is repaid separately on top. Rounded down to whole pounds for the year, as the app does.
 */
export function studentLoan(pay: number, plans: StudentLoanPlan[]) {
  const under = plans.filter((p) => p !== "postgrad").map((p) => RULES.studentLoans[p]);
  const lowest = under.length ? Math.min(...under.map((l) => l.threshold)) : Infinity;
  const ug = Number.isFinite(lowest) ? Math.max(0, pay - lowest) * 0.09 : 0;
  const pg = plans.includes("postgrad") ? Math.max(0, pay - RULES.studentLoans.postgrad.threshold) * RULES.studentLoans.postgrad.rate : 0;
  return Math.floor(ug) + Math.floor(pg);
}

export type TakeHomeInput = {
  salary: number;
  region: Region;
  /** Workplace pension as a share of salary, taken before tax (net pay arrangement): saves Income Tax, not NI. */
  pensionPct?: number;
  plans?: StudentLoanPlan[];
};

export function takeHomePay({ salary, region, pensionPct = 0, plans = [] }: TakeHomeInput) {
  const pension = Math.max(0, salary * (pensionPct / 100));
  const it = incomeTax(salary - pension, region);
  const ni = employeeNI(salary);
  const loan = studentLoan(salary, plans);
  const keep = salary - pension - it.tax - ni - loan;
  return { salary, pension, tax: it.tax, ni, loan, keep, allowance: it.allowance, bands: it.bands, marginal: it.marginal };
}

export function selfEmployedTax(profit: number, region: Region) {
  const it = incomeTax(profit, region);
  const ni = class4NI(profit);
  return { profit, tax: it.tax, ni, total: it.tax + ni, keep: profit - it.tax - ni, bands: it.bands, allowance: it.allowance, marginal: it.marginal + marginalClass4(profit) };
}

function marginalClass4(profit: number) {
  const { lowerProfitsLimit: lpl, upperProfitsLimit: upl, main, upper } = RULES.class4NI;
  return profit < lpl ? 0 : profit < upl ? main : upper;
}

/**
 * A salary and self-employed profit together. PAYE covers the salary on its own (assuming the full allowance is in
 * the tax code); the rest is due through Self Assessment.
 */
export function combinedIncome(salary: number, profit: number, region: Region) {
  const total = incomeTax(salary + profit, region);
  const paye = incomeTax(salary, region).tax;
  const ni = employeeNI(salary);
  const c4 = class4NI(profit);
  const selfAssessment = Math.max(0, total.tax - paye) + c4;
  return { salary, profit, tax: total.tax, paye, ni, class4: c4, selfAssessment, keep: salary + profit - total.tax - ni - c4, bands: total.bands, marginal: total.marginal };
}

/**
 * The tax a deductible cost saves for a sole trader with this profit: Income Tax and Class 4. It can never save more
 * than the tax on the profit; any cost beyond the profit becomes a trading `loss` instead.
 */
export function expenseSaving(profit: number, cost: number, region: Region) {
  const before = selfEmployedTax(profit, region).total;
  const after = selfEmployedTax(Math.max(0, profit - cost), region).total;
  return { saving: before - after, realCost: cost - (before - after), loss: Math.max(0, cost - profit), wipesOut: cost >= profit && profit > 0 };
}

export type Vehicle = "car" | "motorcycle" | "bicycle";

export function mileageAllowance(miles: number, vehicle: Vehicle) {
  const m = RULES.mileage;
  if (vehicle === "motorcycle") return miles * m.motorcycle;
  if (vehicle === "bicycle") return miles * m.bicycle;
  return Math.min(miles, 10_000) * m.carFirst10k + Math.max(0, miles - 10_000) * m.carAfter;
}

/** Simplified flat rate a month for working from home, by hours worked at home that month. */
export function homeOfficeMonthly(hours: number) {
  let amount = 0;
  for (const [min, monthly] of RULES.homeOffice) if (hours >= min) amount = monthly;
  return amount;
}

/**
 * A personal (relief at source) pension payment. The provider adds 20% basic rate relief; higher and additional rate
 * taxpayers claim the rest through Self Assessment, which is the drop in Income Tax from widening the bands.
 */
export function pensionRelief(income: number, netPaid: number, region: Region) {
  const gross = netPaid / (1 - RULES.pensions.basicRelief);
  const basic = gross - netPaid;
  const before = incomeTax(income, region).tax;
  const after = incomeTax(income, region, gross).tax;
  const extra = Math.max(0, before - after);
  return { gross, basic, extra, totalRelief: basic + extra, realCost: netPaid - extra, overAllowance: gross > RULES.pensions.annualAllowance };
}

export function vatSplit(amount: number, rate: number, mode: "add" | "remove") {
  if (mode === "add") return { net: amount, vat: amount * rate, gross: amount * (1 + rate) };
  const net = amount / (1 + rate);
  return { net, vat: amount - net, gross: amount };
}

/** When Making Tax Digital for Income Tax applies, from qualifying income (self-employment and property turnover). */
export function mtdStart(qualifyingIncome: number) {
  return RULES.mtd.find((m) => qualifyingIncome > m.over) ?? null;
}

/**
 * Payments on account for the year after `lastBill` (the Self Assessment bill, after tax taken at source).
 * `collectedAtSource` is tax already deducted, such as PAYE.
 */
export function paymentsOnAccount(lastBill: number, collectedAtSource = 0) {
  const { minimumBill, collectedAtSourceShare } = RULES.paymentsOnAccount;
  const total = lastBill + collectedAtSource;
  const needed = lastBill >= minimumBill && (total === 0 || collectedAtSource / total <= collectedAtSourceShare);
  return { needed, each: needed ? lastBill / 2 : 0 };
}

/** Whole pounds, or pence when asked. */
export const gbp = (n: number, pence = false) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: pence ? 2 : 0, minimumFractionDigits: pence ? 2 : 0 }).format(Number.isFinite(n) ? n : 0);

/** A per-mile rate in pounds as pence, e.g. 0.55 → "55p" (rounded, so 0.55 × 100 can't print 55.00000000000001). */
export const pence = (n: number) => `${Math.round(n * 100)}p`;

export const pct = (r: number, digits = 0) => `${(r * 100).toFixed(digits).replace(/\.0+$/, "")}%`;
