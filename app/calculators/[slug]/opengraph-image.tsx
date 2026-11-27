import { ImageResponse } from "next/og";
import { CALCULATORS, calculatorBySlug } from "@/lib/calculators";
import { SHARE_FACTS } from "@/lib/shareFacts";
import { MARK_RATIO, markSvg } from "@/lib/coins/markSvg";
import { RULES } from "@/lib/taxRules";

export const alt = "A free UK tax calculator from TaxMate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const generateStaticParams = () => CALCULATORS.map((c) => ({ slug: c.slug }));

const MARK = `data:image/svg+xml;base64,${Buffer.from(markSvg()).toString("base64")}`;

/** Each calculator's link preview: its headline and three of the figures it works with, in the site's green. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = calculatorBySlug((await params).slug)!;
  const facts = SHARE_FACTS[c.slug];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 56, padding: "0 80px", color: "#fff", background: "linear-gradient(135deg, #005424, #00351a)" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#ddad44" }}>
            <img src={MARK} width={44} height={Math.round(44 * MARK_RATIO)} alt="" />
            <span>TaxMate · Free calculator · {RULES.taxYear}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 74, lineHeight: 1.04, marginTop: 26, letterSpacing: -2 }}>
            <span>{c.h1[0]}</span>
            <span style={{ color: "#ddad44" }}>{c.h1[1]}</span>
          </div>
          <div style={{ fontSize: 28, marginTop: 26, color: "rgba(255,255,255,0.8)", lineHeight: 1.35 }}>{c.lede}</div>
        </div>
        {facts && (
          <div style={{ width: 360, display: "flex", flexDirection: "column", padding: 30, borderRadius: 28, background: "#f8f6f1", color: "#0f1712" }}>
            <div style={{ fontSize: 17, letterSpacing: 1.6, color: "#5d6761", marginBottom: 10, textTransform: "uppercase" }}>{facts.heading}</div>
            {facts.rows.map(([label, value], i) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontSize: 23, borderTop: "1px solid #e6e2d9", borderBottom: i === facts.rows.length - 1 ? "1px solid #e6e2d9" : "0" }}>
                <span style={{ color: "#5d6761" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    size,
  );
}
