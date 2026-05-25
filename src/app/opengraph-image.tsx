import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Klima Data Norge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <svg
          width={300}
          height={300}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" x2="9" y1="3" y2="18" />
          <line x1="15" x2="15" y1="6" y2="21" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 80, fontWeight: 700, color: "#ffffff", letterSpacing: "-2px" }}>
            Klima Data Norge
          </div>
          <div style={{ fontSize: 32, color: "#71717a" }}>
            klimadatanorge.no
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
