import { appStoreUrl } from "@/lib/site";

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" className={className} aria-hidden fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

type Variant = "primary" | "gold" | "glass";

/** "Download on the App Store" in the site's button styles. */
/**
 * `still` leaves out the hover lift and press, for places where the button should just sit. `placement` names the
 * button for measurement: it becomes the App Store campaign and the `data-cta` that the click tracker reports.
 */
export function AppStoreButton({ variant = "primary", label = "Download on the App Store", className = "", still = false, placement }: { variant?: Variant; label?: string; className?: string; still?: boolean; placement: string }) {
  const style = variant === "gold" ? "btn-gold" : variant === "glass" ? "btn-glass glass" : "btn-primary";
  return (
    <a href={appStoreUrl(placement)} data-cta={placement} target="_blank" rel="noopener noreferrer" className={`${style} ${still ? "" : "press"} ${className}`}>
      <AppleGlyph className="h-[1.15em] w-[1.15em] -mt-0.5" />
      {label}
    </a>
  );
}
