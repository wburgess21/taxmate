import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { Lightbulb, TriangleAlert, Calculator } from "lucide-react";
import { calculatorBySlug } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";
import type { SanityImage } from "@/lib/sanity";
import { CalcCard } from "@/components/site/CalcCard";
import { SanityImg } from "./SanityImg";

/** Plain text of a block, for heading ids and the table of contents. */
export const blockText = (b: PortableTextBlock) =>
  ((b.children as { text?: string }[] | undefined) ?? []).map((c) => c.text ?? "").join("");

export const slugify = (s: string) => s.toLowerCase().replace(/[’'"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/** The post's h2s, for the table of contents. */
export const headings = (body: PortableTextBlock[]) =>
  body.filter((b) => b._type === "block" && b.style === "h2").map((b) => ({ text: blockText(b), id: slugify(blockText(b)) }));

const TONES = {
  tip: { icon: Lightbulb, tint: "var(--tool-income)" },
  warning: { icon: TriangleAlert, tint: "var(--tool-claims)" },
  example: { icon: Calculator, tint: "var(--tool-planning)" },
} as const;

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => <h2 id={slugify(blockText(value))} className="scroll-mt-28">{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const internal = href.startsWith("/") || href.startsWith(SITE_URL);
      return internal
        ? <Link href={href.replace(SITE_URL, "") || "/"}>{children}</Link>
        : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
  },
  types: {
    image: ({ value }: { value: SanityImage }) => (
      <figure className="my-10">
        <SanityImg image={value} width={1360} sizes="(min-width: 1024px) 680px, 100vw" className="w-full" />
        {value.caption && <figcaption className="mt-3 text-[0.875rem] text-muted">{value.caption}</figcaption>}
      </figure>
    ),
    callout: ({ value }: { value: { tone?: keyof typeof TONES; title?: string; body: string } }) => {
      const t = TONES[value.tone ?? "tip"] ?? TONES.tip;
      return (
        <aside className="my-8 flex gap-4 rounded-[18px] p-5 sm:p-6" style={{ background: `color-mix(in srgb, ${t.tint} 9%, var(--surface))`, border: `1px solid color-mix(in srgb, ${t.tint} 22%, transparent)` }}>
          <t.icon className="mt-0.5 h-5 w-5 flex-none" style={{ color: t.tint }} aria-hidden />
          <div>
            {value.title && <p className="font-medium text-ink">{value.title}</p>}
            <p className={`${value.title ? "mt-1" : ""} text-[1rem] leading-relaxed`}>{value.body}</p>
          </div>
        </aside>
      );
    },
    calculatorLink: ({ value }: { value: { calculator: string } }) => {
      const c = calculatorBySlug(value.calculator);
      return c ? <div className="my-8 max-w-md"><CalcCard calc={c} compact /></div> : null;
    },
  },
};

export function PostBody({ body }: { body: PortableTextBlock[] }) {
  return <div className="prose-tm"><PortableText value={body} components={components} /></div>;
}
