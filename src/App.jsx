import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// SITE CONFIG
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  featuredMix: {
    platform: "mixcloud",
    soundcloudUrl: import.meta.env.VITE_SOUNDCLOUD_URL,
    mixcloudUrl: import.meta.env.VITE_MIXCLOUD_URL,
    label: "Now Playing",
  },
  showTagline: true,
  showLocation: true,
  showCoordinates: true, // DC lat/long
  tagline: "house · indie dance · disco",
  location: "washington dc",
  links: [
    { label: "soundcloud", slug: "soundcloud", url: import.meta.env.VITE_SOUNDCLOUD_LINK || "#", color: "#c45d3e" },
    { label: "mixcloud", slug: "mixcloud", url: import.meta.env.VITE_MIXCLOUD_LINK || "#", color: "#d4854a" },
    { label: "instagram", slug: "instagram", url: import.meta.env.VITE_INSTAGRAM_LINK || "#", color: "#7a9e8e" },
    { label: "tiktok", slug: "tiktok", url: import.meta.env.VITE_TIKTOK_LINK || "#", color: "#b8a088" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// BRAND ICON — Simple Icons CDN with text fallback
// ═══════════════════════════════════════════════════════════════
function BrandIcon({ slug, color, hovered, size = 20 }) {
  const [failed, setFailed] = useState(false);
  const accentColor = color.replace("#", "");
  const defaultColor = "f0ebe3";
  const fallbacks = { soundcloud: "SC", mixcloud: "MC", instagram: "IG", tiktok: "TT" };
  
  if (failed) {
    return (
      <span style={{
        fontSize: "11px", fontFamily: "'Space Mono', monospace", fontWeight: 700,
        color: hovered ? color : "#f0ebe3",
        opacity: hovered ? 1 : 0.6, transition: "all 0.35s ease", letterSpacing: "1px",
      }}>
        {fallbacks[slug] || slug.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${hovered ? accentColor : defaultColor}`}
      alt={slug} width={size} height={size}
      onError={() => setFailed(true)}
      style={{ opacity: hovered ? 1 : 0.6, transition: "opacity 0.35s ease" }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// PARTICLE FIELD
// ═══════════════════════════════════════════════════════════════
function ParticleField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      radius: 1 + Math.random() * 1.5,
      baseAlpha: 0.08 + Math.random() * 0.18,
      pulseSpeed: 0.008 + Math.random() * 0.02,
      pulseOffset: Math.random() * Math.PI * 2,
    }));
    
    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.08;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 133, 74, ${alpha})`; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(212, 133, 74, ${(1 - dist / 130) * 0.055})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);
  
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ═══════════════════════════════════════════════════════════════
// GRID + COORDINATES
// ═══════════════════════════════════════════════════════════════
function GridOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ opacity: 0.035 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f0ebe3" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {CONFIG.showCoordinates && (
        <>
          <span style={{
            position: "absolute", top: "15%", left: "5%",
            fontSize: "9px", fontFamily: "'Space Mono', monospace",
            color: "#f0ebe3", opacity: 0.06, letterSpacing: "2px",
          }}>38.9072° N</span>
          <span style={{
            position: "absolute", bottom: "20%", right: "5%",
            fontSize: "9px", fontFamily: "'Space Mono', monospace",
            color: "#f0ebe3", opacity: 0.06, letterSpacing: "2px",
          }}>77.0369° W</span>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WAVEFORM
// ═══════════════════════════════════════════════════════════════
function Waveform({ isActive }) {
  const barCount = 80;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "2px",
      height: "60px",
      width: "100%",
    }}>
      {Array.from({ length: barCount }).map((_, i) => {
        const raw = 14 + Math.sin(i * 0.4) * 10 + Math.cos(i * 0.7) * 7;
        const baseHeight = Math.max(8, raw);
        const delay = i * 0.04;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: "4px",
              borderRadius: "2px",
              height: `${baseHeight}px`,
              background: isActive
                ? "linear-gradient(180deg, #f0be78, #c45d3e)"
                : "#3a3530",
              opacity: isActive ? 0.85 : 0.4,
              animation: isActive ? `wavePulse 0.9s ease-in-out ${delay}s infinite alternate` : "none",
              transition: "all 0.6s ease",
            }}
          />
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LINK BUTTON
// ═══════════════════════════════════════════════════════════════
function LinkButton({ label, slug, url, color, index }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "16px 24px", borderRadius: "12px", textDecoration: "none",
        background: hovered ? `${color}15` : "#252220",
        border: `1px solid ${hovered ? `${color}60` : "#3a3530"}`,
        color: hovered ? color : "#f0ebe3",
        transition: "all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: hovered ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 8px 30px ${color}20` : "0 2px 8px rgba(0,0,0,0.2)",
        cursor: "pointer",
        animation: `fadeSlideUp 0.6s ease ${0.8 + index * 0.1}s both`,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
        width: "3px", height: hovered ? "60%" : "0%",
        background: color, borderRadius: "0 2px 2px 0", transition: "height 0.35s ease",
      }} />
      <div style={{ width: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BrandIcon slug={slug} color={color} hovered={hovered} />
      </div>
      <span style={{
        fontSize: "15px", fontFamily: "'Comfortaa', sans-serif",
        fontWeight: 600, letterSpacing: "1.5px", textTransform: "lowercase",
      }}>{label}</span>
      <span style={{
        marginLeft: "auto", fontSize: "14px",
        opacity: hovered ? 0.8 : 0.3,
        transition: "all 0.35s ease",
        transform: hovered ? "translateX(0)" : "translateX(-4px)",
        color: hovered ? color : "#f0ebe3",
      }}>→</span>
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [waveActive, setWaveActive] = useState(true);
  
  return (
    <>
      <ParticleField />
      <GridOverlay />
      
      <div style={{
        position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto",
        padding: "60px 24px 40px", minHeight: "100vh",
        display: "flex", flexDirection: "column",
      }}>
        
        {/* HERO */}
        <header style={{ textAlign: "center", marginBottom: (CONFIG.showTagline || CONFIG.showLocation) ? "28px" : "18px", paddingTop: "20px" }}>
          <h1 style={{
            fontFamily: "'Churchward Roundsquare', 'Comfortaa', sans-serif",
            fontWeight: 100,
            fontSize: "clamp(42px, 10vw, 64px)", lineHeight: 1.05,
            textTransform: "lowercase", letterSpacing: "6px", color: "#f0ebe3",
            animation: "heroReveal 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
          }}>
            camille<br /><span style={{ color: "#d4854a" }}>du bois</span>
          </h1>
          <div style={{
            width: "60px", height: "2px",
            background: "linear-gradient(90deg, transparent, #d4854a, transparent)",
            margin: "20px auto 16px", animation: "lineExpand 0.8s ease 0.5s both",
          }} />
          {CONFIG.showTagline && (
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: "11px",
              letterSpacing: "4px", textTransform: "lowercase", color: "#b8a088",
              animation: "taglineReveal 0.8s ease 0.6s both",
            }}>{CONFIG.tagline}</p>
          )}
          {CONFIG.showLocation && (
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: "9px",
              letterSpacing: "3px", textTransform: "lowercase", color: "#b8a088",
              opacity: 0.5, marginTop: "6px", animation: "taglineReveal 0.8s ease 0.8s both",
            }}>{CONFIG.location}</p>
          )}
        </header>
        
        {/* NOW PLAYING */}
        <section style={{ marginBottom: "40px", animation: "fadeSlideUp 0.6s ease 0.6s both" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "10px", marginBottom: "16px",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: waveActive ? "#d4854a" : "#3a3530",
              boxShadow: waveActive ? "0 0 10px #d4854a50" : "none",
              transition: "all 0.3s ease",
            }} />
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: "10px",
              letterSpacing: "3px", textTransform: "uppercase", color: "#b8a088",
            }}>{CONFIG.featuredMix.label}</span>
          </div>
          
          <div
            onClick={() => setWaveActive(!waveActive)}
            style={{ cursor: "pointer", marginBottom: "12px" }}
            title="Click to toggle waveform"
          >
            <Waveform isActive={waveActive} />
          </div>
          
          <div style={{
            background: "#252220", borderRadius: "12px",
            border: "1px solid #3a3530", overflow: "hidden", padding: "2px",
          }}>
            {CONFIG.featuredMix.platform === "soundcloud" ? (
              <iframe
                width="100%" height="120" scrolling="no" frameBorder="no"
                allow="autoplay" src={CONFIG.featuredMix.soundcloudUrl}
                style={{ borderRadius: "10px", display: "block", filter: "saturate(0.8) brightness(0.9)" }}
              />
            ) : (
              <iframe
                width="100%" height="120" frameBorder="0"
                allow="autoplay" src={CONFIG.featuredMix.mixcloudUrl}
                style={{ borderRadius: "10px", display: "block", filter: "saturate(0.8) brightness(0.9)" }}
              />
            )}
          </div>
        </section>
        
        {/* LINKS */}
        <section style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "60px" }}>
          {CONFIG.links.map((link, i) => (
            <LinkButton key={link.label} {...link} index={i} />
          ))}
        </section>
        
        {/* FOOTER */}
        <footer style={{
          marginTop: "auto", textAlign: "center", paddingBottom: "20px",
          animation: "fadeSlideUp 0.6s ease 1.2s both",
        }}>
          <div style={{ width: "40px", height: "1px", background: "#3a3530", margin: "0 auto 16px" }} />
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: "9px",
            letterSpacing: "2px", color: "#b8a088", opacity: 0.5, textTransform: "lowercase",
          }}>© camille du bois</p>
        </footer>
      </div>
    </>
  );
}
