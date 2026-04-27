import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sandrine Ceuppens · The Girl With A Camera";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#fff",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: "0.3em", textTransform: "uppercase", color: "#737373" }}>
          Photographer & Content Creator · Brussels
        </div>
        <div style={{ fontSize: 140, lineHeight: 1, fontWeight: 700, letterSpacing: "-0.04em", display: "flex", flexDirection: "column" }}>
          <span>THE GIRL</span>
          <span>WITH A CAMERA</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 28 }}>Sandrine Ceuppens</div>
          <div style={{ fontSize: 22, color: "#737373" }}>thegirlwithacamera.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
