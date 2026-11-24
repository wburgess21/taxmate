import Link from "next/link";
import { ArrowRight, CalendarDays, Calculator, Percent } from "lucide-react";

/** Shown while there are no posts yet (or Sanity isn't connected): points to the pages that do exist. */
export function BlogEmpty() {
  const links = [
    { href: "/calculators", title: "Free calculators", body: "Take-home pay, self-employed tax, VAT and more.", icon: Calculator, tint: "var(--tool-income)" },
    { href: "/tax-rates", title: "Tax rates for this year", body: "Every rate and threshold on one page.", icon: Percent, tint: "var(--tool-claims)" },
    { href: "/key-dates", title: "Key dates", body: "Every HMRC deadline, in your calendar.", icon: CalendarDays, tint: "var(--tool-planning)" },
  ];
  return (
    <div>
      <p className="text-xl font-light tracking-tight sm:text-2xl">The first guides are on their way.</p>
      <p className="mt-2 text-muted">In the meantime, these are a good place to start.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="surface-card link-card h-full !flex-row items-center !gap-4 !p-4 sm:!flex-col sm:items-start sm:!p-6" style={{ ["--tint" as string]: l.tint }}>
              <span className="tool-badge"><l.icon className="h-5 w-5" aria-hidden /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{l.title}</span>
                <span className="mt-0.5 block text-[0.875rem] leading-relaxed text-muted sm:mt-1 sm:text-[0.9375rem]">{l.body}</span>
              </span>
              <ArrowRight className="link-card-arrow h-4 w-4 flex-none sm:mt-auto" style={{ color: "var(--tint)" }} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
