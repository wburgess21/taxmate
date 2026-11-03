export type Tool = { title: string; benefit: string; icon: string };
export type Group = { id: string; title: string; summary: string; tint: string; tools: Tool[] };

/** The app's tool groups and their tints (CalculatorCatalogView.swift). */
export const GROUPS: Group[] = [
  {
    id: "income", title: "Your income", summary: "See what you take home and what you owe.", tint: "var(--tool-income)",
    tools: [
      { title: "Take Home Pay", benefit: "Understand your pay after deductions", icon: "banknote" },
      { title: "Self-employed Tax", benefit: "Understand your annual business tax", icon: "briefcase" },
      { title: "Combined Income", benefit: "Plan supported employment and business income", icon: "layers" },
    ],
  },
  {
    id: "claims", title: "Claim and reduce", summary: "Lower your bill with allowable costs and relief.", tint: "var(--tool-claims)",
    tools: [
      { title: "Home Office", benefit: "Estimate your home office tax relief", icon: "house" },
      { title: "Business Expenses", benefit: "Compare costs and allowances", icon: "credit-card" },
      { title: "Business Mileage", benefit: "Estimate deductions and keep journey logs", icon: "car" },
      { title: "Pension Contribution", benefit: "Compare cash and pension tax relief", icon: "piggy-bank" },
    ],
  },
  {
    id: "planning", title: "Plan ahead", summary: "Stay ahead of payments, thresholds and dates.", tint: "var(--tool-planning)",
    tools: [
      { title: "Tax Savings Planner", benefit: "Set money aside for dated tax payments", icon: "calendar" },
      { title: "VAT", benefit: "Add or remove VAT and monitor turnover", icon: "percent" },
      { title: "Making Tax Digital", benefit: "Check eligibility and start dates", icon: "file-clock" },
      { title: "Annual Summary", benefit: "Share planning records as PDF or CSV", icon: "file-text" },
    ],
  },
];

export const TOOLS = GROUPS.flatMap((g) => g.tools.map((t) => ({ ...t, group: g })));
