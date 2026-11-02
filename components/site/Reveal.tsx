"use client";

import { useEffect } from "react";

/** Fades `[data-reveal]` blocks in as they scroll into view. Without JavaScript everything is simply shown. */
export function RevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-shown", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => {
      // Anything already on screen shows at once rather than fading in after the first paint.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.setAttribute("data-shown", "");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
