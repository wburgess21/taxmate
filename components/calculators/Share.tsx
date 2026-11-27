"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Download, ImageIcon, Link2, Mail, Share, X as Close } from "lucide-react";
import { MARK_RATIO, markSvg } from "@/lib/coins/markSvg";
import { trackEvent } from "@/lib/track";
import { BrandIcon, type Brand } from "./BrandIcons";

/**
 * What a calculator's shareable result card says. `tip` is the version without the person's own amount, for anyone
 * who'd rather not post their figures.
 */
export type ShareCard = {
  kicker: string;
  lead: string;
  amount: string;
  sub: string;
  tip: { lead: string; amount: string; sub: string };
};

/**
 * Share analytics. Vercel Pro allows two properties per custom event and `trackEvent` already sends `path` (which also
 * says which calculator), so each kind of action is its own event and everything else rides in one `option` value,
 * such as "whatsapp, with figures" or "save, tip". With Web Analytics Plus (eight properties) these could be split up.
 *
 * - Share menu opened
 * - Share link: copy | whatsapp | x | linkedin | email | device, then "with figures" or "no figures"
 * - Share link cancelled: device (the share sheet was closed without sending), plus figures
 * - Share figures switched: on | off
 * - Share image opened: button | menu
 * - Share image style: amount | tip
 * - Share image: share | save, then amount | tip
 * - Share image cancelled: share, then amount | tip
 */
export type ShareEvent = "Share menu opened" | "Share link" | "Share link cancelled" | "Share figures switched" | "Share image opened" | "Share image style" | "Share image" | "Share image cancelled";
export const trackShare = (event: ShareEvent, option?: string) => trackEvent(event, option ? { option } : {});
const withFigures = (figures: boolean) => (figures ? "with figures" : "no figures");
/** A share sheet closed without sending rejects with AbortError; anything else is a real failure. */
const cancelled = (e: unknown) => e instanceof DOMException && e.name === "AbortError";

/** The calculator page's own address, with the inputs in it only when the person asks for that. */
const shareUrl = (figures: boolean) => (figures ? location.href : `${location.origin}${location.pathname}`);
const enc = encodeURIComponent;

/**
 * The share button in the corner of a calculator's results. It opens a small menu: copy the link, send it to a few
 * common places, or hand it to the device's own share sheet. Figures stay out of the link unless switched on, as the
 * site promises that nothing entered leaves the browser.
 */
export function ShareMenu({ headline, shareText, onImage }: { headline: string; shareText: string; onImage?: () => void }) {
  const [open, setOpen] = useState(false);
  const [figures, setFigures] = useState(false);
  const [copied, setCopied] = useState(false);
  const [native, setNative] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    // Read once the menu opens: the browser's share sheet isn't known until then, and it keeps server and client HTML equal.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNative(typeof navigator.share === "function");
    const down = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); button.current?.focus(); } };
    // Tabbing out of the menu closes it, as clicking away does.
    const blur = (e: FocusEvent) => { if (e.relatedTarget instanceof Node && !wrap.current?.contains(e.relatedTarget)) setOpen(false); };
    const el = wrap.current;
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    el?.addEventListener("focusout", blur);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); el?.removeEventListener("focusout", blur); };
  }, [open]);

  // On a phone the button can sit near the bottom of the screen: bring the whole menu into view, once its
  // "More ways to share" row (which depends on `native`) is in.
  useEffect(() => {
    if (open) pop.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open, native]);

  // The message goes in the post or chat; the headline names it where there is a title (email subject, share sheet).
  const text = shareText;
  const title = `${headline} · TaxMate`;
  const link = open ? shareUrl(figures) : "";
  const sent = (method: string) => trackShare("Share link", `${method}, ${withFigures(figures)}`);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl(figures));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      sent("copy");
    } catch {}
  }

  async function more() {
    try {
      await navigator.share({ title, text, url: shareUrl(figures) });
      sent("device");
      setOpen(false);
    } catch (e) {
      if (cancelled(e)) trackShare("Share link cancelled", `device, ${withFigures(figures)}`);
    }
  }

  const targets: [Brand, string][] = [
    ["WhatsApp", `https://wa.me/?text=${enc(`${text} ${link}`)}`],
    ["X", `https://x.com/intent/post?text=${enc(text)}&url=${enc(link)}`],
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}`],
  ];

  return (
    <div ref={wrap} className="share-anchor">
      <button ref={button} type="button" className="share-button" aria-expanded={open} aria-haspopup="dialog" aria-label="Share this calculator" onClick={() => { if (!open) trackShare("Share menu opened"); setOpen(!open); }}>
        <Share className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
        <span className="share-button-label">Share</span>
      </button>
      {open && (
        <div ref={pop} role="dialog" aria-label="Share this calculator" className="share-pop">
          <p className="text-[1.0625rem] font-semibold">Share this calculator</p>
          <div className="share-link">
            <span className="min-w-0 flex-1 truncate text-[0.875rem] text-muted">{link.replace(/^https?:\/\/(www\.)?/, "")}</span>
            <button type="button" className="share-copy" onClick={copy} aria-live="polite">
              {copied ? <><Check className="h-4 w-4" aria-hidden /> Copied</> : <><Link2 className="h-4 w-4" aria-hidden /> Copy</>}
            </button>
          </div>
          <div className="share-targets">
            {targets.map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="share-target" onClick={() => sent(name.toLowerCase())}>
                {/* The X mark is the name, so it stands alone; the word stays for screen readers. */}
                <BrandIcon brand={name} className="h-4 w-4" /> {name === "X" ? <span className="sr-only">X</span> : name}
              </a>
            ))}
            <a href={`mailto:?subject=${enc(title)}&body=${enc(`${text}:\n\n${link}`)}`} className="share-target" onClick={() => sent("email")}>
              <Mail className="h-4 w-4" aria-hidden /> Email
            </a>
          </div>
          {(native || onImage) && (
            <div className="grid gap-2">
              {onImage && (
                <button type="button" className="share-wide" onClick={() => { setOpen(false); trackShare("Share image opened", "menu"); onImage(); }}>
                  <ImageIcon className="h-4 w-4" aria-hidden /> Share my result as an image
                </button>
              )}
              {native && <button type="button" className="share-wide" onClick={more}><Share className="h-4 w-4" aria-hidden /> More ways to share</button>}
            </div>
          )}
          <div className="share-figures">
            <button type="button" role="switch" aria-checked={figures} aria-labelledby={labelId} className="share-switch" onClick={() => { trackShare("Share figures switched", figures ? "off" : "on"); setFigures(!figures); }}>
              <span aria-hidden />
            </button>
            <span className="grid gap-0.5">
              <span id={labelId} className="text-[0.9375rem] font-medium">Include my figures</span>
              <span className="text-[0.8125rem] leading-snug text-muted">
                {figures ? "The link opens with your numbers filled in. Only share it with people you trust." : "The link opens a blank calculator, so your numbers stay with you."}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** A secondary button under the results that opens the result image. */
export function ShareImageButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="share-wide share-result" onClick={() => { trackShare("Share image opened", "button"); onClick(); }}>
      <ImageIcon className="h-[18px] w-[18px]" aria-hidden /> Share your result as an image
    </button>
  );
}

/** The result card as a dialog: a preview of the image, a choice of amount or tip, then share or save. */
export function ShareImageDialog({ open, onOpenChange, card, slug, returnFocus }: { open: boolean; onOpenChange: (o: boolean) => void; card: ShareCard; slug: string; returnFocus: () => HTMLElement | null | undefined }) {
  const [tip, setTip] = useState(false);
  const [image, setImage] = useState<{ url: string; blob: Blob } | null>(null);
  const [canShareFile, setCanShareFile] = useState(false);
  const key = JSON.stringify([card, tip]);
  const style = tip ? "tip" : "amount";
  const pick = (t: boolean) => { if (t !== tip) trackShare("Share image style", t ? "tip" : "amount"); setTip(t); };

  useEffect(() => {
    if (!open) return;
    let url = "";
    let live = true;
    drawCard(card, tip).then((blob) => {
      if (!live) return;
      url = URL.createObjectURL(blob);
      setImage({ url, blob });
      const file = new File([blob], `taxmate-${slug}.png`, { type: "image/png" });
      setCanShareFile(typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));
    });
    return () => { live = false; if (url) URL.revokeObjectURL(url); };
    // `key` stands for the card and the choice; the objects themselves change identity on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, key, slug]);

  const file = () => new File([image!.blob], `taxmate-${slug}.png`, { type: "image/png" });

  async function share() {
    if (!image) return;
    try {
      await navigator.share({ files: [file()], text: `Work out yours: ${location.origin}${location.pathname}` });
      trackShare("Share image", `share, ${style}`);
    } catch (e) {
      if (cancelled(e)) trackShare("Share image cancelled", `share, ${style}`);
    }
  }

  function save() {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image.url;
    a.download = `taxmate-${slug}.png`;
    a.click();
    trackShare("Share image", `save, ${style}`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="share-overlay" />
        {/* Opened from the share menu, the item that opened it is gone by now: hand focus back to a button that's still there. */}
        <Dialog.Content className="share-dialog" onCloseAutoFocus={(e) => { const el = returnFocus(); if (el) { e.preventDefault(); el.focus(); } }}>
          <div className="share-preview">
            {/* A blob made on the device, so there's nothing for next/image to optimise. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {image ? <img src={image.url} alt={tip ? `${card.tip.lead} ${card.tip.amount} ${card.tip.sub}` : `${card.lead} ${card.amount} ${card.sub}`} /> : <span className="share-preview-wait" aria-hidden />}
          </div>
          <div className="grid content-start gap-4">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-[1.375rem] font-semibold">Share your result</Dialog.Title>
              <Dialog.Close className="share-close" aria-label="Close"><Close className="h-5 w-5" aria-hidden /></Dialog.Close>
            </div>
            <Dialog.Description className="text-[0.9375rem] leading-relaxed text-muted">
              Made on your device. It shows only what’s on the card, never the rest of your figures.
            </Dialog.Description>
            <fieldset className="field">
              <legend className="field-label mb-2">Show on the card</legend>
              <div className="seg">
                <label><input type="radio" name="share-card" checked={!tip} onChange={() => pick(false)} />My amount</label>
                <label><input type="radio" name="share-card" checked={tip} onChange={() => pick(true)} />Just the tip</label>
              </div>
            </fieldset>
            <div className="mt-2 grid gap-2.5">
              {canShareFile && <button type="button" className="share-primary" onClick={share} disabled={!image}><Share className="h-[18px] w-[18px]" aria-hidden /> Share image</button>}
              <button type="button" className={canShareFile ? "share-wide" : "share-primary"} onClick={save} disabled={!image}><Download className="h-[18px] w-[18px]" aria-hidden /> Save image</button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Wrap text onto lines that fit `width`, up to `max` lines. */
function wrapLines(g: CanvasRenderingContext2D, text: string, width: number, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > width && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, max);
}

const spacing = (g: CanvasRenderingContext2D, px: number) => { (g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${px}px`; };

/** Draw the 1080 × 1350 result card (a portrait post size that works in stories and chats) and return it as a PNG. */
export async function drawCard(card: ShareCard, tip: boolean): Promise<Blob> {
  const W = 1080, H = 1350, P = 96;
  const css = getComputedStyle(document.body);
  const sans = css.fontFamily;
  const serif = css.getPropertyValue("--font-instrument-serif").trim() || "Georgia, serif";
  await Promise.all([document.fonts.load(`300 200px ${sans}`), document.fonts.load(`600 48px ${sans}`), document.fonts.load(`italic 400 90px ${serif}`)]).catch(() => {});

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d")!;
  const fill = g.createLinearGradient(0, 0, W, H);
  fill.addColorStop(0, "#005424");
  fill.addColorStop(1, "#00351a");
  g.fillStyle = fill;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W, 0, 0, W, 0, W * 1.1);
  glow.addColorStop(0, "rgba(255,255,255,0.12)");
  glow.addColorStop(0.55, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  const v = tip ? card.tip : card;
  g.fillStyle = "#ddad44";
  g.font = `500 34px ${sans}`;
  spacing(g, 3);
  g.fillText(card.kicker.toUpperCase(), P, P + 34);
  spacing(g, 0);

  g.fillStyle = "#ffffff";
  g.font = `italic 400 92px ${serif}`;
  g.fillText(v.lead, P, P + 250);

  let size = 300;
  const fit = () => { g.font = `300 ${size}px ${sans}`; spacing(g, -size * 0.04); };
  fit();
  while (g.measureText(v.amount).width > W - 2 * P && size > 110) { size -= 10; fit(); }
  const amountBase = P + 250 + size * 0.95;
  g.fillText(v.amount, P, amountBase);
  spacing(g, 0);

  g.fillStyle = "rgba(255,255,255,0.82)";
  g.font = `400 46px ${sans}`;
  wrapLines(g, v.sub, W - 2 * P, 4).forEach((l, i) => g.fillText(l, P, amountBase + 100 + i * 62));

  const footer = H - P - 136;
  g.strokeStyle = "rgba(255,255,255,0.2)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(P, footer);
  g.lineTo(W - P, footer);
  g.stroke();

  const mark = new Image();
  mark.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markSvg())}`;
  await mark.decode().catch(() => {});
  const markH = 104, markW = markH / MARK_RATIO;
  if (mark.complete && mark.naturalWidth) g.drawImage(mark, P, footer + 40, markW, markH);
  const tx = P + markW + 28;
  g.fillStyle = "#ffffff";
  g.font = `600 48px ${sans}`;
  g.fillText("TaxMate", tx, footer + 86);
  g.fillStyle = "rgba(255,255,255,0.75)";
  g.font = `400 34px ${sans}`;
  g.fillText(`Work out yours free at ${location.host.replace(/^www\./, "")}`, tx, footer + 134);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No image"))), "image/png"));
}
