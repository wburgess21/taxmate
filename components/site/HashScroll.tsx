"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * After a client-side navigation to a link with a #hash (such as /#plus from another page), the browser scrolls
 * before the page has finished laying out: the home page's story sets its height once it mounts. Re-align to the
 * target as the layout settles, and stop as soon as the visitor scrolls themselves.
 */
export function HashScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    let stopped = false;
    const stop = () => { stopped = true; };
    const align = () => {
      if (stopped) return;
      const el = document.getElementById(id);
      if (!el) return;
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      const top = el.getBoundingClientRect().top + scrollY - margin;
      if (Math.abs(scrollY - top) > 2) scrollTo({ top, behavior: "instant" });
    };
    const opts = { passive: true, once: true } as const;
    addEventListener("wheel", stop, opts);
    addEventListener("touchstart", stop, opts);
    addEventListener("keydown", stop, opts);
    const timers = [50, 250, 700, 1400].map((ms) => setTimeout(align, ms));
    return () => {
      timers.forEach(clearTimeout);
      removeEventListener("wheel", stop);
      removeEventListener("touchstart", stop);
      removeEventListener("keydown", stop);
    };
  }, [pathname]);
  return null;
}
