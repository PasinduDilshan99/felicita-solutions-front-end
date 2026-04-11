// components/contact-us-page/SocialMediaLinks.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ContactUsService } from "@/services/contactUsService";
import { SocialMedia } from "@/types/contact-us-types";
import Image from "next/image";

/* ─────────────────────────────────────────
   Platform config
───────────────────────────────────────── */
const PLATFORM_CONFIG: Record<string, {
  color: string;
  gradient: string;
  label: string;
  icon: React.ReactNode;
}> = {
  FACEBOOK: {
    color: "#1877F2",
    gradient: "linear-gradient(135deg, #1877F2 0%, #0C63D4 100%)",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  INSTAGRAM: {
    color: "#E4405F",
    gradient: "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  LINKEDIN: {
    color: "#0A66C2",
    gradient: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
      </svg>
    ),
  },
  TWITTER: {
    color: "#000000",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
    label: "X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  YOUTUBE: {
    color: "#FF0000",
    gradient: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  GITHUB: {
    color: "#6e5494",
    gradient: "linear-gradient(135deg, #6e5494 0%, #4a3566 100%)",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
};

const FALLBACK_SOCIALS: SocialMedia[] = [
  { id: 1, platform: "FACEBOOK",  url: "https://facebook.com/yourcompany",         iconUrl: "", displayOrder: 1 },
  { id: 2, platform: "INSTAGRAM", url: "https://instagram.com/yourcompany",        iconUrl: "", displayOrder: 2 },
  { id: 3, platform: "LINKEDIN",  url: "https://linkedin.com/company/yourcompany", iconUrl: "", displayOrder: 3 },
  { id: 4, platform: "TWITTER",   url: "https://twitter.com/yourcompany",          iconUrl: "", displayOrder: 4 },
  { id: 5, platform: "YOUTUBE",   url: "https://youtube.com/c/yourcompany",        iconUrl: "", displayOrder: 5 },
  { id: 6, platform: "GITHUB",    url: "https://github.com/yourcompany",           iconUrl: "", displayOrder: 6 },
];

/* ─────────────────────────────────────────
   Individual pill card
───────────────────────────────────────── */
const SocialPill = ({ social, index }: { social: SocialMedia; index: number }) => {
  const { theme } = useTheme();
  const cfg = PLATFORM_CONFIG[social.platform] ?? PLATFORM_CONFIG["LINKEDIN"];
  const [hovered, setHovered] = useState(false);
  const pillRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = pillRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 10;
    const y = ((e.clientY - top)  / height - 0.5) * 10;
    el.style.transform = `perspective(400px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px) scale(1.04)`;
  };

  const handleMouseLeave = () => {
    const el = pillRef.current;
    if (!el) return;
    el.style.transform = "perspective(400px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    setHovered(false);
  };

  return (
    <a
      ref={pillRef}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="social-pill-item"
      style={{
        /* staggered entrance — uses `animation-delay` via inline var */
        ["--delay" as string]: `${index * 0.08}s`,
        background: hovered ? cfg.gradient : theme.surface,
        border: `1px solid ${hovered ? "transparent" : theme.border}`,
        boxShadow: hovered
          ? `0 16px 40px -10px ${cfg.color}55, 0 0 0 1px ${cfg.color}30`
          : "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderRadius: "16px",
        padding: "14px 20px",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        willChange: "transform",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: hovered ? "rgba(255,255,255,0.2)" : `${cfg.color}18`,
          color: hovered ? "#fff" : cfg.color,
          transform: hovered ? "rotate(-6deg) scale(1.1)" : "rotate(0deg) scale(1)",
          transition: "all 0.3s ease",
        }}
      >
        {social.iconUrl ? (
          <div style={{ position: "relative", width: "20px", height: "20px" }}>
            <Image src={social.iconUrl} alt={social.platform} fill className="object-contain" />
          </div>
        ) : cfg.icon}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: hovered ? "#fff" : theme.text,
          transition: "color 0.3s ease",
          flex: 1,
        }}
      >
        {cfg.label}
      </span>

      {/* Arrow */}
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        style={{
          width: "14px",
          height: "14px",
          flexShrink: 0,
          color: hovered ? "rgba(255,255,255,0.7)" : theme.textSecondary,
          transform: hovered ? "translateX(3px)" : "translateX(0)",
          opacity: hovered ? 1 : 0.5,
          transition: "all 0.3s ease",
        }}
      >
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>

      {/* Shine */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />
    </a>
  );
};

/* ─────────────────────────────────────────
   Main
───────────────────────────────────────── */
const SocialMediaLinks = () => {
  const { theme } = useTheme();
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await ContactUsService.fetchSocialMediaData();
        if (error) setError(error);
        else if (data && data.length > 0) setSocialMedia(data);
        else setSocialMedia(FALLBACK_SOCIALS);
      } catch {
        setError("Failed to load social media links");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <SocialMediaSkeleton />;
  if (error)   return <SocialMediaError error={error} />;

  return (
    <section
      className="w-full py-24 px-4 relative overflow-hidden"
      style={{ background: theme.background }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "300px",
          borderRadius: "9999px",
          filter: "blur(80px)",
          pointerEvents: "none",
          opacity: 0.25,
          background: `radial-gradient(ellipse, ${theme.primary}60, transparent 70%)`,
        }}
      />

      {/* Dot grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${theme.border} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-14 sml-header">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              padding: "8px 16px",
              borderRadius: "9999px",
              marginBottom: "20px",
              backgroundColor: `${theme.primary}12`,
              color: theme.primary,
              border: `1px solid ${theme.primary}25`,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "9999px",
                backgroundColor: theme.primary,
                animation: "smPulse 2s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            Follow Along
          </span>

          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{
              color: theme.text,
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.1,
            }}
          >
            Stay{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary ?? theme.primary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Connected
            </span>
          </h2>

          <p
            className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            Follow us for travel inspiration, behind-the-scenes moments, and exclusive deals.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
            <div style={{ height: "1px", width: "48px", background: `linear-gradient(90deg, transparent, ${theme.primary})`, borderRadius: "9999px" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: theme.primary }} />
            <div style={{ height: "1px", width: "48px", background: `linear-gradient(90deg, ${theme.primary}, transparent)`, borderRadius: "9999px" }} />
          </div>
        </div>

        {/* ── Pills ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {socialMedia.map((s, i) => (
            <SocialPill key={s.id} social={s} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs mt-10 sml-footer"
          style={{ color: theme.textSecondary }}
        >
          Join our growing community across {socialMedia.length} platforms
        </p>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

        @keyframes smPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }

        @keyframes smReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sml-header {
          animation: smReveal 0.7s cubic-bezier(0.23,1,0.32,1) 0.05s both;
        }

        .sml-footer {
          animation: smReveal 0.6s ease 0.65s both;
        }

        .social-pill-item {
          animation: smReveal 0.55s cubic-bezier(0.23,1,0.32,1) var(--delay, 0s) both;
          transition:
            background 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
      `}</style>
    </section>
  );
};

/* ─────────────────────────────────────────
   Skeleton
───────────────────────────────────────── */
const SocialMediaSkeleton = () => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-24 px-4" style={{ background: theme.background }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <div className="h-5 w-28 mx-auto rounded-full animate-pulse" style={{ backgroundColor: `${theme.primary}25` }} />
          <div className="h-10 w-64 mx-auto rounded-xl animate-pulse" style={{ backgroundColor: `${theme.text}18` }} />
          <div className="h-4 w-80 mx-auto rounded-lg animate-pulse"  style={{ backgroundColor: `${theme.textSecondary}18` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div
              key={i}
              className="animate-pulse"
              style={{ height: "64px", borderRadius: "16px", backgroundColor: theme.surface }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   Error
───────────────────────────────────────── */
const SocialMediaError = ({ error }: { error: string | null }) => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-24 px-4 flex items-center justify-center" style={{ background: theme.background }}>
      <div className="text-center max-w-sm">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${theme.error ?? "#ef4444"}15`, color: theme.error ?? "#ef4444" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold mb-2" style={{ color: theme.text }}>
          {error ?? "Unable to load social links"}
        </h3>
        <p className="text-sm mb-5" style={{ color: theme.textSecondary }}>
          Please check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-transform duration-200"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          Retry
        </button>
      </div>
    </section>
  );
};

export default SocialMediaLinks;