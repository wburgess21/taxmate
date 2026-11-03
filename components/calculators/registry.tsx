import type { ComponentType } from "react";
import { TakeHomePayCalculator } from "./TakeHomePay";
import { SelfEmployedCalculator } from "./SelfEmployed";
import { CombinedIncomeCalculator } from "./Combined";
import { HomeOfficeCalculator } from "./HomeOffice";
import { ExpensesCalculator } from "./Expenses";
import { MileageCalculator } from "./Mileage";
import { PensionCalculator } from "./Pension";
import { TaxSavingsCalculator } from "./TaxSavings";
import { VatCalculator } from "./Vat";
import { MtdCalculator } from "./Mtd";

/** The interactive calculator for each page in lib/calculators.ts. */
export const CALCULATOR_COMPONENTS: Record<string, ComponentType> = {
  "take-home-pay": TakeHomePayCalculator,
  "self-employed-tax": SelfEmployedCalculator,
  "combined-income": CombinedIncomeCalculator,
  "home-office": HomeOfficeCalculator,
  "business-expenses": ExpensesCalculator,
  "business-mileage": MileageCalculator,
  "pension-contribution": PensionCalculator,
  "payments-on-account": TaxSavingsCalculator,
  vat: VatCalculator,
  "making-tax-digital": MtdCalculator,
};
