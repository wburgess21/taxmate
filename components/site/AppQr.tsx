import QRCode from "qrcode";
import { CoinMark } from "./CoinMark";
import { APP_STORE_URL } from "@/lib/site";

/**
 * A QR code for the App Store link, drawn as SVG at build time, with the coin mark at its centre (the high error
 * correction level leaves room for it). For desktop visitors, who'll install on their phone.
 */
export function AppQr({ className = "" }: { className?: string }) {
  const qr = QRCode.create(APP_STORE_URL, { errorCorrectionLevel: "H" });
  const n = qr.modules.size, data = qr.modules.data;
  // Clear a square in the middle for the mark, about a fifth of the code.
  const hole = Math.round(n * 0.22) | 1, lo = Math.floor((n - hole) / 2), hi = lo + hole;
  let d = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; ) {
      if (!data[y * n + x] || (x >= lo && x < hi && y >= lo && y < hi)) { x++; continue; }
      let w = 1;
      while (x + w < n && data[y * n + x + w] && !(x + w >= lo && x + w < hi && y >= lo && y < hi)) w++;
      d += `M${x} ${y}h${w}v1h-${w}z`;
      x += w;
    }
  }
  return (
    <span className={`relative inline-block ${className}`}>
      <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className="h-full w-full" role="img" aria-label="QR code linking to TaxMate on the App Store" shapeRendering="crispEdges">
        <path d={d} fill="#00351a" />
      </svg>
      <CoinMark className="absolute left-1/2 top-1/2 h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 text-[#00351a]" />
    </span>
  );
}
