"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fades `[data-reveal]` blocks in as they scroll into view. Without JavaScript everything is simply shown.
 *
 * The layout stays mounted across client-side navigation, so it watches the DOM for blocks that arrive later (a new
 * page, or streamed content) rather than scanning once: otherwise they would stay hidden until a full reload.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (el: Element) => el.setAttribute("data-shown", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          show(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")) {
        if (seen.has(el)) continue;
        seen.add(el);
        // Anything already on screen shows at once rather than fading in after the first paint.
        const r = el.getBoundingClientRect();
        if (reduce || (r.top < window.innerHeight && r.bottom > 0)) show(el);
        else io.observe(el);
      }
    };
    scan();
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => { queued = 0; scan(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(queued); };
  }, [pathname]);

  return null;
}
