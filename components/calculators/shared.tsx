"use client";

import { createContext, useContext, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { appStoreUrl } from "@/lib/site";
import { SpinCoins } from "@/components/site/SpinCoins";
import type { ReactNode } from "react";
import type { Region } from "@/lib/taxRules";
import { ShareImageButton, ShareImageDialog, ShareMenu, type ShareCard } from "./Share";

export const REGIONS: [Region, string][] = [["rUK", "England, Wales & NI"], ["scotland", "Scotland"]];

export type Period = "year" | "month" | "week";
export const PERIODS: [Period, string][] = [["year", "Year"], ["month", "Month"], ["week", "Week"]];
export const per = (n: number, p: Period) => (p === "month" ? n / 12 : p === "week" ? n / 52 : n);
export const perLabel = (p: Period) => (p === "month" ? "a month" : p === "week" ? "a week" : "a year");

/** Which page a calculator is on, so its "save this in the app" link carries the right campaign. */
type CalcInfo = { placement: string; tool: string; plus?: boolean; slug: string; headline: string; shareText: string };
export const CalcContext = createContext<CalcInfo | null>(null);

export function CalcProvider({ children, ...info }: CalcInfo & { children: ReactNode }) {
  return <CalcContext.Provider value={info}>{children}</CalcContext.Provider>;
}

/**
 * The two halves of a calculator card. The results open with a share button in the corner and end with a link to carry
 * on in the app, at the moment it's most useful. `card`, when a calculator has a result worth posting, adds a shareable
 * image of it.
 */
export function Calc({ inputs, results, cta = true, card }: { inputs: ReactNode; results: ReactNode; cta?: boolean; card?: ShareCard | null }) {
  const ctx = useContext(CalcContext);
  const [imageOpen, setImageOpen] = useState(false);
  const pane = useRef<HTMLDivElement>(null);
  /** Where focus goes when the image dialog closes: the button that opened it, or the share button if that was the menu. */
  const opener = useRef<"menu" | "button">("button");
  const share = ctx && cta;
  const openImage = card ? () => { opener.current = "menu"; setImageOpen(true); } : undefined;
  return (
    <div className="surface-card calc">
      <div className="calc-inputs">{inputs}</div>
      <div ref={pane} className="calc-results" data-share={share || undefined}>
        {share && <ShareMenu headline={ctx.headline} shareText={ctx.shareText} onImage={openImage} />}
        {results}
        {share && card && <ShareImageButton onClick={() => { opener.current = "button"; setImageOpen(true); }} />}
        {share && card && (
          <ShareImageDialog open={imageOpen} onOpenChange={setImageOpen} card={card} slug={ctx.slug}
            returnFocus={() => pane.current?.querySelector<HTMLElement>(opener.current === "menu" ? ".share-button" : ".share-result")} />
        )}
        {ctx && cta && (
          <a href={appStoreUrl(`${ctx.placement}-result`)} data-cta={`${ctx.placement}-result`} target="_blank" rel="noopener noreferrer" className="calc-save green">
            {/* The two-coin mark, which plays the header button's spin on hover. */}
            <span className="calc-save-coin" aria-hidden><SpinCoins className="h-6 w-6" delay={0} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[1.0625rem] font-medium leading-snug">Go further in the app</span>
              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-white/70">{ctx.plus ? `The full ${ctx.tool} tool, with TaxMate Plus` : `The full ${ctx.tool} tool, free on iPhone and iPad`}</span>
            </span>
            <span className="calc-save-go" aria-hidden><ArrowUpRight className="h-5 w-5" strokeWidth={2.4} /></span>
          </a>
        )}
      </div>
    </div>
  );
}
