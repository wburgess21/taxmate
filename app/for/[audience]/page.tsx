import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AUDIENCES, audienceBySlug } from "@/lib/audiences";
import { calculatorBySlug } from "@/lib/calculators";
import { AUDIENCE_LABEL, datesFrom, longDate } from "@/lib/keyDates";
import { faqSchema } from "@/lib/schema";
import { InnerPage, PageHeading, SectionHeading } from "@/components/site/InnerPage";
import { JsonLd } from "@/components/site/JsonLd";
import { Blocks } from "@/components/site/Blocks";
import { AppCta } from "@/components/site/AppCta";
import { CalcCard } from "@/components/site/CalcCard";
import { Faq } from "@/components/sections/Faq";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = { params: Promise<{ audience: string }> };

/** Rebuilt daily for the upcoming dates. */
export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => AUDIENCES.map((a) => ({ audience: a.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = audienceBySlug((await params).audience);
  if (!a) return {};
  return {
    title: { absolute: `${a.title} · TaxMate` },
    description: a.description,
    alternates: { canonical: `/for/${a.slug}` },
    openGraph: { title: a.title, description: a.description, url: `/for/${a.slug}`, type: "article" },
  };
}

export default async function AudiencePage({ params }: Props) {
  const a = audienceBySlug((await params).audience);
  if (!a) notFound();
  const dates = datesFrom(new Date(), 12).filter((d) => a.dates.includes(d.who)).slice(0, 4);
  const calcs = a.calculators.map((s) => calculatorBySlug(s)!);
  return (
    <InnerPage tint={a.tint} crumbs={[["Who it’s for", "/for"], [a.label, `/for/${a.slug}`]]}>
      <JsonLd data={faqSchema(a.faq)} />
      <PageHeading kicker={`TaxMate for ${a.label.toLowerCase()}`} h1={a.h1} lede={a.lede} />

      <ul className="mx-auto mt-12 grid max-w-[1240px] gap-3 px-5 sm:grid-cols-3 sm:px-8">
        {a.facts.map((f) => (
          <li key={f.label} className="surface-card p-6">
            <p className="text-4xl font-light tracking-tight tabular-nums" style={{ color: "var(--tint)" }}>{f.figure}</p>
            <p className="mt-2 text-[0.9375rem] text-muted">{f.label}</p>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-20 grid max-w-[1240px] grid-cols-[minmax(0,1fr)] gap-16 px-5 sm:px-8 lg:mt-28 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
        <article className="min-w-0"><Blocks blocks={a.body} /></article>
        <aside className="lg:sticky lg:top-28 lg:self-start" aria-labelledby="dates-heading">
          <h2 id="dates-heading" className="kicker">Your next dates</h2>
          <ul className="mt-5 grid gap-3">
            {dates.map((d) => (
              <li key={`${d.slug}-${d.at.getFullYear()}`} className="surface-card p-5">
                <p className="text-[0.8125rem] font-medium" style={{ color: "var(--tint)" }}>{longDate(d.at)} · {AUDIENCE_LABEL[d.who]}</p>
                <p className="mt-1.5 font-medium leading-snug">{d.title}</p>
              </li>
            ))}
          </ul>
          <Link href="/key-dates" className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent underline-offset-4 hover:underline">All key dates and calendar <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </aside>
      </div>

      <section className="mx-auto mt-24 max-w-[1240px] px-5 sm:px-8 lg:mt-32" aria-labelledby="calcs-heading">
        <div id="calcs-heading"><SectionHeading kicker="Free calculators">The tools <em>you’ll use.</em></SectionHeading></div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calcs.map((c) => <li key={c.slug}><CalcCard calc={c} /></li>)}
        </ul>
      </section>

      <section className="mx-auto mt-24 max-w-[1240px] px-5 sm:px-8 lg:mt-32" aria-labelledby="faq-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div id="faq-heading"><SectionHeading kicker="Questions">Good <em>to know.</em></SectionHeading></div>
          <Faq items={a.faq} />
        </div>
      </section>

      <AppCta title={["Made for", `${a.label.toLowerCase()}.`]} body="Tell TaxMate how you work and it brings forward the tools and dates that fit, with your figures kept on your iPhone." points={a.inApp} placement={`for-${a.slug}`} />
    </InnerPage>
  );
}
