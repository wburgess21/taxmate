import { ImageResponse } from "next/og";
import { MARK_RATIO, markSvg } from "@/lib/coins/markSvg";

export const alt = "TaxMate: Your UK tax, made clearer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The two-coin mark in white, as an SVG data URI. */
function markUri() {
  return `data:image/svg+xml;base64,${Buffer.from(markSvg()).toString("base64")}`;
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
        <img src={markUri()} width={360} height={Math.round(360 * MARK_RATIO)} alt="" />
      </div>
    ),
    size,
  );
}
