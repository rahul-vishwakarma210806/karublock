import { ImageResponse } from "next/og";

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const creator = (p.get("c") || "My friend").slice(0, 24);
  const name = (p.get("n") || "").slice(0, 24);
  const score = Math.max(0, parseInt(p.get("s") || "") || 0);
  const total = Math.max(1, parseInt(p.get("t") || "10") || 10);
  const hasScore = p.get("s") !== null;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#F1ECFF", color: "#1A1033", padding: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#fff", border: "8px solid #1A1033", borderRadius: 40, padding: "48px 64px", boxShadow: "16px 16px 0 #1A1033" }}>
          <div style={{ fontSize: 44, fontWeight: 800 }}>{hasScore && name ? `${name} knows ${creator}` : `How well do you know ${creator}?`}</div>
          {hasScore ? (
            <div style={{ display: "flex", fontSize: 180, fontWeight: 900, color: "#FF4F7B", lineHeight: 1.1 }}>{`${score}/${total}`}</div>
          ) : (
            <div style={{ display: "flex", fontSize: 90, fontWeight: 900, color: "#FF4F7B", margin: "24px 0" }}>Take the quiz</div>
          )}
          <div style={{ display: "flex", fontSize: 34, background: "#FFD23F", border: "5px solid #1A1033", borderRadius: 20, padding: "10px 28px", fontWeight: 800 }}>
            {hasScore ? "Can you beat this score?" : "Best Friend Test"}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
