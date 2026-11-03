import type { Metadata } from "next";
import { CALCULATORS, calculatorForTool } from "@/lib/calculators";
import { calculatorListSchema } from "@/lib/calcSchema";
import { GROUPS } from "@/lib/tools";
import { TAX_YEAR } from "@/lib/site";
import { InnerPage, PageHeading } from "@/components/site/InnerPage";
import { JsonLd } from "@/components/site/JsonLd";
import { AppCta } from "@/components/site/AppCta";
import { CalcCard } from "@/components/site/CalcCard";

const description = `Free UK tax calculators for ${TAX_YEAR}: take-home pay, self-employed tax, side income, working from home, expenses, mileage, pension relief, payments on account, VAT and Making Tax Digital.`;

export const metadata: Metadata = {
  title: `Free UK Tax Calculators ${TAX_YEAR}`,
  description,
  alternates: { canonical: "/calculators" },
  openGraph: { title: `Free UK Tax Calculators ${TAX_YEAR} · TaxMate`, description, url: "/calculators" },
};

export default function Calculators() {
  return (
    <InnerPage crumbs={[["Calculators", "/calculators"]]}>
      <JsonLd data={calculatorListSchema()} />
      <PageHeading kicker={`${CALCULATORS.length} free calculators · ${TAX_YEAR}`} h1={["UK tax,", "worked out."]} lede="Quick, private estimates from the same rules as the TaxMate app. Nothing to sign up for, and nothing you type leaves your browser." />
      <div className="mx-auto mt-16 grid max-w-[1240px] gap-16 px-5 sm:px-8 lg:mt-24 lg:gap-24">
        {GROUPS.map((g) => {
          const calcs = g.tools.map((t) => calculatorForTool(t.title)).filter((c) => !!c);
          return (
            <section key={g.id} aria-labelledby={`group-${g.id}`} style={{ ["--tint" as string]: g.tint }} data-reveal>
              <div className="flex items-baseline gap-3">
                <span className="h-2.5 w-2.5 translate-y-[-2px] rounded-full" style={{ background: g.tint }} aria-hidden />
                <h2 id={`group-${g.id}`} className="text-3xl font-light tracking-tight sm:text-4xl">{g.title}</h2>
              </div>
              <p className="mt-3 text-muted">{g.summary}</p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {calcs.map((c) => <li key={c.slug}><CalcCard calc={c} /></li>)}
              </ul>
            </section>
          );
        })}
      </div>
      <AppCta
        title={["Eleven tools.", "One app."]}
        body="TaxMate asks a few questions, brings forward the tools that fit you and keeps every result on your iPhone or iPad, with reminders before each HMRC date."
        placement="calculators-index"
      />
    </InnerPage>
  );
}
