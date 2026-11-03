import { ImageResponse } from "next/og";
import { VIEW_BOX, backCoin, frontCoin, frontSilhouette } from "@/lib/coins/paths";

export const alt = "TaxMate: Your UK tax, made clearer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The two-coin mark in white, with its sparkles, as an SVG data URI. */
function markUri() {
  const { width, height } = VIEW_BOX;
  const star = (x: number, y: number, r: number) => {
    const c = 0.17 * r;
    return `M${x} ${y - r}Q${x + c} ${y - c} ${x + r} ${y}Q${x + c} ${y + c} ${x} ${y + r}Q${x - c} ${y + c} ${x - r} ${y}Q${x - c} ${y - c} ${x} ${y - r}Z`;
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#fff"/><path d="${frontSilhouette}" fill="#000"/></mask><g fill="#fff"><path d="${backCoin}" fill-rule="evenodd" mask="url(#m)"/><path d="${frontCoin}" fill-rule="evenodd"/><path d="${star(1210, 230, 135)}"/><path d="${star(260, 1225, 105)}"/></g></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          color: "#fff",
          background: "linear-gradient(135deg, #005424, #00351a)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 30, color: "#ddad44", letterSpacing: 0.5 }}>TaxMate · iPhone &amp; iPad</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.04, marginTop: 22, letterSpacing: -2 }}>
            <span>Your UK tax,</span>
            <span style={{ color: "#ddad44" }}>made clearer.</span>
          </div>
          <div style={{ fontSize: 30, marginTop: 30, color: "rgba(255,255,255,0.8)", lineHeight: 1.35 }}>
            Eleven calculators for your pay, your business and the year ahead.
          </div>
        </div>
        <img src={markUri()} width={360} height={Math.round((360 * VIEW_BOX.height) / VIEW_BOX.width)} alt="" />
      </div>
    ),
    size,
  );
}
