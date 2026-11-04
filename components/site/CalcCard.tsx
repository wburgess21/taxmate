import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CalculatorPage } from "@/lib/calculators";
import { TOOLS } from "@/lib/tools";
import { ToolIcon } from "./ToolIcon";

/** A linked card for a calculator, in its tool group's tint. */
export function CalcCard({ calc, compact = false }: { calc: CalculatorPage; compact?: boolean }) {
  const tool = TOOLS.find((t) => t.title === calc.tool)!;
  if (compact) {
    return (
      <Link href={`/calculators/${calc.slug}`} className="surface-card link-card !flex-row items-center !gap-4 !p-4" style={{ ["--tint" as string]: tool.group.tint }}>
        <ToolIcon icon={tool.icon} />
        <span className="min-w-0 flex-1 font-medium">{calc.name}</span>
        <ArrowRight className="link-card-arrow h-4 w-4 flex-none" style={{ color: "var(--tint)" }} aria-hidden />
      </Link>
    );
  }
  return (
    <Link href={`/calculators/${calc.slug}`} className="surface-card link-card h-full" style={{ ["--tint" as string]: tool.group.tint }}>
      <ToolIcon icon={tool.icon} />
      <span className="mt-2 block text-xl font-light tracking-tight">{calc.name}</span>
      <span className="block text-[0.9375rem] leading-relaxed text-muted">{calc.lede}</span>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.875rem] font-medium" style={{ color: "var(--tint)" }}>
        Open calculator <ArrowRight className="link-card-arrow h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}
