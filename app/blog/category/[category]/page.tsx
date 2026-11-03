import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getPostsInCategory } from "@/lib/sanity";
import { InnerPage, PageHeading } from "@/components/site/InnerPage";
import { AppCta } from "@/components/site/AppCta";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryNav } from "@/components/blog/CategoryNav";

type Props = { params: Promise<{ category: string }> };

export const revalidate = 3600;
export const generateStaticParams = async () => (await getCategories()).map((c) => ({ category: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).category);
  if (!c) return {};
  const description = c.description ?? `TaxMate guides on ${c.title.toLowerCase()}.`;
  return { title: `${c.title} guides`, description, alternates: { canonical: `/blog/category/${c.slug}` }, openGraph: { title: `${c.title} guides · TaxMate`, description } };
}

export default async function CategoryPage({ params }: Props) {
  const slug = (await params).category;
  const [c, posts, categories] = await Promise.all([getCategory(slug), getPostsInCategory(slug), getCategories()]);
  if (!c || !posts.length) notFound();
  return (
    <InnerPage crumbs={[["Blog", "/blog"], [c.title, `/blog/category/${c.slug}`]]}>
      <PageHeading kicker="The TaxMate blog" h1={[c.title, "guides."]} lede={c.description ?? `Everything we’ve written on ${c.title.toLowerCase()}.`} />
      <CategoryNav categories={categories} current={c.slug} />
      <ul className="mx-auto mt-10 grid max-w-[1240px] gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:mt-14 lg:grid-cols-3">
        {posts.map((p, i) => <li key={p.slug}><PostCard post={p} priority={i < 3} /></li>)}
      </ul>
      <AppCta title={["Your own figures,", "worked out."]} body="TaxMate applies everything in these guides to you, and keeps it on your iPhone." placement={`blog-category-${c.slug}`} />
    </InnerPage>
  );
}
