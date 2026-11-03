import Link from "next/link";
import type { Category } from "@/lib/sanity";

export function CategoryNav({ categories, current }: { categories: Category[]; current?: string }) {
  if (!categories.length) return null;
  return (
    <nav aria-label="Categories" className="mx-auto mt-10 max-w-[1240px] px-5 sm:px-8">
      <ul className="flex flex-wrap gap-2">
        <li><Link href="/blog" className="check" aria-current={!current ? "page" : undefined} data-active={!current || undefined}>All</Link></li>
        {categories.map((c) => (
          <li key={c.slug}><Link href={`/blog/category/${c.slug}`} className="check" aria-current={current === c.slug ? "page" : undefined} data-active={current === c.slug || undefined}>{c.title}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
