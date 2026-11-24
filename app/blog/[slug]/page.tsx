import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate, getPost, getPostIndex, getRelatedPosts, imageUrl } from "@/lib/sanity";
import { calculatorBySlug } from "@/lib/calculators";
import { faqSchema, ORG_ID, WEBSITE_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { InnerPage } from "@/components/site/InnerPage";
import { JsonLd } from "@/components/site/JsonLd";
import { AppCta } from "@/components/site/AppCta";
import { CalcCard } from "@/components/site/CalcCard";
import { Faq } from "@/components/sections/Faq";
import { PostBody, headings } from "@/components/blog/PostBody";
import { PostCard } from "@/components/blog/PostCard";
import { SanityImg } from "@/components/blog/SanityImg";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const generateStaticParams = async () => (await getPostIndex()).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  const title = p.seoTitle || p.title, description = p.seoDescription || p.excerpt;
  const image = imageUrl(p.mainImage, 1200, 630);
  return {
    title,
    description,
    alternates: { canonical: `/blog/${p.slug}` },
    robots: p.noindex ? { index: false, follow: true } : undefined,
    openGraph: { type: "article", title, description, url: `/blog/${p.slug}`, publishedTime: p.publishedAt, modifiedTime: p.updatedAt ?? p.publishedAt, ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: p.mainImage?.alt }] } : {}) },
    twitter: { title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function PostPage({ params }: Props) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const related = await getRelatedPosts(p.slug, p.category?.slug);
  const toc = headings(p.body);
  const calcs = (p.calculators ?? []).map((s) => calculatorBySlug(s)).filter((c) => !!c);
  const url = `${SITE_URL}/blog/${p.slug}`;
  const crumbs: [string, string][] = [["Blog", "/blog"], ...(p.category ? [[p.category.title, `/blog/category/${p.category.slug}`] as [string, string]] : []), [p.title, `/blog/${p.slug}`]];

  return (
    <InnerPage crumbs={crumbs}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: p.title,
        description: p.excerpt,
        url,
        mainEntityOfPage: url,
        datePublished: p.publishedAt,
        dateModified: p.updatedAt ?? p.publishedAt,
        inLanguage: "en-GB",
        ...(p.mainImage?.asset ? { image: imageUrl(p.mainImage, 1200, 630) } : {}),
        ...(p.category ? { articleSection: p.category.title } : {}),
        author: p.author ? { "@type": "Person", name: p.author.name, ...(p.author.role ? { jobTitle: p.author.role } : {}) } : { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": WEBSITE_ID },
      }} />
      {p.faq?.length ? <JsonLd data={faqSchema(p.faq.map((f) => ({ q: f.question, a: f.answer })))} /> : null}

      <article>
        <header className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8 sm:pt-10"><div className="max-w-[820px]">
          <p className="kicker flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {p.category && <span style={{ color: "var(--tint)" }}>{p.category.title}</span>}
            {p.taxYear && <span>· {p.taxYear}</span>}
          </p>
          <h1 className="display mt-5 text-[2.5rem] sm:text-6xl">{p.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{p.excerpt}</p>
          <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-[0.875rem] text-muted">
            {p.author && <span className="font-medium text-ink">{p.author.name}</span>}
            <span>
              <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
              {p.updatedAt && p.updatedAt.slice(0, 10) !== p.publishedAt.slice(0, 10) && <> · Updated <time dateTime={p.updatedAt}>{formatDate(p.updatedAt)}</time></>}
            </span>
            <span>· {Math.max(1, p.readingMinutes ?? 1)} min read</span>
          </p>
        </div></header>

        {p.mainImage?.asset && (
          <div className="mx-auto mt-10 max-w-[1240px] px-3 sm:mt-14 sm:px-8">
            <SanityImg image={p.mainImage} width={1240} ratio={16 / 9} sizes="(min-width: 1240px) 1176px, 100vw" className="aspect-[16/9] w-full rounded-[28px] object-cover" priority />
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-[1240px] grid-cols-[minmax(0,1fr)] gap-12 px-5 sm:px-8 lg:mt-16 lg:grid-cols-[minmax(0,680px)_1fr] lg:gap-20">
          <div className="min-w-0">
            <PostBody body={p.body} />
            {p.faq?.length ? (
              <section className="mt-16" aria-labelledby="post-faq">
                <h2 id="post-faq" className="text-[1.75rem] font-light tracking-tight">Questions</h2>
                <div className="mt-6"><Faq items={p.faq.map((f) => ({ q: f.question, a: f.answer }))} /></div>
              </section>
            ) : null}
            {p.author?.bio && (
              <div className="mt-16 border-t border-hairline pt-8">
                <p className="font-medium">{p.author.name}{p.author.role && <span className="font-normal text-muted"> · {p.author.role}</span>}</p>
                <p className="mt-2 leading-relaxed text-muted">{p.author.bio}</p>
              </div>
            )}
            <p className="mt-10 text-[0.8125rem] leading-relaxed text-muted">General guidance based on published HMRC rules, not personal tax advice. Check anything important with HMRC or an accountant.</p>
          </div>
          <aside className="grid content-start gap-10 lg:sticky lg:top-28 lg:self-start">
            {toc.length > 2 && (
              <nav aria-label="In this guide" className="max-lg:hidden">
                <h2 className="kicker">In this guide</h2>
                <ol className="mt-4 grid gap-2.5 text-[0.9375rem]">
                  {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-muted transition-colors hover:text-ink">{h.text}</a></li>)}
                </ol>
              </nav>
            )}
            {calcs.length > 0 && (
              <div>
                <h2 className="kicker">Work it out</h2>
                <ul className="mt-4 grid gap-3">{calcs.map((c) => <li key={c.slug}><CalcCard calc={c} compact /></li>)}</ul>
              </div>
            )}
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1240px] px-5 sm:px-8" aria-labelledby="more-heading">
          <h2 id="more-heading" className="kicker">Keep reading</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <li key={r.slug}><PostCard post={r} /></li>)}</ul>
        </section>
      )}

      <AppCta title={["Your own figures,", "worked out."]} body="TaxMate applies this to you: answer a few questions and see your own numbers, kept on your iPhone." placement={`blog-${p.slug}`.slice(0, 40)} />
    </InnerPage>
  );
}
