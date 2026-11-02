import type { ReactNode } from "react";

/** iPhone 17 Pro proportions in points. The phone is drawn at this size and scaled as a whole. */
export const PHONE = { width: 393, height: 852, radius: 55, bezel: 11 };

function StatusIcons() {
  return (
    <span className="flex items-center gap-[6px]">
      <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden fill="currentColor">
        <path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 1 10.2 10.2 0 0 0 .9 3.8L2 5a8.6 8.6 0 0 1 6-2.4Zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.1-1.2A6.9 6.9 0 0 0 8 4.3a6.9 6.9 0 0 0-4.7 1.8l1.1 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.3c.6 0 1.1.2 1.5.6L8 11.5 6.5 9.8c.4-.4.9-.6 1.5-.6Z" />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" fillOpacity="0.45" />
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
