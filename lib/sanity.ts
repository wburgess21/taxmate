import { createClient, type QueryParams } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

/**
 * The blog's content lives in Sanity (the Studio is in /studio). Until a project is set up the blog simply shows as
 * empty, so the site builds and runs without it.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityConfigured = !!projectId && /^[a-z0-9-]+$/.test(projectId);

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion: "2025-10-01", useCdn: true, perspective: "published" })
  : null;

/** Everything from Sanity is tagged, so the publish webhook (/api/revalidate) refreshes it at once. */
export const SANITY_TAG = "sanity";

async function query<T>(groq: string, params: QueryParams = {}, fallback: T): Promise<T> {
  if (!client) return fallback;
  try {
    return (await client.fetch<T>(groq, params, { next: { revalidate: 3600, tags: [SANITY_TAG] } })) ?? fallback;
  } catch (e) {
    console.error("Sanity query failed", e);
    return fallback;
  }
}

const builder = client ? createImageUrlBuilder(client) : null;
export type SanityImage = { asset?: { _ref: string }; alt?: string; caption?: string; hotspot?: unknown; crop?: unknown };
export const imageUrl = (img: SanityImage | undefined, w: number, h?: number) => {
  if (!builder || !img?.asset) return null;
  let b = builder.image(img).width(w).fit("crop").auto("format").quality(80);
  if (h) b = b.height(h);
  return b.url();
};

export type Category = { title: string; slug: string; description?: string };
export type Author = { name: string; slug: string; role?: string; bio?: string; image?: SanityImage };

export type PostCard = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  mainImage?: SanityImage;
  category?: Category;
  readingMinutes?: number;
};

export type Post = PostCard & {
  body: PortableTextBlock[];
  author?: Author;
  taxYear?: string;
  faq?: { question: string; answer: string }[];
  calculators?: string[];
  seoTitle?: string;
  seoDescription?: string;
  noindex?: boolean;
};

const CARD = `title, "slug": slug.current, excerpt, publishedAt, updatedAt, mainImage,
  "category": category->{title, "slug": slug.current, description},
  "readingMinutes": round(length(pt::text(body)) / 5 / 220)`;

const PUBLISHED = `_type == "post" && defined(slug.current) && publishedAt <= now()`;

export const getPosts = (limit = 100) =>
  query<PostCard[]>(`*[${PUBLISHED}] | order(publishedAt desc)[0...$limit]{${CARD}}`, { limit }, []);

export const getPostsInCategory = (category: string) =>
  query<PostCard[]>(`*[${PUBLISHED} && category->slug.current == $category] | order(publishedAt desc){${CARD}}`, { category }, []);

export const getPost = (slug: string) =>
  query<Post | null>(
    `*[${PUBLISHED} && slug.current == $slug][0]{${CARD}, body, taxYear, faq, calculators, seoTitle, seoDescription, noindex,
      "author": author->{name, "slug": slug.current, role, bio, image}}`,
    { slug },
    null,
  );

export const getRelatedPosts = (slug: string, category?: string) =>
  query<PostCard[]>(
    `*[${PUBLISHED} && slug.current != $slug] | order((category->slug.current == $category) desc, publishedAt desc)[0...3]{${CARD}}`,
    { slug, category: category ?? "" },
    [],
  );

export const getCategories = () =>
  query<Category[]>(`*[_type == "category" && count(*[${PUBLISHED} && references(^._id)]) > 0] | order(title asc){title, "slug": slug.current, description}`, {}, []);

export const getCategory = (slug: string) =>
  query<Category | null>(`*[_type == "category" && slug.current == $slug][0]{title, "slug": slug.current, description}`, { slug }, null);

/** Slugs and dates for the sitemap, feed and static generation. */
export const getPostIndex = () =>
  query<{ slug: string; title: string; excerpt: string; publishedAt: string; updatedAt?: string; noindex?: boolean }[]>(
    `*[${PUBLISHED}] | order(publishedAt desc){"slug": slug.current, title, excerpt, publishedAt, updatedAt, noindex}`,
    {},
    [],
  );

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
