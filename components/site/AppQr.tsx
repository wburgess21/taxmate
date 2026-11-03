import QRCode from "qrcode";
import { backCoin, frontCoin, frontSilhouette } from "@/lib/coins/paths";
import { APP_STORE_URL } from "@/lib/site";

/**
 * The App Store link as a QR code in the brand's style: rounded dots and soft-cornered finder squares in deep green,
 * with the coin mark on a gold disc at the centre (high error correction leaves room for it). Drawn as SVG at build
 * time.
 */
export function AppQr({ className = "" }: { className?: string }) {
  const qr = QRCode.create(APP_STORE_URL, { errorCorrectionLevel: "H" });
  const n = qr.modules.size, data = qr.modules.data;
  // A clear disc in the middle for the mark.
  const hole = Math.round(n * 0.24) | 1, lo = Math.floor((n - hole) / 2), hi = lo + hole;
  const inFinder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const inHole = (x: number, y: number) => x >= lo && x < hi && y >= lo && y < hi;

  const dots: string[] = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (!data[y * n + x] || inFinder(x, y) || inHole(x, y)) continue;
    dots.push(`M${x + 0.5 - 0.42} ${y + 0.5}a0.42 0.42 0 1 0 0.84 0a0.42 0.42 0 1 0 -0.84 0`);
  }
  const finders = [[0, 0], [n - 7, 0], [0, n - 7]];

  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className={className} role="img" aria-label="QR code linking to TaxMate on the App Store">
      <path d={dots.join("")} fill="#00351a" />
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`} fill="#00351a">
          {/* Outer ring and centre, with soft corners. */}
          <path fillRule="evenodd" d={`M${x + 2} ${y}h3a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-3a2 2 0 0 1 -2 -2v-3a2 2 0 0 1 2 -2z M${x + 2.2} ${y + 1}h2.6a1.2 1.2 0 0 1 1.2 1.2v2.6a1.2 1.2 0 0 1 -1.2 1.2h-2.6a1.2 1.2 0 0 1 -1.2 -1.2v-2.6a1.2 1.2 0 0 1 1.2 -1.2z`} />
          <rect x={x + 2} y={y + 2} width="3" height="3" rx="1" />
        </g>
      ))}
      <circle cx={n / 2} cy={n / 2} r={hole / 2 - 0.3} fill="#ddad44" />
      {/* The coin mark, deep green on the gold disc. */}
      <svg x={n / 2 - hole * 0.31} y={n / 2 - hole * 0.31} width={hole * 0.62} height={hole * 0.62} viewBox="0 0 1428 1457">
        <defs>
          <mask id="qr-mark-knockout" maskUnits="userSpaceOnUse" x="0" y="0" width="1428" height="1457">
            <rect width="1428" height="1457" fill="#fff" />
            <path d={frontSilhouette} fill="#000" />
          </mask>
        </defs>
        <path d={backCoin} fillRule="evenodd" fill="#00351a" mask="url(#qr-mark-knockout)" />
        <path d={frontCoin} fillRule="evenodd" fill="#00351a" />
      </svg>
    </svg>
  );
}
