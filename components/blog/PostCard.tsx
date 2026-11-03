import Link from "next/link";
import { formatDate, type PostCard as Card } from "@/lib/sanity";
import { SanityImg } from "./SanityImg";
import { CoinMark } from "@/components/site/CoinMark";

export function PostCard({ post, priority = false }: { post: Card; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="surface-card link-card h-full overflow-hidden !p-0">
      {post.mainImage?.asset ? (
        <SanityImg image={post.mainImage} width={720} ratio={16 / 10} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10] w-full object-cover" priority={priority} />
      ) : (
        <div className="green flex aspect-[16/10] w-full items-center justify-center" aria-hidden>
          <CoinMark className="h-16 w-16 text-gold opacity-90" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <p className="text-[0.8125rem] text-muted">
          {post.category && <span className="font-medium" style={{ color: "var(--tint)" }}>{post.category.title} · </span>}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <h3 className="text-xl font-light leading-snug tracking-tight">{post.title}</h3>
        <p className="text-[0.9375rem] leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
