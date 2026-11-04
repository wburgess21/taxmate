import { RULES, gbp } from "./taxRules";

/** A block of explanatory text: a heading with paragraphs and/or a list. Plain strings, so they also feed llms.txt. */
export type Block = { h: string; p?: string[]; ul?: string[] };

export type CalculatorPage = {
  slug: string;
  /** The app tool it previews (lib/tools.ts title). */
  tool: string;
  /** Short name for cards and breadcrumbs. */
  name: string;
  /** The headline, split so the second half is set in the serif italic. */
  h1: [string, string];
  title: string;
  description: string;
  lede: string;
  body: Block[];
  faq: { q: string; a: string }[];
  /** What the full tool in the app adds. */
  inApp: string[];
  related: string[];
};

const Y = RULES.taxYear;
const PA = gbp(RULES.personalAllowance);

export const CALCULATORS: CalculatorPage[] = [
  {
    slug: "take-home-pay",
    tool: "Take Home Pay",
    name: "Take-home pay",
    h1: ["Take-home pay", "calculator."],
    title: `Take-Home Pay Calculator ${Y}: Salary After Tax UK`,
    description: `Work out your take-home pay for ${Y}: Income Tax, National Insurance, pension and student loan deductions, for England, Wales, Northern Ireland and Scotland. Free, with monthly and weekly figures.`,
    lede: "See what lands in your account each month after Income Tax, National Insurance, your pension and student loan.",
    body: [
      {
        h: "How your take-home pay is worked out",
        p: [
          `Your employer takes Income Tax, National Insurance and any student loan or pension contributions before you’re paid, through PAYE. The first ${PA} of income is your Personal Allowance and is tax-free.`,
          `In England, Wales and Northern Ireland, the next ${gbp(37_700)} is taxed at 20%, income up to ${gbp(125_140)} at 40%, and anything above at 45%. Scotland has six bands, from 19% to 48%.`,
          `Employee National Insurance is 8% on pay between ${gbp(RULES.employeeNI.primaryThreshold)} and ${gbp(RULES.employeeNI.upperEarningsLimit)} a year, and 2% above that. It’s the same across the UK.`,
        ],
      },
      {
        h: "The £100,000 tax trap",
        p: [
          `Your Personal Allowance falls by £1 for every £2 you earn over ${gbp(100_000)}, and is gone at ${gbp(125_140)}. Across that range each extra £1 of pay costs you 60p in Income Tax, plus 2p NI.`,
          "Paying more into your pension, or giving to charity through Gift Aid, lowers the income the taper is measured on and can win the allowance back.",
        ],
      },
      {
        h: "Student loan repayments",
        ul: Object.values(RULES.studentLoans).map((l) => `${l.label}: ${l.rate * 100}% of pay over ${gbp(l.threshold)} a year`),
      },
    ],
    faq: [
      { q: `How much is £30,000 after tax in ${Y}?`, a: "In England, Wales and Northern Ireland, a £30,000 salary takes home about £25,120 a year, or £2,093 a month, with no pension or student loan. That’s after £3,486 of Income Tax and £1,394 of National Insurance." },
      { q: "Why is my payslip different from this estimate?", a: "Your tax code, the timing of bonuses, benefits in kind, salary sacrifice and pension schemes that use relief at source can all change what you’re paid. Check your tax code first: an emergency code such as 1257L W1 or BR can take too much for a while." },
      { q: "Does my pension reduce my National Insurance?", a: "Only through salary sacrifice. With a net pay arrangement, which this calculator assumes, your contributions come out before Income Tax but after National Insurance." },
    ],
    inApp: ["Tax codes and Scottish taxpayers", "Salary sacrifice, bonuses and benefits in kind", "Every student loan plan at once", "A payday card to share", "Smart fill into other tools"],
    related: ["combined-income", "pension-contribution", "self-employed-tax"],
  },
  {
    slug: "self-employed-tax",
    tool: "Self-employed Tax",
    name: "Self-employed tax",
    h1: ["Self-employed", "tax calculator."],
    title: `Self-Employed Tax Calculator ${Y}: Income Tax & Class 4 NI`,
    description: `Estimate your ${Y} Self Assessment bill as a sole trader or freelancer: Income Tax and Class 4 National Insurance on your profit, and how much to set aside from each payment.`,
    lede: "Find out what you’ll owe on your profit, and how much of every invoice to put aside for the tax bill.",
    body: [
      {
        h: "What sole traders pay",
        p: [
          "As a sole trader you pay tax on your profit: turnover minus allowable expenses. Income Tax uses the same bands as everyone else, starting with your Personal Allowance.",
          `Class 4 National Insurance is 6% on profit between ${gbp(RULES.class4NI.lowerProfitsLimit)} and ${gbp(RULES.class4NI.upperProfitsLimit)}, and 2% above. Class 2 has been voluntary since April 2024: you can still pay it to protect your State Pension if your profit is low.`,
        ],
      },
      {
        h: "When you pay",
        p: [
          "There’s no PAYE, so you pay through Self Assessment. The return and the balance are due by 31 January after the tax year ends.",
          `If your bill is over ${gbp(RULES.paymentsOnAccount.minimumBill)}, HMRC also asks for two payments on account towards next year, each half of this year’s bill, on 31 January and 31 July. Your first year can feel like paying 150% of your bill at once.`,
        ],
      },
      {
        h: "The trading allowance",
        p: [`If your turnover is ${gbp(RULES.tradingAllowance)} or less, you don’t need to tell HMRC. Above that, you can deduct a flat ${gbp(RULES.tradingAllowance)} instead of your actual expenses, if that’s more.`],
      },
    ],
    faq: [
      { q: "How much should I save for tax when self-employed?", a: "For most sole traders with profit under £50,270, putting aside 20% to 25% of what you’re paid covers Income Tax and Class 4 NI. The calculator works out your own figure." },
      { q: "Do I need to register for Self Assessment?", a: "Yes, if your self-employed turnover is over £1,000 in a tax year. Register by 5 October after the end of the tax year you started in." },
      { q: "Is my income from a salary included?", a: "Not in this calculator. If you have a job as well, use the combined income calculator, which works out the extra tax on your side profit." },
    ],
    inApp: ["Multiple businesses", "Trading allowance comparison", "Payments on account built in", "Losses and other income", "Your bill on your Tax Savings Planner"],
    related: ["business-expenses", "payments-on-account", "making-tax-digital"],
  },
  {
    slug: "combined-income",
    tool: "Combined Income",
    name: "Combined income",
    h1: ["Salary plus", "side income."],
    title: `Side Hustle Tax Calculator ${Y}: Salary and Self-Employed Income`,
    description: `Work out the tax on self-employed income when you also have a job. See what PAYE covers, what you’ll owe through Self Assessment, and your top tax rate for ${Y}.`,
    lede: "Have a job and a side business? See how much extra tax your profit brings, and what you’ll pay through Self Assessment.",
    body: [
      {
        h: "How a salary and a side business are taxed together",
        p: [
          "Your salary uses up your Personal Allowance and the first part of your basic rate band through PAYE. Your self-employed profit sits on top, so it’s taxed at your highest rate.",
          "That’s why a side business can tip you into the 40% band even when neither income would on its own.",
          "Employee National Insurance comes off your salary as usual. Your profit pays Class 4 NI separately, at 6% between £12,570 and £50,270 of profit.",
        ],
      },
      {
        h: "Paying the extra tax",
        p: ["The tax on your profit is due through Self Assessment by 31 January. If it’s under £3,000 and you file online by 30 December, you can ask HMRC to collect it through your tax code instead."],
      },
    ],
    faq: [
      { q: "Do I pay tax on a side hustle?", a: "If your gross self-employed income is over £1,000 a year, yes. You register for Self Assessment and pay Income Tax and Class 4 NI on your profit." },
      { q: "What if I sell things online?", a: "Selling your own unwanted things isn’t trading. Buying to sell, or making things to sell, usually is. Platforms now report sellers with 30 or more sales, or over about £1,700, to HMRC." },
    ],
    inApp: ["Several jobs and businesses", "Rental income alongside", "Payments on account", "Saved what-if plans"],
    related: ["take-home-pay", "self-employed-tax", "payments-on-account"],
  },
  {
    slug: "home-office",
    tool: "Home Office",
    name: "Home office",
    h1: ["Working from home", "tax relief."],
    title: `Working From Home Tax Relief Calculator ${Y}: Simplified Expenses`,
    description: `Work out what you can claim for working from home as a sole trader: HMRC’s flat rates of £10, £18 or £26 a month, and the tax it saves you in ${Y}.`,
    lede: "Self-employed and working from home? See what HMRC’s flat rate lets you claim, and what that’s worth in tax.",
    body: [
      {
        h: "Two ways to claim",
        p: [
          "The simplified flat rate needs no bills or sums: you claim a fixed amount for each month, based on the hours you work at home.",
          "Or you can claim a share of your actual costs, such as heating, electricity, council tax, rent or mortgage interest. Split them by the rooms you use and the time you use them for work. It takes more records but often gives more.",
        ],
        ul: ["25 to 50 hours a month: £10", "51 to 100 hours a month: £18", "101 hours or more: £26"],
      },
      {
        h: "If you’re an employee",
        p: [
          "Your employer can pay you up to £6 a week tax-free towards the extra costs of working from home, if you have to work there.",
          "From 6 April 2026, employees can no longer claim this relief from HMRC themselves when their employer doesn’t pay it.",
        ],
      },
    ],
    faq: [
      { q: "Can I claim broadband and phone as well?", a: "Yes. The flat rate covers heat, light and power. Business use of your phone and internet can be claimed on top." },
      { q: "Does claiming home office costs affect Capital Gains Tax?", a: "Only if part of your home is used exclusively for business. Using a room for work and also for personal use doesn’t usually create a Capital Gains Tax issue." },
    ],
    inApp: ["Flat rate versus actual costs, side by side", "Room and hours split", "Saved Home Office reports"],
    related: ["business-expenses", "business-mileage", "self-employed-tax"],
  },
  {
    slug: "business-expenses",
    tool: "Business Expenses",
    name: "Business expenses",
    h1: ["What an expense", "really costs."],
    title: `Business Expense Tax Saving Calculator ${Y}: Sole Traders`,
    description: `See how much tax a business expense saves a UK sole trader in ${Y}, and what it really costs you after Income Tax and Class 4 National Insurance.`,
    lede: "Every allowable cost lowers your tax bill. See exactly how much, and what you’re really paying.",
    body: [
      {
        h: "How expenses save tax",
        p: [
          "Allowable expenses come off your turnover before tax. A £1,000 cost saves you whatever tax that £1,000 of profit would have cost, at your highest rate.",
          "For a basic rate sole trader that’s usually 26% (20% Income Tax and 6% Class 4 NI). Higher rate saves 42%, and in the £100,000 to £125,140 band it can be over 60%.",
        ],
      },
      {
        h: "What counts as allowable",
        ul: [
          "Stock, materials and things you resell",
          "Office costs, software, phone and internet",
          "Travel for work, not your normal commute",
          "Equipment such as laptops and tools (through capital allowances)",
          "Insurance, accountancy, bank charges and professional fees",
          "Marketing, website and subscriptions related to your trade",
        ],
      },
    ],
    faq: [
      { q: "Can I claim things I use personally as well?", a: "Only the business part. If you use your phone 60% for work, you can claim 60% of the bill." },
      { q: "Should I use the trading allowance instead?", a: "If your expenses are under £1,000, the £1,000 trading allowance gives a bigger deduction. You can’t use both against the same income." },
    ],
    inApp: ["Named comparisons you can save", "Trading allowance check", "Capital allowances", "Smart fill from your profit"],
    related: ["home-office", "business-mileage", "self-employed-tax"],
  },
  {
    slug: "business-mileage",
    tool: "Business Mileage",
    name: "Business mileage",
    h1: ["Business mileage", "calculator."],
    title: `Mileage Allowance Calculator ${Y}: 55p a Mile, HMRC Rates`,
    description: `Work out your business mileage claim at HMRC’s approved rates (55p and 25p a mile) for ${Y}, as a sole trader or an employee claiming Mileage Allowance Relief.`,
    lede: "Turn your business miles into a deduction, or claim back what your employer doesn’t pay, at HMRC’s approved rates.",
    body: [
      {
        h: "HMRC’s approved mileage rates",
        ul: ["Cars and vans: 55p a mile for the first 10,000 business miles in the tax year (up from 45p in 2025/26), then 25p. The 10,000 miles are shared across all the cars and vans in one business", "Motorcycles: 24p a mile", "Bicycles: 20p a mile", "Each passenger on a business trip: 5p a mile (employer payments only)"],
      },
      {
        h: "Self-employed",
        p: ["You can use mileage instead of your actual vehicle costs, as long as you stick with it for that vehicle. Keep a log of each journey: date, where, why and how far."],
      },
      {
        h: "Employees",
        p: ["If your employer pays less than the approved rate, or nothing, you can claim Mileage Allowance Relief on the difference. You get tax relief at your rate, not the full amount back."],
      },
    ],
    faq: [
      { q: "Does my commute count?", a: "No. Travel between home and your permanent workplace isn’t business travel. Trips to a temporary workplace, clients or other sites usually are." },
      { q: "Can I claim fuel as well as mileage?", a: "No. The approved rates cover fuel, servicing, insurance and wear. You can still claim parking and tolls." },
    ],
    inApp: ["Journey logs you can keep", "Multiple vehicles", "Running totals through the year", "Exports for your records"],
    related: ["business-expenses", "home-office", "self-employed-tax"],
  },
  {
    slug: "pension-contribution",
    tool: "Pension Contribution",
    name: "Pension tax relief",
    h1: ["Pension tax relief", "calculator."],
    title: `Pension Tax Relief Calculator ${Y}: Higher Rate Relief`,
    description: `See how much tax relief you get on personal pension contributions in ${Y}, including higher and additional rate relief through Self Assessment and the £100,000 Personal Allowance taper.`,
    lede: "See what a pension payment really costs you once basic, higher and additional rate relief are counted.",
    body: [
      {
        h: "How relief at source works",
        p: [
          "When you pay into a personal pension or SIPP, your provider claims 20% basic rate relief from HMRC and adds it. Pay £80 and £100 goes in.",
          "Higher and additional rate taxpayers claim the rest through Self Assessment: HMRC widens your basic rate band by the gross amount, so more of your income is taxed at 20%.",
        ],
      },
      {
        h: "Limits",
        p: [`You can get relief on up to 100% of your earnings, or ${gbp(3_600)} gross if that’s more. The annual allowance is ${gbp(RULES.pensions.annualAllowance)}, including employer contributions, and it tapers for very high earners.`],
      },
    ],
    faq: [
      { q: "Do I have to claim higher rate pension relief?", a: "Yes, if your pension uses relief at source. You claim it on your Self Assessment return or by contacting HMRC. Many higher rate taxpayers miss it." },
      { q: "What about workplace pensions?", a: "Most workplace schemes use a net pay arrangement, taking contributions before tax so you get full relief automatically. This calculator is for relief at source payments." },
    ],
    inApp: ["Cash versus pension comparisons", "Salary sacrifice", "The £100,000 taper, mapped", "Saved pension comparisons"],
    related: ["take-home-pay", "self-employed-tax", "payments-on-account"],
  },
  {
    slug: "payments-on-account",
    tool: "Tax Savings Planner",
    name: "Payments on account",
    h1: ["Payments on account", "planner."],
    title: `Payments on Account Calculator ${Y}: 31 January and 31 July`,
    description: `Work out your Self Assessment payments on account and balancing payment for 31 January and 31 July, and how much to set aside each month.`,
    lede: "Know exactly what’s due on 31 January and 31 July, and how much to put away each month to be ready.",
    body: [
      {
        h: "What payments on account are",
        p: [
          "They’re advance payments towards next year’s tax bill. Each one is half of your last Self Assessment bill, paid on 31 January and 31 July.",
          `You don’t make them if your last bill was under ${gbp(RULES.paymentsOnAccount.minimumBill)}, or if more than 80% of your tax was already taken at source, for example through PAYE.`,
        ],
      },
      {
        h: "The balancing payment",
        p: ["On 31 January you also pay whatever’s left of last year’s bill after your payments on account. In your first year of self-employment there were none, so January can include the whole bill plus the first payment on account for the new year."],
      },
    ],
    faq: [
      { q: "Can I reduce my payments on account?", a: "Yes, if you expect this year’s bill to be lower. You can ask HMRC online or on your return. If you reduce them too far, you’ll pay interest on the shortfall." },
      { q: "What happens if I pay late?", a: "HMRC charges interest from the day after the deadline. Late balancing payments also get penalties: 5% at 30 days, then more at 6 and 12 months." },
    ],
    inApp: ["Saved plans with every payment dated", "Track what you’ve set aside", "Reminders before each payment"],
    related: ["self-employed-tax", "combined-income", "making-tax-digital"],
  },
  {
    slug: "vat",
    tool: "VAT",
    name: "VAT",
    h1: ["VAT", "calculator."],
    title: `VAT Calculator UK: Add or Remove 20% VAT, ${gbp(RULES.vat.registration)} Threshold`,
    description: `Add or remove UK VAT at 20%, 5% or 0%, and check your rolling 12-month turnover against the ${gbp(RULES.vat.registration)} VAT registration threshold.`,
    lede: "Add or take off VAT in a second, and see how close you are to having to register.",
    body: [
      {
        h: "Adding and removing VAT",
        p: [
          "To add 20% VAT, multiply by 1.2. To remove it from a price that includes VAT, divide by 1.2. Taking 20% off a VAT-inclusive price gives the wrong answer.",
          "The reduced rate of 5% applies to things like home energy and children’s car seats. Zero-rated goods, such as most food and children’s clothes, are still VAT-taxable at 0%.",
        ],
      },
      {
        h: "When you must register",
        p: [
          `You must register if your VAT-taxable turnover goes over ${gbp(RULES.vat.registration)} in any rolling 12 months, or if you expect it to in the next 30 days alone.`,
          `You can deregister if it falls below ${gbp(RULES.vat.deregistration)}. You can also register voluntarily below the threshold, which can make sense if your customers are VAT-registered businesses.`,
        ],
      },
    ],
    faq: [
      { q: "Is the VAT threshold based on the tax year?", a: "No. It’s any rolling 12-month period, so check at the end of every month." },
      { q: "Does zero-rated turnover count towards the threshold?", a: "Yes. Zero-rated sales are VAT-taxable. Exempt and out-of-scope sales don’t count." },
    ],
    inApp: ["Rolling VAT monitoring, month by month", "Reminders as you near the threshold", "Saved VAT workings"],
    related: ["making-tax-digital", "self-employed-tax", "business-expenses"],
  },
  {
    slug: "making-tax-digital",
    tool: "Making Tax Digital",
    name: "Making Tax Digital",
    h1: ["Making Tax Digital", "checker."],
    title: "Making Tax Digital for Income Tax Checker: When Do I Start?",
    description: `Find out when Making Tax Digital for Income Tax applies to you. Sole traders and landlords with qualifying income over £50,000 start in April 2026, over £30,000 in April 2027 and over £20,000 in April 2028.`,
    lede: "Sole trader or landlord? Check when you’ll need to keep digital records and send quarterly updates to HMRC.",
    body: [
      {
        h: "Who has to join, and when",
        ul: RULES.mtd.map((m) => `Qualifying income over ${gbp(m.over)} on your ${m.basedOn} return: from 6 April ${m.from}`),
        p: ["Qualifying income is your gross self-employment turnover plus gross property income, before expenses. Salary, pensions and dividends don’t count."],
      },
      {
        h: "What changes",
        ul: [
          "Keep your income and expenses in compatible software",
          "Send a short update to HMRC every quarter",
          "Submit your tax return through the software by 31 January",
          "Paying tax doesn’t change: the dates stay the same",
        ],
      },
    ],
    faq: [
      { q: "Is qualifying income my profit?", a: "No. It’s your turnover and gross rent before expenses, so you can be in scope even with a modest profit." },
      { q: "Do partnerships have to join?", a: "Not yet. Partnerships, and income from them, aren’t included in the current timetable." },
    ],
    inApp: ["Eligibility from your own answers", "Your start date on the home screen", "Reminders for quarterly updates"],
    related: ["vat", "self-employed-tax", "payments-on-account"],
  },
];

export const calculatorBySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);
export const calculatorForTool = (tool: string) => CALCULATORS.find((c) => c.tool === tool);
