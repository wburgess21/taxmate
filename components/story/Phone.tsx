import type { ReactNode } from "react";

/** iPhone 17 Pro proportions in points. The phone is drawn at this size and scaled as a whole. */
export const PHONE = { width: 393, height: 852, radius: 55, bezel: 11 };

/** An annular sector of the Wi-Fi fan, centred on (cx, cy), between radii r0 and r1, 45° either side of straight up. */
function fanBand(cx: number, cy: number, r0: number, r1: number) {
  const a0 = (-135 * Math.PI) / 180, a1 = (-45 * Math.PI) / 180;
  const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  if (r0 === 0) return `M${cx} ${cy}L${p(r1, a0)}A${r1} ${r1} 0 0 1 ${p(r1, a1)}Z`;
  return `M${p(r1, a0)}A${r1} ${r1} 0 0 1 ${p(r1, a1)}L${p(r0, a1)}A${r0} ${r0} 0 0 0 ${p(r0, a0)}Z`;
}

/** The iOS status bar's cellular, Wi-Fi and battery glyphs, drawn to their proportions at 17 pt. */
function StatusIcons() {
  return (
    <span className="flex items-center gap-[6px]">
      <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden fill="currentColor">
        <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" />
        <rect x="4.9" y="5" width="3.2" height="7" rx="1" />
        <rect x="9.8" y="2.5" width="3.2" height="9.5" rx="1" />
        <rect x="14.7" y="0" width="3.2" height="12" rx="1" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round">
        <path d={fanBand(8, 11.3, 0, 3.4)} />
        <path d={fanBand(8, 11.3, 5.1, 7.6)} />
        <path d={fanBand(8, 11.3, 9.3, 11.6)} />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
        <rect x="0.5" y="0.5" width="24" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        <rect x="2" y="2" width="21" height="9" rx="2.4" fill="currentColor" />
        <path d="M25.6 4.4v4.2c.85-.36 1.4-1.18 1.4-2.1s-.55-1.74-1.4-2.1Z" fill="currentColor" fillOpacity="0.4" />
      </svg>
    </span>
  );
}

/** A CSS iPhone: titanium frame, Dynamic Island and status bar around `children`. */
export function Phone({ children, tone, className = "", style }: { children: ReactNode; tone: "light" | "dark"; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`phone ${className}`} style={{ width: PHONE.width, height: PHONE.height, ...style }} aria-hidden>
      <div className="phone-frame" />
      <div className="phone-screen" data-tone={tone}>
        {children}
        <div className="phone-status">
          <span className="w-[54px] text-center">9:41</span>
          <StatusIcons />
        </div>
        <div className="phone-island" />
        <div className="phone-home-indicator" />
      </div>
    </div>
  );
}
