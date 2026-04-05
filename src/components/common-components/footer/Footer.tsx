// components/Footer.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

/* ── SVG Social Icons ── */
const SocialIcons: Record<string, React.ReactNode> = {
  Facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  ),
  YouTube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────
   WORLD MAP + LOCATION PIN BACKGROUND
   Uses the provided Cloudinary map image as base.
   Equirectangular projection, viewBox 0 0 1000 500
   Sri Lanka / Colombo: lat=6.9336, lng=79.9799
     x = (79.9799 + 180) / 360 * 1000 ≈ 722
     y = (90 − 6.9336) / 180 * 500  ≈ 230
───────────────────────────────────────────────────────────── */
function WorldMapBg({ color }: { color: string }) {
  const pinX = 708;
  const pinY = 270;
  const mapUrl = "https://res.cloudinary.com/dkfonkmwr/image/upload/v1775363483/xvyrglfhzpwikucfudbe.png";

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Colour-tint the map to match theme primary */}
        <filter id="mapTint" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {/* Desaturate fully first */}
          <feColorMatrix type="saturate" values="0" result="grey" />
          {/* Blend with the theme color */}
          <feFlood floodColor={color} floodOpacity="0.55" result="flood" />
          <feBlend in="grey" in2="flood" mode="multiply" result="tinted" />
          <feComposite in="tinted" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Glow filter for pin */}
        <filter id="pinGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft glow halo behind pin area */}
        <radialGradient id="pinHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        {/* Dot grid overlay */}
        <pattern id="footerDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.8" fill={color} fillOpacity="0.12" />
        </pattern>
      </defs>

      {/* ── Map image — tinted to theme color at low opacity ── */}
      <image
        href={mapUrl}
        x="0" y="0"
        width="1000" height="500"
        preserveAspectRatio="xMidYMid slice"
        opacity="0.18"
        filter="url(#mapTint)"
      />

      {/* Dot grid on top for texture */}
      <rect width="1000" height="500" fill="url(#footerDots)" />

      {/* ── Pin area glow halo ── */}
      <ellipse cx={pinX} cy={pinY} rx="55" ry="40"
        fill="url(#pinHalo)" />

      {/* ── Pulse rings ── */}
      <circle cx={pinX} cy={pinY} r="8" fill={color} fillOpacity="0">
        <animate attributeName="r" values="8;38;8" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="fill-opacity" values="0.55;0;0.55" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx={pinX} cy={pinY} r="8" fill={color} fillOpacity="0">
        <animate attributeName="r" values="8;24;8" dur="3.2s" begin="0.9s" repeatCount="indefinite" />
        <animate attributeName="fill-opacity" values="0.45;0;0.45" dur="3.2s" begin="0.9s" repeatCount="indefinite" />
      </circle>

      {/* ── Pin drop shadow ── */}
      <circle cx={pinX} cy={pinY + 1} r="6" fill="#000" fillOpacity="0.4" />

      {/* ── Pin solid dot ── */}
      <circle cx={pinX} cy={pinY} r="6" fill={color} fillOpacity="1" filter="url(#pinGlow)" />
      <circle cx={pinX} cy={pinY} r="2.8" fill="#ffffff" fillOpacity="0.95" />

      {/* ── Label pill ── */}
      <g filter="url(#pinGlow)">
        <rect x={pinX + 11} y={pinY - 18} width="96" height="24" rx="7"
          fill="#0b0e14" fillOpacity="0.90"
          stroke={color} strokeOpacity="0.7" strokeWidth="0.9" />
        <text
          x={pinX + 59} y={pinY - 2}
          textAnchor="middle"
          style={{
            fontFamily: "'DM Sans', 'Syne', sans-serif",
            fontSize: "8.5px", fontWeight: 700,
            fill: color, letterSpacing: "0.10em",
          }}
        >
          COLOMBO, LK
        </text>
      </g>

      {/* ── Short connector line ── */}
      <line
        x1={pinX + 6} y1={pinY - 2}
        x2={pinX + 11} y2={pinY - 10}
        stroke={color} strokeOpacity="0.55" strokeWidth="0.9"
      />
    </svg>
  );
}

const Footer = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Twitter", href: "https://twitter.com" },
    { name: "YouTube", href: "https://youtube.com" },
  ];

  const companyLinks = [
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "/contact" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQs", href: "/faqs" },
    { name: "Our Blog", href: "/blog" },
  ];

  const usefulLinks = [
    { name: "About Us", href: "/about" },
    { name: "Terms & Condition", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Events", href: "/events" },
    { name: "Press", href: "/press" },
  ];

  /* ── Colours: always use dark background regardless of theme ── */
  const bg       = "#0e1117";
  const bgDeep   = "#080b10";
  const accent   = theme.primary;
  const txtMain  = "#e8eaf0";
  const txtMuted = "#7a8394";
  const divider  = "rgba(255,255,255,0.07)";

  /* ── Column header with orange bullet ── */
  const ColHeader = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      marginBottom: "22px",
    }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%",
        background: accent, flexShrink: 0,
        boxShadow: `0 0 8px ${accent}99`,
      }} />
      <span style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: "13px", letterSpacing: "0.10em",
        textTransform: "uppercase" as const, color: txtMain,
      }}>
        {children}
      </span>
    </div>
  );

  /* ── Animated link ── */
  const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
      <Link
        href={href}
        style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
          color: txtMuted, textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: "0px",
          transition: "color 0.2s, gap 0.2s, padding-left 0.2s",
          paddingLeft: "0px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = accent;
          e.currentTarget.style.paddingLeft = "6px";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = txtMuted;
          e.currentTarget.style.paddingLeft = "0px";
        }}
      >
        {children}
      </Link>
    </li>
  );

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap");

        .footer-social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: ${txtMuted};
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .footer-social-btn:hover {
          background: ${accent}22;
          border-color: ${accent}55;
          color: ${accent};
          transform: translateY(-3px);
        }

        .footer-subscribe-btn {
          padding: 14px 28px;
          border-radius: 999px;
          border: none;
          background: ${accent};
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: filter 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 18px ${accent}55;
        }
        .footer-subscribe-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-1px);
          box-shadow: 0 6px 24px ${accent}77;
        }

        .footer-email-input {
          flex: 1;
          padding: 14px 22px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: ${txtMain};
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          min-width: 0;
          transition: border-color 0.2s, background 0.2s;
          backdrop-filter: blur(4px);
        }
        .footer-email-input::placeholder { color: ${txtMuted}; }
        .footer-email-input:focus {
          border-color: ${accent}88;
          background: rgba(255,255,255,0.07);
        }

        @keyframes footerFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .footer-col {
          animation: footerFadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both;
        }
        .footer-col:nth-child(1) { animation-delay: 0.05s; }
        .footer-col:nth-child(2) { animation-delay: 0.12s; }
        .footer-col:nth-child(3) { animation-delay: 0.19s; }
        .footer-col:nth-child(4) { animation-delay: 0.26s; }
      `}</style>

      <footer style={{
        width: "100%", position: "relative", overflow: "hidden",
        background: bg,
        borderTop: `1px solid ${divider}`,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* World map + location pin background */}
        <WorldMapBg color={accent} />

        {/* Gradient fade at bottom */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `linear-gradient(to bottom, transparent 50%, ${bgDeep}cc 100%)`,
        }} />

        {/* ── NEWSLETTER SECTION ── */}
        <div style={{
          position: "relative", zIndex: 10,
          borderBottom: `1px solid ${divider}`,
        }}>
          <div style={{
            maxWidth: "1280px", margin: "0 auto",
            padding: "48px 32px",
            display: "flex",
            flexWrap: "wrap" as const,
            alignItems: "center",
            gap: "28px",
            justifyContent: "space-between",
          }}>
            {/* Left: headline */}
            <div style={{ flex: "1 1 320px" }}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(22px, 2.4vw, 34px)", letterSpacing: "-0.03em",
                color: txtMain, margin: 0, lineHeight: 1.2,
              }}>
                Join The <span style={{ color: accent }}>ITSulu</span> Experience
              </h2>
              <p style={{
                color: txtMuted, fontSize: "14px", lineHeight: 1.7,
                margin: "10px 0 0", maxWidth: "380px",
              }}>
                Duis autem vel eum iriure dolor in hendrerit in vulputate.
              </p>
            </div>

            {/* Right: form */}
            <form
              onSubmit={handleNewsletterSubmit}
              style={{
                flex: "1 1 340px", display: "flex", gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="footer-email-input"
              />
              <button type="submit" className="footer-subscribe-btn">
                Subscribe Now
              </button>
            </form>
          </div>

          {/* Thin accent lines at left and right edge of divider — matching screenshot */}
          <div style={{
            position: "absolute", bottom: "-1px", left: "32px",
            width: "32px", height: "2px", background: accent,
            borderRadius: "999px",
          }} />
          <div style={{
            position: "absolute", bottom: "-1px", right: "32px",
            width: "32px", height: "2px", background: accent,
            borderRadius: "999px",
          }} />
        </div>

        {/* ── MAIN COLUMNS ── */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{
            maxWidth: "1280px", margin: "0 auto",
            padding: "56px 32px 48px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
          }}>

            {/* Col 1: Logo + info */}
            <div className="footer-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Power icon as logo placeholder */}
                <div style={{
                  width: "38px", height: "38px", borderRadius: "10px",
                  background: `${accent}22`, border: `1.5px solid ${accent}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                    <line x1="12" y1="2" x2="12" y2="12" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "20px", color: txtMain, letterSpacing: "0.06em",
                }}>
                  ITSULU
                </span>
              </div>

              {/* Address + contact */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ color: txtMuted, fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  2307 Beverley Rd Brooklyn,<br />New York 11226 USA.
                </p>
                <a href="tel:+0700020005" style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: txtMuted, textDecoration: "none", fontSize: "13px",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = txtMuted)}
                >
                  <span style={{ color: accent, fontSize: "11px" }}>●</span>
                  <span><span style={{ color: accent }}>+07</span> 0 002 00 05</span>
                </a>
                <a href="mailto:info@mydomain.com" style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: txtMuted, textDecoration: "none", fontSize: "13px",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = txtMuted)}
                >
                  <span style={{ color: accent, fontSize: "11px" }}>●</span>
                  <span><span style={{ color: accent }}>Info</span>@mydomain.com</span>
                </a>
              </div>
            </div>

            {/* Col 2: Social */}
            <div className="footer-col" style={{ display: "flex", flexDirection: "column" }}>
              <ColHeader>Social</ColHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {socialLinks.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      color: txtMuted, textDecoration: "none", fontSize: "14px",
                      transition: "color 0.2s, padding-left 0.2s",
                      paddingLeft: "0px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = accent;
                      e.currentTarget.style.paddingLeft = "6px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = txtMuted;
                      e.currentTarget.style.paddingLeft = "0px";
                    }}
                  >
                    <span style={{ color: "inherit", display: "flex", alignItems: "center" }}>
                      {SocialIcons[s.name]}
                    </span>
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Col 3: Company */}
            <div className="footer-col" style={{ display: "flex", flexDirection: "column" }}>
              <ColHeader>Company</ColHeader>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {companyLinks.map((l) => <FooterLink key={l.name} href={l.href}>{l.name}</FooterLink>)}
              </ul>
            </div>

            {/* Col 4: Useful Links */}
            <div className="footer-col" style={{ display: "flex", flexDirection: "column" }}>
              <ColHeader>Useful Links</ColHeader>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {usefulLinks.map((l) => <FooterLink key={l.name} href={l.href}>{l.name}</FooterLink>)}
              </ul>
            </div>
          </div>
        </div>

        {/* ── COPYRIGHT BAR ── */}
        <div style={{
          position: "relative", zIndex: 10,
          borderTop: `1px solid ${divider}`,
          background: bgDeep,
        }}>
          <div style={{
            maxWidth: "1280px", margin: "0 auto",
            padding: "20px 32px",
            display: "flex", flexWrap: "wrap" as const,
            justifyContent: "space-between", alignItems: "center", gap: "12px",
          }}>
            <p style={{ color: txtMuted, fontSize: "13px", margin: 0 }}>
              ITSulu by{" "}
              <span style={{ color: accent, fontWeight: 600, cursor: "pointer" }}>
                bslthemes Team.
              </span>
            </p>
            <p style={{ color: txtMuted, fontSize: "13px", margin: 0 }}>
              © 2025 All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;