import type { Metadata } from "next";
import { getCategories, getPosts } from "@/lib/sanity";
import { InnerPage, PageHeading } from "@/components/site/InnerPage";
import { AppCta } from "@/components/site/AppCta";
import { PostCard } from "@/components/blog/PostCard";
import { BlogEmpty } from "@/components/blog/BlogEmpty";
import { CategoryNav } from "@/components/blog/CategoryNav";

export const revalidate = 3600;

const description = "Plain-English guides to UK tax: take-home pay, self-employment, side hustles, pensions, VAT, Making Tax Digital and the dates that matter.";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts(1);
  return {
    title: "Guides to UK tax",
    description,
    alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: { title: "Guides to UK tax · TaxMate", description, url: "/blog" },
    // An empty blog is thin content; keep it out of search until there's something to read.
    robots: posts.length ? undefined : { index: false, follow: true },
  };
}

export default async function Blog() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  return (
    <InnerPage crumbs={[["Blog", "/blog"]]}>
      <PageHeading kicker="The TaxMate blog" h1={["UK tax,", "in plain English."]} lede="Guides to what you pay, what you can claim and what’s changing, with the figures worked through." />
      <CategoryNav categories={categories} />
      <div className="mx-auto mt-10 max-w-[1240px] px-5 sm:px-8 lg:mt-14">
        {posts.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => <li key={p.slug}><PostCard post={p} priority={i < 3} /></li>)}
          </ul>
        ) : <BlogEmpty />}
      </div>
      <AppCta title={["Your own figures,", "worked out."]} body="TaxMate applies everything in these guides to you: what you’ll take home, what you’ll owe and when it’s due." placement="blog-index" />
    </InnerPage>
  );
}
