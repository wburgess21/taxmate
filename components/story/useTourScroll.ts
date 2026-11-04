import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/coins/engine";

/** A CSS-style cubic-bezier easing (x1, y1, x2, y2), solved for x with a few Newton steps. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (u: number) => {
    let t = u;
    for (let i = 0; i < 8; i++) {
      const x = ((ax * t + bx) * t + cx) * t - u, d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= x / d;
    }
    return ((ay * t + by) * t + cy) * t;
  };
}

/**
 * Moves from the first frame (an ease-in-out cubic barely moved for half a second, which read as a delay), then
 * eases gently into the stop.
 */
const ease = cubicBezier(0.35, 0.1, 0.45, 1);

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
      const duration = Math.min(3600, Math.max(1250, 750 + screens * 980));
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
        scrollTo(0, from + distance * ease(u));
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
