import type { Audience } from "./keyDates";
import type { Block } from "./calculators";
import { RULES, gbp, pct } from "./taxRules";

export type AudiencePage = {
  slug: string;
  /** Short label for links: "Landlords". */
  label: string;
  h1: [string, string];
  title: string;
  description: string;
  lede: string;
  tint: string;
  /** Three quick facts shown as tiles. */
  facts: { figure: string; label: string }[];
  body: Block[];
  calculators: string[];
  dates: Audience[];
  faq: { q: string; a: string }[];
  inApp: string[];
};

const Y = RULES.taxYear;

export const AUDIENCES: AudiencePage[] = [
  {
    slug: "employees",
    label: "Employees",
    h1: ["Tax for", "employees."],
    title: `Tax for Employees ${Y}: Payslips, Tax Codes and Take-Home Pay`,
    description: `A clear guide to tax for UK employees in ${Y}: what comes off your payslip, how to check your tax code, pensions, student loans and when you need Self Assessment.`,
    lede: "PAYE does most of the work, but it’s worth knowing what comes off your pay, and how to keep more of it.",
    tint: "var(--tool-income)",
    facts: [
      { figure: gbp(RULES.personalAllowance), label: "Personal Allowance, tax-free" },
      { figure: pct(RULES.employeeNI.main), label: "Employee National Insurance" },
      { figure: "60%", label: "Effective rate from £100,000 to £125,140" },
    ],
    body: [
      { h: "What comes off your pay", p: ["Your employer deducts Income Tax, National Insurance, and any pension and student loan contributions before you’re paid. Your payslip and your P60 at the end of the year show exactly how much."] },
      { h: "Check your tax code", p: ["Most people with one job have the code 1257L. A different code can mean benefits in kind, untaxed income or an underpayment being collected. Codes ending in W1, M1 or X are emergency codes and can take too much until they’re fixed."] },
      { h: "Ways to keep more", ul: ["Pay into your pension: you get relief at your top rate, and salary sacrifice saves NI too", "Claim professional subscriptions and work uniform cleaning from HMRC", "Claim Mileage Allowance Relief if you drive your own car for work and your employer pays under 55p a mile", "Transfer Marriage Allowance if your partner earns under the Personal Allowance"] },
      { h: "When you need Self Assessment", p: ["Usually only if you have other income: self-employment over £1,000, rent, or large amounts of savings interest or dividends. Child Benefit with income over £60,000 can be paid through your tax code instead."] },
    ],
    calculators: ["take-home-pay", "pension-contribution", "business-mileage", "combined-income"],
    dates: ["everyone", "employees"],
    faq: [
      { q: "Why have I paid too much tax?", a: "Starting a job mid-year, an emergency tax code or a change in hours are the usual reasons. HMRC normally refunds overpaid PAYE automatically after the tax year ends, or you can check your tax code online." },
      { q: "Is salary sacrifice worth it?", a: "Usually, if your employer offers it: your pension contributions come out before both Income Tax and National Insurance. It lowers your official salary, which can affect mortgage applications and some benefits." },
    ],
    inApp: ["Take-home pay with your tax code", "Pension and salary sacrifice comparisons", "A payday card to share", "Reminders for the dates that apply to you"],
  },
  {
    slug: "self-employed",
    label: "Sole traders",
    h1: ["Tax for sole traders", "and freelancers."],
    title: `Self-Employed Tax Guide ${Y}: Sole Traders and Freelancers`,
    description: `Everything a UK sole trader or freelancer needs for ${Y}: what tax you pay, how much to set aside, allowable expenses, payments on account, VAT and Making Tax Digital.`,
    lede: "No employer is taking tax for you, so the trick is knowing what you’ll owe and putting it aside as you go.",
    tint: "var(--tool-claims)",
    facts: [
      { figure: pct(RULES.class4NI.main), label: "Class 4 NI on profits from £12,570" },
      { figure: gbp(RULES.vat.registration), label: "VAT registration threshold" },
      { figure: "31 Jan", label: "Return and balance due" },
    ],
    body: [
      { h: "What you pay", p: ["Income Tax and Class 4 National Insurance on your profit, through Self Assessment. Profit is your turnover minus allowable expenses, so good records save real money."] },
      { h: "Put tax aside as you go", p: ["Most basic rate sole traders set aside 20% to 25% of every payment. Keep it in a separate savings account so it isn’t spent by January."] },
      { h: "Payments on account", p: ["Once your bill is over £1,000 you pay towards next year in advance, in January and July. Your second January can include last year’s balance and half of this year’s bill, which catches many people out."] },
      { h: "Making Tax Digital", p: ["From April 2026 sole traders and landlords with qualifying income over £50,000 keep digital records and send quarterly updates. The threshold falls to £30,000 in 2027 and £20,000 in 2028."] },
    ],
    calculators: ["self-employed-tax", "business-expenses", "home-office", "business-mileage", "payments-on-account", "making-tax-digital"],
    dates: ["everyone", "self-assessment", "mtd"],
    faq: [
      { q: "When do I need to register as self-employed?", a: "When your self-employed income goes over £1,000 in a tax year. Register for Self Assessment by 5 October after the end of that tax year." },
      { q: "Should I become a limited company?", a: "It can save tax at higher profits, but brings more admin, accounts and responsibilities. It’s worth talking to an accountant once your profit is well into the higher rate band." },
    ],
    inApp: ["Your bill as you go, with what to set aside", "Expenses, mileage logs and home office", "Payments on account planned and dated", "Making Tax Digital start date and reminders"],
  },
  {
    slug: "side-hustle",
    label: "Side hustles",
    h1: ["A job and a", "side hustle."],
    title: `Side Hustle Tax UK ${Y}: Tax on Income Alongside a Job`,
    description: `How tax works on a side hustle or second income in ${Y}: the £1,000 trading allowance, when to register, how much extra tax you’ll pay, and how HMRC finds out about online sales.`,
    lede: "Selling online, freelancing in the evenings or renting out a room? Here’s when HMRC needs to know, and what it’ll cost.",
    tint: "var(--tool-income)",
    facts: [
      { figure: gbp(RULES.tradingAllowance), label: "Trading allowance, tax-free" },
      { figure: "30 sales", label: "When platforms report you to HMRC" },
      { figure: "5 Oct", label: "Deadline to register" },
    ],
    body: [
      { h: "The £1,000 trading allowance", p: ["If your side income is £1,000 or less in the tax year, before expenses, you don’t need to tell HMRC. Over that, you register for Self Assessment and can deduct either £1,000 or your real expenses."] },
      { h: "Why the tax rate can be higher", p: ["Your salary uses up your Personal Allowance, so side profit is taxed from the first pound, at your highest rate. Cross £50,270 in total and the extra is taxed at 40%."] },
      { h: "Online platforms report to HMRC", p: ["Since 2024, sites such as eBay, Vinted, Etsy and Airbnb send HMRC details of sellers with 30 or more sales, or around £1,700 or more, in a year. Selling your own unwanted things isn’t taxable trading, but HMRC may ask."] },
    ],
    calculators: ["combined-income", "self-employed-tax", "business-expenses", "payments-on-account"],
    dates: ["everyone", "self-assessment"],
    faq: [
      { q: "Do I pay National Insurance on a side hustle?", a: "Class 4 NI applies to self-employed profit over £12,570, worked out separately from your salary. Most small side businesses pay little or none." },
      { q: "Can my side hustle tax be taken through my tax code?", a: "Yes, if you owe less than £3,000, have PAYE income and file your return online by 30 December." },
    ],
    inApp: ["Salary and side income together", "What to set aside from each sale", "Trading allowance versus expenses", "Payments on account"],
  },
  {
    slug: "landlords",
    label: "Landlords",
    h1: ["Tax for", "landlords."],
    title: `Landlord Tax Guide ${Y}: Rental Income, Mortgage Interest and MTD`,
    description: `How UK rental income is taxed in ${Y}: allowable expenses, the mortgage interest tax credit, the £1,000 property allowance, Making Tax Digital for landlords and the rates changing in April 2027.`,
    lede: "Rent is taxed as income on top of everything else you earn. Here’s what you can deduct, and what’s changing.",
    tint: "var(--tool-planning)",
    facts: [
      { figure: "20%", label: "Tax credit on mortgage interest" },
      { figure: gbp(RULES.propertyAllowance), label: "Property allowance" },
      { figure: "Apr 2027", label: "Property income rates rise 2 points" },
    ],
    body: [
      { h: "How rent is taxed", p: ["Your rental profit is added to your other income and taxed at your rates. Allowable costs include letting agent fees, repairs, insurance, ground rent, service charges, accountancy and replacing furnishings."] },
      { h: "Mortgage interest", p: ["You can’t deduct mortgage interest from rental income. Instead you get a tax credit of 20% of the interest, which means higher rate landlords effectively get relief at the basic rate only."] },
      { h: "Changes ahead", ul: ["From 6 April 2026: Making Tax Digital for landlords and sole traders with qualifying income over £50,000", "From 6 April 2027: property income taxed at 22%, 42% and 47%, two points above other income", "Gross rent counts towards the Making Tax Digital threshold, not your profit"] },
    ],
    calculators: ["making-tax-digital", "payments-on-account", "combined-income", "take-home-pay"],
    dates: ["everyone", "self-assessment", "mtd"],
    faq: [
      { q: "Do I pay tax on renting out a room in my home?", a: "Not on up to £7,500 a year under Rent a Room relief, if you live there too. Above that, you can choose to pay tax on the excess or on your profit." },
      { q: "Do jointly owned properties count in full for Making Tax Digital?", a: "No. Each owner counts their own share of the gross rent towards the threshold." },
    ],
    inApp: ["Rent alongside your other income", "Making Tax Digital start date", "Payments on account planned", "Reminders before each deadline"],
  },
  {
    slug: "company-directors",
    label: "Company directors",
    h1: ["Tax for", "company directors."],
    title: `Company Director Tax ${Y}: Salary, Dividends and Corporation Tax`,
    description: `How tax works for UK limited company directors in ${Y}: salary and National Insurance, dividend tax rates and allowance, Corporation Tax, pensions and Self Assessment.`,
    lede: "Running your own company means planning salary, dividends and pension together. Here are the numbers that matter.",
    tint: "var(--pay-pension)",
    facts: [
      { figure: pct(RULES.dividends.basic, 2), label: "Dividend tax, basic rate" },
      { figure: gbp(RULES.dividends.allowance), label: "Dividend allowance" },
      { figure: `${pct(RULES.corporationTax.small)}–${pct(RULES.corporationTax.main)}`, label: "Corporation Tax" },
    ],
    body: [
      { h: "Salary", p: [`Many directors take a salary around the Personal Allowance of ${gbp(RULES.personalAllowance)}. Employer National Insurance is ${pct(RULES.employerNI.rate)} on pay over ${gbp(RULES.employerNI.secondaryThreshold)}, though the Employment Allowance can cover it if the company has other employees.`] },
      { h: "Dividends", p: [`Dividends are paid from profit after Corporation Tax. The first ${gbp(RULES.dividends.allowance)} is tax-free, then they’re taxed at ${pct(RULES.dividends.basic, 2)}, ${pct(RULES.dividends.higher, 2)} or ${pct(RULES.dividends.additional, 2)} depending on your band. No National Insurance is due on dividends.`] },
      { h: "Pensions", p: ["Employer pension contributions from the company are usually a deductible business expense, with no Income Tax or National Insurance for you. They count towards your £60,000 annual allowance."] },
    ],
    calculators: ["take-home-pay", "pension-contribution", "vat", "payments-on-account"],
    dates: ["everyone", "self-assessment", "employers"],
    faq: [
      { q: "Do company directors need to do Self Assessment?", a: "Not automatically. You need to if you have income that isn’t taxed at source, such as dividends over the allowance, so most directors who take dividends do file a return." },
      { q: "Is a company’s money my money?", a: "No. It belongs to the company. Taking money out other than as salary, dividends or expenses can create a director’s loan, with its own tax rules." },
    ],
    inApp: ["Take-home from salary", "Pension comparisons", "VAT monitoring", "Every key date for directors"],
  },
];

export const audienceBySlug = (slug: string) => AUDIENCES.find((a) => a.slug === slug);
