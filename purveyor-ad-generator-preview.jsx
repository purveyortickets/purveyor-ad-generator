import { useState, useRef, useCallback, useEffect } from "react";

const C = {
  bg: "#0a0014", card: "#140025", accent: "#270052", purple: "#6b21a8",
  lilac: "#c084fc", pink: "#f0abfc", glow: "#a855f7", text: "#f3e8ff",
  muted: "#a78bfa", border: "#2e1065", input: "#1e0538",
};

const SOCIALS = [
  { label: "Website", url: "https://purveyortickets.vercel.app/", icon: "🌐" },
  { label: "𝕏 Main", url: "https://x.com/purveyor_ph", icon: "𝕏" },
  { label: "𝕏 Proofs", url: "https://x.com/purveyorproof", icon: "𝕏" },
  { label: "Facebook", url: "https://www.facebook.com/Purveyor.PH", icon: "📘" },
  { label: "Instagram", url: "https://www.instagram.com/purveyor_ph", icon: "📸" },
  { label: "TikTok", url: "https://www.tiktok.com/@purveyor_ph", icon: "🎵" },
];

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
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
  return new Promise((res, rej) => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => res(img); img.onerror = rej; img.src = src;
  });
}

function wrapText(ctx, text, maxW) {
  const words = text.split(" "); let line = ""; const lines = [];
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

async function generateAd(canvas, { eventImage, eventName, subtitle }) {
  const W = 1080, H = 1080;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // BG
  const bg = ctx.createRadialGradient(300, 200, 100, W/2, H/2, W);
  bg.addColorStop(0, "#1a0035"); bg.addColorStop(0.4, "#0f001f"); bg.addColorStop(1, "#05000d");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Glow spots
  [{ x: 180, y: 850, r: 220, c: "168,85,247" }, { x: 900, y: 200, r: 200, c: "192,132,252" }].forEach(g => {
    const gr = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
    gr.addColorStop(0, `rgba(${g.c},0.18)`); gr.addColorStop(1, `rgba(${g.c},0)`);
    ctx.fillStyle = gr; ctx.fillRect(g.x - g.r, g.y - g.r, g.r * 2, g.r * 2);
  });

  // Grid
  ctx.strokeStyle = "rgba(107,33,168,0.06)"; ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 60) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
  for (let i = 0; i < H; i += 60) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(W,i); ctx.stroke(); }

  // Logo + brand
  try {
    const logo = await loadImg("https://i.imgur.com/NaSV6Yt.png");
    const ls = 56, bt = "PURVEYOR TICKETS";
    ctx.font = "bold 28px 'Outfit', sans-serif";
    const bw = ctx.measureText(bt).width, tw = ls + 14 + bw, sx = (W - tw) / 2;
    ctx.save();
    ctx.beginPath(); ctx.arc(sx + ls/2, 50, ls/2 + 3, 0, Math.PI*2);
    ctx.fillStyle = "rgba(107,33,168,0.3)"; ctx.fill();
    ctx.beginPath(); ctx.arc(sx + ls/2, 50, ls/2, 0, Math.PI*2); ctx.clip();
    ctx.drawImage(logo, sx, 22, ls, ls); ctx.restore();
    ctx.fillStyle = "#f3e8ff"; ctx.font = "bold 28px 'Outfit', sans-serif";
    ctx.textAlign = "start"; ctx.textBaseline = "middle";
    ctx.fillText(bt, sx + ls + 14, 52);
  } catch { /* fallback */ }

  // Subheading
  ctx.textAlign = "center"; ctx.fillStyle = "#c084fc";
  ctx.font = "800 17px 'Outfit', sans-serif";
  ctx.fillText("T I C K E T   A S S I S T A N C E", W/2, 106);

  // Card
  const cx = 140, cy = 138, cw = W - 280, ch = 560, cr = 18;
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 10;
  drawRoundRect(ctx, cx, cy, cw, ch, cr); ctx.fillStyle = "#1a1a2e"; ctx.fill(); ctx.restore();
  drawRoundRect(ctx, cx, cy, cw, ch, cr); ctx.strokeStyle = "rgba(168,85,247,0.3)"; ctx.lineWidth = 1.5; ctx.stroke();

  if (eventImage) {
    ctx.save(); drawRoundRect(ctx, cx, cy, cw, ch, cr); ctx.clip();
    const ir = eventImage.width / eventImage.height, crr = cw / ch;
    let sx2=0,sy2=0,sw=eventImage.width,sh=eventImage.height;
    if (ir > crr) { sw = eventImage.height * crr; sx2 = (eventImage.width - sw)/2; }
    else { sh = eventImage.width / crr; sy2 = (eventImage.height - sh)/2; }
    ctx.drawImage(eventImage, sx2, sy2, sw, sh, cx, cy, cw, ch);
    const ov = ctx.createLinearGradient(cx, cy, cx, cy+ch);
    ov.addColorStop(0, "rgba(10,0,20,0.08)"); ov.addColorStop(1, "rgba(10,0,20,0.35)");
    ctx.fillStyle = ov; ctx.fillRect(cx, cy, cw, ch); ctx.restore();
  } else {
    ctx.save(); drawRoundRect(ctx, cx, cy, cw, ch, cr); ctx.clip();
    ctx.fillStyle = "#1a0035"; ctx.fillRect(cx, cy, cw, ch);
    ctx.fillStyle = "rgba(168,85,247,0.2)"; ctx.font = "bold 24px 'Outfit', sans-serif";
    ctx.textAlign = "center"; ctx.fillText("Upload Event Image", W/2, cy + ch/2); ctx.restore();
  }

  // Event name
  const ny = cy + ch + 48;
  ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.font = "800 38px 'Outfit', sans-serif";
  const nl = wrapText(ctx, eventName || "EVENT NAME", cw + 80);
  nl.forEach((l, i) => ctx.fillText(l, W/2, ny + i * 48));

  // Subtitle
  if (subtitle) {
    const sy3 = ny + nl.length * 48 + 8;
    ctx.fillStyle = "#c084fc"; ctx.font = "600 22px 'Outfit', sans-serif";
    wrapText(ctx, subtitle, cw + 80).forEach((l, i) => ctx.fillText(l, W/2, sy3 + i * 30));
  }

  // Social row
  const socY = H - 118;
  ctx.fillStyle = "rgba(107,33,168,0.12)"; ctx.fillRect(0, socY - 12, W, 48);
  ctx.fillStyle = "#a78bfa"; ctx.font = "500 15px 'Outfit', sans-serif";
  const socs = ["🌐 purveyortickets.vercel.app", "𝕏 @purveyor_ph", "📘 Purveyor.PH", "📸 @purveyor_ph", "🎵 @purveyor_ph"];
  const sp = W / (socs.length + 1);
  socs.forEach((s, i) => ctx.fillText(s, sp * (i + 1), socY + 12));

  // Discord
  ctx.fillStyle = "#f3e8ff"; ctx.font = "bold 20px 'Outfit', sans-serif";
  ctx.fillText("Join Our Growing Community: discord.gg/747CdAeYwm", W/2, H - 48);

  // Bottom line
  const lg2 = ctx.createLinearGradient(200, 0, W-200, 0);
  lg2.addColorStop(0, "transparent"); lg2.addColorStop(0.3, C.purple);
  lg2.addColorStop(0.7, C.lilac); lg2.addColorStop(1, "transparent");
  ctx.strokeStyle = lg2; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(200, H-15); ctx.lineTo(W-200, H-15); ctx.stroke();
  ctx.textAlign = "start";
}

export default function App() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [eventName, setEventName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const u = URL.createObjectURL(f); setImgUrl(u);
    const img = new Image(); img.onload = () => setImgObj(img); img.src = u;
  };

  const gen = useCallback(async () => {
    if (!canvasRef.current) return;
    setBusy(true);
    await new Promise(r => setTimeout(r, 150));
    await generateAd(canvasRef.current, { eventImage: imgObj, eventName, subtitle });
    setPreview(canvasRef.current.toDataURL("image/png"));
    setBusy(false);
  }, [imgObj, eventName, subtitle]);

  const dl = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview; a.download = `purveyor-${eventName.replace(/\s+/g,"-").toLowerCase()||"ad"}.png`; a.click();
  };

  const inp = {
    width: "100%", padding: "13px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
    background: C.input, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "'Outfit', sans-serif",
  };
  const lbl = { color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: 1 };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 10%, ${C.accent} 0%, ${C.bg} 50%)`, fontFamily: "'Outfit', sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://i.imgur.com/NaSV6Yt.png" alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "contain" }} />
          <div><div style={{ fontSize: 17, fontWeight: 700 }}>Purveyor Tickets</div><div style={{ fontSize: 11, color: C.muted }}>Ad Generator</div></div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SOCIALS.map(s => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{
              color: C.muted, fontSize: 11, textDecoration: "none", padding: "5px 8px", borderRadius: 7,
              border: `1px solid ${C.border}`, background: "rgba(30,5,56,0.5)", whiteSpace: "nowrap",
            }}>{s.icon} {s.label}</a>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, padding: 24, maxWidth: 1200, margin: "0 auto", flexWrap: "wrap" }}>
        {/* Form */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, width: 340, flexShrink: 0 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>Create Ad</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Event Name *</label>
            <input value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g. soft by LANY — The World Tour" style={inp} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Subtitle / Details</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Nov 6-14 • Philippines" style={inp} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Event Image *</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
            <div onClick={() => fileRef.current?.click()} style={{
              border: `2px dashed ${imgUrl ? C.glow : C.border}`, borderRadius: 12,
              padding: imgUrl ? 0 : "28px 16px", textAlign: "center", cursor: "pointer",
              background: imgUrl ? "transparent" : C.input, overflow: "hidden",
            }}>
              {imgUrl ? <img src={imgUrl} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block", borderRadius: 10 }} />
                : <><div style={{ fontSize: 32, marginBottom: 6 }}>📷</div><p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Click to upload</p></>}
            </div>
            {imgUrl && <button onClick={() => { setImgUrl(null); setImgObj(null); if(fileRef.current) fileRef.current.value=""; }}
              style={{ marginTop: 6, background: "none", border: "none", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>Remove</button>}
          </div>

          <button onClick={gen} disabled={busy} style={{
            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${C.purple}, ${C.glow})`, color: "#fff",
            fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: busy ? 0.6 : 1, marginBottom: 8,
            boxShadow: `0 4px 20px ${C.glow}33`,
          }}>{busy ? "Generating..." : "✨ Generate Ad"}</button>

          {preview && <button onClick={dl} style={{
            width: "100%", padding: "12px 0", borderRadius: 12, border: `1px solid ${C.glow}`,
            background: "transparent", color: C.lilac, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>⬇ Download PNG</button>}
        </div>

        {/* Preview */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Preview</span>
              <span style={{ fontSize: 11, color: C.muted }}>1080×1080</span>
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", background: "#050009", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}>
              {preview ? <img src={preview} alt="" style={{ width: "100%", height: "100%" }} />
                : <div style={{ textAlign: "center", padding: 32 }}>
                    <div style={{ fontSize: 40, opacity: 0.3, marginBottom: 8 }}>🖼️</div>
                    <p style={{ color: C.muted, fontSize: 14 }}>Fill in details & generate</p>
                  </div>}
            </div>
          </div>
          <div style={{ marginTop: 16, padding: "14px 20px", borderRadius: 12, background: `linear-gradient(135deg, ${C.accent}, rgba(107,33,168,0.3))`, border: `1px solid ${C.border}`, textAlign: "center" }}>
            <span style={{ fontSize: 14 }}>Join Our Growing Community: </span>
            <a href="https://discord.gg/747CdAeYwm" target="_blank" rel="noopener noreferrer" style={{ color: C.lilac, fontWeight: 700, textDecoration: "none" }}>discord.gg/747CdAeYwm</a>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
