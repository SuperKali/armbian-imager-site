import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Armbian Imager — Flash Armbian OS to SD & USB Drives";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#FAFAFA",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          Armbian Imager
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#A1A1AA",
            textAlign: "center",
            maxWidth: 700,
            marginBottom: 40,
          }}
        >
          Flash Armbian OS to SD cards and USB drives with built-in verification
        </div>
        <div
          style={{
            background: "#F97316",
            color: "#FFFFFF",
            fontSize: 20,
            fontWeight: 600,
            padding: "16px 40px",
            borderRadius: 12,
          }}
        >
          Download Now
        </div>
      </div>
    ),
    { ...size },
  );
}
