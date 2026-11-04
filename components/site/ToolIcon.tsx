import { Banknote, Briefcase, Calendar, Car, CreditCard, FileClock, FileText, House, Layers, Percent, PiggyBank, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  banknote: Banknote, briefcase: Briefcase, layers: Layers, house: House, "credit-card": CreditCard, car: Car,
  "piggy-bank": PiggyBank, calendar: Calendar, percent: Percent, "file-clock": FileClock, "file-text": FileText,
};

/** A tool's icon (the same names the coin faces use) in a tinted badge. */
export function ToolIcon({ icon, className = "" }: { icon: string; className?: string }) {
  const Icon = ICONS[icon] ?? FileText;
  return <span className={`tool-badge ${className}`}><Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden /></span>;
}
