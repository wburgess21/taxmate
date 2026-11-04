import { imageUrl, type SanityImage } from "@/lib/sanity";

/** A Sanity image at the right size for the screen, from Sanity's CDN (cropped to the hotspot, WebP/AVIF when supported). */
export function SanityImg({ image, width, ratio, sizes, className = "", priority = false }: { image?: SanityImage; width: number; ratio?: number; sizes: string; className?: string; priority?: boolean }) {
  if (!image?.asset) return null;
  const h = (w: number) => (ratio ? Math.round(w / ratio) : undefined);
  const widths = [Math.round(width / 2), width, width * 2].filter((w, i, a) => a.indexOf(w) === i);
  const src = imageUrl(image, width, h(width));
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Sanity's CDN does the resizing.
    <img
      src={src}
      srcSet={widths.map((w) => `${imageUrl(image, w, h(w))} ${w}w`).join(", ")}
      sizes={sizes}
      alt={image.alt ?? ""}
      width={width}
      height={h(width)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
