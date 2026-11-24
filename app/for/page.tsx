import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUDIENCES } from "@/lib/audiences";
import { InnerPage, PageHeading } from "@/components/site/InnerPage";
import { AppCta } from "@/components/site/AppCta";

const description = "UK tax guides for employees, sole traders and freelancers, side hustlers, landlords and company directors: what you pay, what you can claim and the dates that apply to you.";

export const metadata: Metadata = {
  title: "Who TaxMate is for",
  description,
  alternates: { canonical: "/for" },
};

export default function For() {
  return (
    <InnerPage crumbs={[["Who it’s for", "/for"]]}>
      <PageHeading kicker="Guides by how you work" h1={["Your tax,", "your situation."]} lede="Tax works differently depending on how you earn. Pick yours for the rules, calculators and dates that apply." />
      <ul className="mx-auto mt-14 grid max-w-[1240px] gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {AUDIENCES.map((a) => (
          <li key={a.slug}>
            <Link href={`/for/${a.slug}`} className="surface-card link-card h-full" style={{ ["--tint" as string]: a.tint }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--tint)" }} aria-hidden />
              <span className="mt-2 block text-2xl font-light tracking-tight">{a.label}</span>
              <span className="block text-[0.9375rem] leading-relaxed text-muted">{a.lede}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.875rem] font-medium" style={{ color: "var(--tint)" }}>Read the guide <ArrowRight className="link-card-arrow h-4 w-4" aria-hidden /></span>
            </Link>
          </li>
        ))}
      </ul>
      <AppCta title={["One app,", "fitted to you."]} body="A few quick questions and TaxMate shows the tools and key dates for the way you work." placement="for-index" />
    </InnerPage>
  );
}
