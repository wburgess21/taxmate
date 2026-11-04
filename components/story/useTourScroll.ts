import { useEffect } from "react";
import { easeInOutCubic, prefersReducedMotion } from "@/lib/coins/engine";

/**
 * Links to the tour (#tour: the hero's "Take the tour", and "The tour" in the footer and menu) scroll there the way a
 * person would, slowly and eased, so the hero's morph into the phone plays through. The browser's own smooth scroll
 * covers those screens in a fraction of a second and the story looks like it skips.
 *
 * Any wheel, touch, key or pointer press hands control straight back. With reduced motion it jumps, as before.
 */
export function useTourScroll(anchorId = "tour") {
  useEffect(() => {
    let raf = 0, cancel: (() => void) | null = null;

    const run = (top: number) => {
      cancel?.();
      const from = scrollY, distance = top - from;
      if (Math.abs(distance) < 2) return;
      // About a second per screen of story, within limits, so the morph reads at a natural scrolling pace.
      const screens = Math.abs(distance) / innerHeight;
      const duration = Math.min(3200, Math.max(1100, 650 + screens * 850));
      const html = document.documentElement, prev = html.style.scrollBehavior;
      // Each frame sets the position directly; the page's CSS smooth scroll would fight it.
      html.style.scrollBehavior = "auto";
      const start = performance.now();
      const stop = () => {
        cancelAnimationFrame(raf);
        html.style.scrollBehavior = prev;
        for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) removeEventListener(t, stop);
        cancel = null;
      };
      cancel = stop;
      for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) addEventListener(t, stop, { passive: true });
      const step = (now: number) => {
        const u = Math.min(1, (now - start) / duration);
        scrollTo(0, from + distance * easeInOutCubic(u));
        if (u < 1) raf = requestAnimationFrame(step);
        else stop();
      };
      raf = requestAnimationFrame(step);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || url.hash !== `#${anchorId}`) return;
      const target = document.getElementById(anchorId);
      if (!target) return;
      const top = target.getBoundingClientRect().top + scrollY;
      if (prefersReducedMotion()) return; // Let the browser jump.
      e.preventDefault();
      // The click came from a pointer press, which would cancel the scroll it starts, so begin on the next frame. From
      // the phone menu, wait for it to close and release its scroll lock first.
      const fromMenu = !!a.closest(".menu-panel");
      if (fromMenu) setTimeout(() => run(top), 320);
      else requestAnimationFrame(() => run(top));
    };
    // Capture, so this runs before Next's Link handler for "/#tour" links.
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); cancel?.(); };
  }, [anchorId]);
}
