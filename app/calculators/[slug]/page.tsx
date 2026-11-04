import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CALCULATORS, calculatorBySlug } from "@/lib/calculators";
import { calculatorSchema } from "@/lib/calcSchema";
import { faqSchema } from "@/lib/schema";
import { TOOLS } from "@/lib/tools";
import { TAX_YEAR } from "@/lib/site";
import { CALCULATOR_COMPONENTS } from "@/components/calculators/registry";
import { CalcProvider } from "@/components/calculators/shared";
import { Examples, hasExamples } from "@/components/calculators/Examples";
import { InnerPage, PageHeading, SectionHeading } from "@/components/site/InnerPage";
import { JsonLd } from "@/components/site/JsonLd";
import { Blocks } from "@/components/site/Blocks";
import { AppCta } from "@/components/site/AppCta";
import { CalcCard } from "@/components/site/CalcCard";
import { Faq } from "@/components/sections/Faq";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CALCULATORS.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = calculatorBySlug((await params).slug);
  if (!c) return {};
  return {
    title: { absolute: `${c.title} · TaxMate` },
    description: c.description,
    alternates: { canonical: `/calculators/${c.slug}` },
    openGraph: { title: c.title, description: c.description, url: `/calculators/${c.slug}`, type: "website" },
    twitter: { title: c.title, description: c.description },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const c = calculatorBySlug((await params).slug);
  if (!c) notFound();
  const tool = TOOLS.find((t) => t.title === c.tool)!;
  const Calculator = CALCULATOR_COMPONENTS[c.slug];
  const related = c.related.map((s) => calculatorBySlug(s)!).filter(Boolean);
  return (
    <InnerPage tint={tool.group.tint} crumbs={[["Calculators", "/calculators"], [c.name, `/calculators/${c.slug}`]]}>
      <JsonLd data={calculatorSchema(c)} />
      <JsonLd data={faqSchema(c.faq)} />
      <PageHeading kicker={`${tool.group.title} · Free calculator`} h1={c.h1} lede={c.lede} />

      <section aria-label="Calculator" className="mx-auto mt-10 max-w-[1240px] px-3 sm:mt-14 sm:px-8">
        <CalcProvider placement={`calc-${c.slug}`} tool={c.tool}><Calculator /></CalcProvider>
        <p className="mt-4 px-2 text-[0.8125rem] leading-relaxed text-muted sm:px-0">
          Uses {TAX_YEAR} HMRC rates and thresholds. An estimate for planning, not tax advice. Nothing you enter leaves your browser.
        </p>
      </section>

      <div className="mx-auto mt-20 grid max-w-[1240px] grid-cols-[minmax(0,1fr)] gap-16 px-5 sm:px-8 lg:mt-28 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
        <article className="min-w-0">
          <Blocks blocks={c.body} />
          {hasExamples(c.slug) && <div className="mt-14"><Examples slug={c.slug} /></div>}
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start" aria-labelledby="related-heading">
          <h2 id="related-heading" className="kicker">Related calculators</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {related.map((r) => <li key={r.slug}><CalcCard calc={r} compact /></li>)}
          </ul>
        </aside>
      </div>

      <section className="mx-auto mt-24 max-w-[1240px] px-5 sm:px-8 lg:mt-32" aria-labelledby="faq-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div id="faq-heading"><SectionHeading kicker="Questions">Good <em>to know.</em></SectionHeading></div>
          <Faq items={c.faq} />
        </div>
      </section>

      <AppCta
        title={["The full", `${c.tool} tool.`]}
        body={`The ${c.tool} tool in TaxMate goes further, fills in from your other answers and keeps your results on your iPhone.`}
        points={c.inApp}
        placement={`calc-${c.slug}`}
      />
    </InnerPage>
  );
}
