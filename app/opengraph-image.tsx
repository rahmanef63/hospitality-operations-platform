import { ImageResponse } from "next/og";

export const alt = "Kamyna Living — Homes for slower living";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F2EC",
        color: "#3E3A34",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ position: "absolute", inset: 32, border: "1px solid #D4C9BC" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 70, letterSpacing: 20, textTransform: "uppercase" }}>Kamyna Living</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 40 }}>
          <div style={{ width: 180, height: 1, background: "#A58F7D" }} />
          <svg width="60" height="60" viewBox="0 0 120 120" fill="none">
            <path
              d="M19 101C38 83 50 66 59 46C65 33 69 21 72 11M44 75C36 68 31 59 30 49M54 56C47 49 44 41 44 32M52 61C63 57 72 50 79 40M59 45C70 42 79 36 86 27"
              stroke="#51463D"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ width: 180, height: 1, background: "#A58F7D" }} />
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 24, letterSpacing: 10, marginTop: 28 }}>
          HOMES FOR SLOWER LIVING
        </div>
      </div>
    </div>,
    size,
  );
}
