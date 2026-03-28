import { useState, useRef, useCallback, useEffect } from "react";

const CORRECT_HASH = "purveyor2026";

/* ─── colour tokens from brand image ─── */
const C = {
  bg: "#0a0014",
  card: "#140025",
  accent: "#270052",
  purple: "#6b21a8",
  lilac: "#c084fc",
  pink: "#f0abfc",
  glow: "#a855f7",
  text: "#f3e8ff",
  muted: "#a78bfa",
  border: "#2e1065",
  input: "#1e0538",
};

const SOCIAL_LINKS = [
  { label: "Website", url: "https://purveyortickets.vercel.app/", icon: "🌐" },
  { label: "Twitter", url: "https://x.com/purveyor_ph", icon: "𝕏" },
  { label: "Twitter Proofs", url: "https://x.com/purveyorproof", icon: "𝕏" },
  { label: "Facebook", url: "https://www.facebook.com/Purveyor.PH", icon: "📘" },
  { label: "Instagram", url: "https://www.instagram.com/purveyor_ph", icon: "📸" },
  { label: "TikTok", url: "https://www.tiktok.com/@purveyor_ph", icon: "🎵" },
];

/* ─── Password Gate ─── */
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("pt_auth", "1");
        onUnlock();
      } else {
        setError(true);
      }
    } catch {
      // Fallback for local dev / preview — compare client-side hash
      if (pw === CORRECT_HASH) {
        sessionStorage.setItem("pt_auth", "1");
        onUnlock();
      } else {
        setError(true);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 30% 20%, ${C.accent} 0%, ${C.bg} 60%)`,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
        padding: "48px 40px", width: 380, textAlign: "center",
        boxShadow: `0 0 80px ${C.accent}44`,
      }}>
        <img src="https://i.imgur.com/NaSV6Yt.png" alt="Purveyor Tickets"
          style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 20, objectFit: "contain" }} />
        <h1 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
          Purveyor Tickets
        </h1>
        <p style={{ color: C.muted, fontSize: 13, margin: "0 0 28px" }}>Ad Generator — Enter password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(false); }}
            placeholder="Master password"
            autoFocus
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${error ? "#ef4444" : C.border}`,
              background: C.input, color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box",
              transition: "border-color .2s",
            }}
          />
          {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "10px 0 0" }}>Incorrect password</p>}
          <button type="submit" disabled={loading} style={{
            marginTop: 20, width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${C.purple}, ${C.glow})`, color: "#fff",
            fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "opacity .2s",
            opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "Verifying..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Canvas-based Ad Generator ─── */
const AD_W = 1080;
const AD_H = 1080;

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, x, maxW, lineH) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function generateAd(canvas, { eventImage, eventName, subtitle }) {
  const ctx = canvas.getContext("2d");
  canvas.width = AD_W;
  canvas.height = AD_H;

  /* ── Background gradient ── */
  const bg = ctx.createRadialGradient(300, 200, 100, AD_W / 2, AD_H / 2, AD_W);
  bg.addColorStop(0, "#1a0035");
  bg.addColorStop(0.4, "#0f001f");
  bg.addColorStop(1, "#05000d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, AD_W, AD_H);

  /* ── Decorative glow circles ── */
  const glow1 = ctx.createRadialGradient(180, 850, 0, 180, 850, 220);
  glow1.addColorStop(0, "rgba(168,85,247,0.18)");
  glow1.addColorStop(1, "rgba(168,85,247,0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 600, 400, 480);

  const glow2 = ctx.createRadialGradient(900, 200, 0, 900, 200, 200);
  glow2.addColorStop(0, "rgba(192,132,252,0.12)");
  glow2.addColorStop(1, "rgba(192,132,252,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(700, 0, 380, 400);

  /* ── Subtle grid pattern ── */
  ctx.strokeStyle = "rgba(107,33,168,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i < AD_W; i += 60) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, AD_H); ctx.stroke();
  }
  for (let i = 0; i < AD_H; i += 60) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(AD_W, i); ctx.stroke();
  }

  /* ── Top: Logo + Brand Name ── */
  try {
    const logo = await loadImg("https://i.imgur.com/NaSV6Yt.png");
    const logoSize = 60;
    const brandText = "PURVEYOR TICKETS";
    ctx.font = "bold 28px 'Outfit', sans-serif";
    const brandW = ctx.measureText(brandText).width;
    const totalW = logoSize + 14 + brandW;
    const startX = (AD_W - totalW) / 2;
    // Logo circle bg
    ctx.save();
    ctx.beginPath();
    ctx.arc(startX + logoSize / 2, 52, logoSize / 2 + 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(107,33,168,0.3)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(startX + logoSize / 2, 52, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, startX, 22, logoSize, logoSize);
    ctx.restore();
    // Brand text
    ctx.fillStyle = "#f3e8ff";
    ctx.font = "bold 28px 'Outfit', sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(brandText, startX + logoSize + 14, 54);
  } catch {
    ctx.fillStyle = "#f3e8ff";
    ctx.font = "bold 30px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PURVEYOR TICKETS", AD_W / 2, 54);
    ctx.textAlign = "start";
  }

  /* ── "TICKET ASSISTANCE" heading ── */
  ctx.textAlign = "center";
  ctx.fillStyle = "#c084fc";
  ctx.font = "800 18px 'Outfit', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("T I C K E T   A S S I S T A N C E", AD_W / 2, 108);

  /* ── Event image card (Instagram-style) ── */
  const cardX = 140;
  const cardY = 140;
  const cardW = AD_W - 280;
  const cardH = 560;
  const cardR = 18;

  // Card shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 10;
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fillStyle = "#1a1a2e";
  ctx.fill();
  ctx.restore();

  // Card border glow
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.strokeStyle = "rgba(168,85,247,0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Event image
  if (eventImage) {
    ctx.save();
    drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
    ctx.clip();
    const imgRatio = eventImage.width / eventImage.height;
    const cardRatio = cardW / cardH;
    let sx = 0, sy = 0, sw = eventImage.width, sh = eventImage.height;
    if (imgRatio > cardRatio) {
      sw = eventImage.height * cardRatio;
      sx = (eventImage.width - sw) / 2;
    } else {
      sh = eventImage.width / cardRatio;
      sy = (eventImage.height - sh) / 2;
    }
    ctx.drawImage(eventImage, sx, sy, sw, sh, cardX, cardY, cardW, cardH);
    // Subtle overlay
    const overlay = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
    overlay.addColorStop(0, "rgba(10,0,20,0.1)");
    overlay.addColorStop(1, "rgba(10,0,20,0.4)");
    ctx.fillStyle = overlay;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.restore();
  } else {
    ctx.save();
    drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
    ctx.clip();
    ctx.fillStyle = "#1a0035";
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.fillStyle = "rgba(168,85,247,0.15)";
    ctx.font = "bold 22px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Event Image", AD_W / 2, cardY + cardH / 2);
    ctx.restore();
  }

  /* ── Event name below card ── */
  const nameY = cardY + cardH + 50;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 38px 'Outfit', sans-serif";
  const nameLines = wrapText(ctx, eventName || "EVENT NAME", 0, cardW + 80, 46);
  nameLines.forEach((line, i) => {
    ctx.fillText(line, AD_W / 2, nameY + i * 48);
  });

  /* ── Subtitle ── */
  if (subtitle) {
    const subY = nameY + nameLines.length * 48 + 10;
    ctx.fillStyle = "#c084fc";
    ctx.font = "600 22px 'Outfit', sans-serif";
    const subLines = wrapText(ctx, subtitle, 0, cardW + 80, 28);
    subLines.forEach((line, i) => {
      ctx.fillText(line, AD_W / 2, subY + i * 30);
    });
  }

  /* ── Social links row ── */
  const socY = AD_H - 120;
  ctx.fillStyle = "rgba(107,33,168,0.15)";
  ctx.fillRect(0, socY - 15, AD_W, 55);
  ctx.fillStyle = "#a78bfa";
  ctx.font = "600 16px 'Outfit', sans-serif";
  const socials = ["🌐 purveyortickets.vercel.app", "𝕏 @purveyor_ph", "📘 Purveyor.PH", "📸 @purveyor_ph", "🎵 @purveyor_ph"];
  const socSpacing = AD_W / (socials.length + 1);
  socials.forEach((s, i) => {
    ctx.fillText(s, socSpacing * (i + 1), socY + 10);
  });

  /* ── Discord CTA ── */
  const ctaY = AD_H - 50;
  ctx.fillStyle = "#f3e8ff";
  ctx.font = "bold 20px 'Outfit', sans-serif";
  ctx.fillText("Join Our Growing Community: discord.gg/747CdAeYwm", AD_W / 2, ctaY);

  /* ── Bottom accent line ── */
  const lineGrad = ctx.createLinearGradient(200, 0, AD_W - 200, 0);
  lineGrad.addColorStop(0, "transparent");
  lineGrad.addColorStop(0.3, C.purple);
  lineGrad.addColorStop(0.7, C.lilac);
  lineGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, AD_H - 15);
  ctx.lineTo(AD_W - 200, AD_H - 15);
  ctx.stroke();

  ctx.textAlign = "start";
}

/* ─── Main App ─── */
function AdGenerator() {
  const canvasRef = useRef(null);
  const [eventName, setEventName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [eventImageObj, setEventImageObj] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEventImage(url);
    const img = new Image();
    img.onload = () => setEventImageObj(img);
    img.src = url;
  };

  const handleGenerate = useCallback(async () => {
    if (!canvasRef.current) return;
    setGenerating(true);
    // Small delay to let fonts load
    await new Promise((r) => setTimeout(r, 200));
    await generateAd(canvasRef.current, {
      eventImage: eventImageObj,
      eventName,
      subtitle,
    });
    setPreviewUrl(canvasRef.current.toDataURL("image/png"));
    setGenerating(false);
  }, [eventImageObj, eventName, subtitle]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `purveyor-${eventName.replace(/\s+/g, "-").toLowerCase() || "ad"}-${Date.now()}.png`;
    a.click();
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: `1px solid ${C.border}`, background: C.input, color: C.text,
    fontSize: 15, outline: "none", boxSizing: "border-box",
    fontFamily: "'Outfit', sans-serif", transition: "border-color .2s",
  };

  const labelStyle = {
    color: C.muted, fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block",
    letterSpacing: "0.5px", textTransform: "uppercase",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 20% 10%, ${C.accent} 0%, ${C.bg} 50%)`,
      fontFamily: "'Outfit', sans-serif", color: C.text,
    }}>
      {/* Header */}
      <header style={{
        padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="https://i.imgur.com/NaSV6Yt.png" alt="Logo"
            style={{ width: 44, height: 44, borderRadius: 10, objectFit: "contain" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>Purveyor Tickets</h1>
            <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Ad Image Generator</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SOCIAL_LINKS.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{
                color: C.muted, fontSize: 12, textDecoration: "none", padding: "6px 10px",
                borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(30,5,56,0.5)",
                transition: "all .2s", whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = C.glow; e.currentTarget.style.color = C.lilac; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </header>

      <div style={{
        display: "grid", gridTemplateColumns: "380px 1fr", gap: 32, padding: 32,
        maxWidth: 1400, margin: "0 auto", minHeight: "calc(100vh - 85px)",
      }}>
        {/* Left Panel — Form */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
          padding: 28, height: "fit-content", position: "sticky", top: 32,
        }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700 }}>Create Ad</h2>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Event Name *</label>
            <input value={eventName} onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. soft by LANY — The World Tour"
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Subtitle / Details</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. November 6-14, 2026 • Philippines"
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Event Image *</label>
            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={handleImageUpload} style={{ display: "none" }} />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${eventImage ? C.glow : C.border}`, borderRadius: 14,
                padding: eventImage ? 0 : "36px 20px", textAlign: "center", cursor: "pointer",
                background: eventImage ? "transparent" : C.input, transition: "all .2s",
                overflow: "hidden",
              }}
            >
              {eventImage ? (
                <img src={eventImage} alt="Preview" style={{
                  width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, display: "block",
                }} />
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Click to upload event poster</p>
                  <p style={{ color: C.border, fontSize: 12, margin: "4px 0 0" }}>PNG, JPG — any size</p>
                </>
              )}
            </div>
            {eventImage && (
              <button onClick={() => { setEventImage(null); setEventImageObj(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                style={{
                  marginTop: 8, background: "none", border: "none", color: "#ef4444",
                  fontSize: 13, cursor: "pointer", padding: "4px 0",
                }}>
                Remove image
              </button>
            )}
          </div>

          <button onClick={handleGenerate} disabled={generating}
            style={{
              width: "100%", padding: "16px 0", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${C.purple}, ${C.glow})`, color: "#fff",
              fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all .2s",
              opacity: generating ? 0.6 : 1, marginBottom: 10,
              boxShadow: `0 4px 24px ${C.glow}33`,
            }}
          >
            {generating ? "Generating..." : "✨ Generate Ad Image"}
          </button>

          {previewUrl && (
            <button onClick={handleDownload}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 14,
                border: `1px solid ${C.glow}`, background: "transparent",
                color: C.lilac, fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}
            >
              ⬇ Download PNG (1080×1080)
            </button>
          )}
        </div>

        {/* Right Panel — Preview */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
        }}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
            padding: 24, width: "100%", maxWidth: 640,
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
            }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Preview</h3>
              <span style={{ fontSize: 12, color: C.muted }}>1080 × 1080px</span>
            </div>
            <div style={{
              borderRadius: 14, overflow: "hidden", background: "#050009",
              aspectRatio: "1", width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${C.border}`,
            }}>
              {previewUrl ? (
                <img src={previewUrl} alt="Generated Ad" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>🖼️</div>
                  <p style={{ color: C.muted, fontSize: 15, margin: 0 }}>Fill in the details and click Generate</p>
                </div>
              )}
            </div>
          </div>

          {/* Discord CTA */}
          <div style={{
            marginTop: 24, padding: "18px 28px", borderRadius: 14,
            background: `linear-gradient(135deg, ${C.accent}, rgba(107,33,168,0.3))`,
            border: `1px solid ${C.border}`, textAlign: "center", width: "100%", maxWidth: 640,
            boxSizing: "border-box",
          }}>
            <p style={{ margin: 0, fontSize: 15, color: C.text }}>
              Join Our Growing Community:{" "}
              <a href="https://discord.gg/747CdAeYwm" target="_blank" rel="noopener noreferrer"
                style={{ color: C.lilac, fontWeight: 700, textDecoration: "none" }}>
                discord.gg/747CdAeYwm
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
    </div>
  );
}

/* ─── Root ─── */
export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("pt_auth") === "1") setUnlocked(true);
  }, []);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <AdGenerator />;
}
