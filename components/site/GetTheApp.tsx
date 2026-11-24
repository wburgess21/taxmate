"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppStoreButton } from "./AppStoreButton";
import { appStoreUrl } from "@/lib/site";
import { trackEvent } from "@/lib/track";

type Mode = "store" | "scan";

/**
 * The closing call to action. On wide screens a small switcher chooses between the App Store button and a code to
 * scan with an iPhone (most desktop visitors install on their phone); the area eases between the two. Phones only
 * see the button.
 */
export function GetTheApp({ qr, placement }: { qr: ReactNode; placement: string }) {
  const [mode, setMode] = useState<Mode>("store");
  const ref = useRef<HTMLDivElement>(null);

  // The card keeps its height: whatever the code adds over the button comes out of the card's bottom padding, so
  // switching only moves the lines below down into the space above the coins.
  useEffect(() => {
    const root = ref.current!, card = root.closest<HTMLElement>(".finale-card");
    if (!card) return;
    const inner = (id: string) => root.querySelector<HTMLElement>(`#${id} > div`)!;
    const update = () => {
      const grow = mode === "scan" ? Math.max(0, inner("get-app-scan").scrollHeight - inner("get-app-store").scrollHeight) : 0;
      card.style.setProperty("--cta-grow", `${grow}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(root);
    return () => ro.disconnect();
  }, [mode]);
  const tabs: [Mode, string][] = [["store", "App Store"], ["scan", "Scan with iPhone"]];
  return (
    <div ref={ref} className="get-app mt-10 flex flex-col items-center" data-mode={mode}>
      <div role="tablist" aria-label="How to get TaxMate" className="get-app-switch hidden lg:grid">
        <span className="get-app-thumb" aria-hidden />
        {tabs.map(([m, label]) => (
          <button key={m} role="tab" type="button" aria-selected={mode === m} aria-controls={`get-app-${m}`} id={`get-app-tab-${m}`} onClick={() => { setMode(m); if (m === "scan") trackEvent("QR shown", { placement }); }}>
            {label}
          </button>
        ))}
      </div>
      <div className="w-full lg:mt-8">
        <div className="get-app-panel" id="get-app-store" role="tabpanel" aria-labelledby="get-app-tab-store" data-on={mode === "store" || undefined}>
          <div className="flex justify-center overflow-hidden py-2">
            <AppStoreButton variant="gold" still placement={placement} />
          </div>
        </div>
        <div className="get-app-panel hidden lg:grid" id="get-app-scan" role="tabpanel" aria-labelledby="get-app-tab-scan" data-on={mode === "scan" || undefined}>
          <div className="flex flex-col items-center overflow-hidden py-2">
            <a href={appStoreUrl(`${placement}-qr`)} data-cta={`${placement}-qr`} target="_blank" rel="noopener noreferrer" className="get-app-qr" aria-label="TaxMate on the App Store">
              {qr}
            </a>
            <p className="mt-4 text-[0.9375rem] text-white/70">Point your iPhone camera here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
