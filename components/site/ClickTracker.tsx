"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";

/**
 * Reports clicks on anything marked `data-cta` (App Store buttons, the QR code and other calls to action) as an
 * "App Store click" event, with the placement and page. One listener on the document, so the buttons themselves stay
 * server-rendered. Middle clicks count too, since they open the store in a new tab.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button > 1) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-cta]");
      if (!el) return;
      const external = el instanceof HTMLAnchorElement && el.host !== location.host;
      trackEvent(external ? "App Store click" : "CTA click", { placement: el.dataset.cta! });
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, []);
  return null;
}
