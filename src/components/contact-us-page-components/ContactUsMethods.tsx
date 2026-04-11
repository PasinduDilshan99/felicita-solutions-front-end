// components/contact-us-page/ContactUsMethods.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ContactUsService } from "@/services/contactUsService";
import { ContactMethod } from "@/types/contact-us-types";
import Image from "next/image";

/* ─────────────────────────────────────────
   Icon map
───────────────────────────────────────── */
const ICONS: Record<string, React.ReactNode> = {
  PHONE: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  EMAIL: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  WHATSAPP: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  ADDRESS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

/* ─────────────────────────────────────────
   Accent colours per type
───────────────────────────────────────── */
const TYPE_ACCENT: Record<string, string> = {
  PHONE:    "#0ea5e9",  // sky
  EMAIL:    "#8b5cf6",  // violet
  WHATSAPP: "#22c55e",  // green
  ADDRESS:  "#f59e0b",  // amber
};

const FALLBACK_METHODS: ContactMethod[] = [
  { id: 1, type: "PHONE",    label: "Phone",          value: "+1 (555) 123-4567",                        link: "tel:+15551234567",           iconUrl: "", displayOrder: 1 },
  { id: 2, type: "EMAIL",    label: "Email",           value: "info@yourcompany.com",                     link: "mailto:info@yourcompany.com", iconUrl: "", displayOrder: 2 },
  { id: 3, type: "WHATSAPP", label: "WhatsApp",        value: "+1 (555) 123-4567",                        link: "https://wa.me/15551234567",   iconUrl: "", displayOrder: 3 },
  { id: 4, type: "ADDRESS",  label: "Office Address",  value: "123 Business Street, Tech City, TC 12345", link: null,                         iconUrl: "", displayOrder: 4 },
];

/* ─────────────────────────────────────────
   Card
───────────────────────────────────────── */
interface CardProps {
  method: ContactMethod;
  index: number;
}

const ContactCard = ({ method, index }: CardProps) => {
  const { theme } = useTheme();
  const accent = TYPE_ACCENT[method.type] ?? "#0ea5e9";
  const isLinkable = !!method.link && method.type !== "ADDRESS";
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;   // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-8px) scale(1.02)`;
    el.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  };

  const inner = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-inner relative h-full rounded-2xl p-7 flex flex-col gap-4 cursor-pointer overflow-hidden group"
      style={{
        background: `linear-gradient(145deg, ${theme.surface}f0 0%, ${theme.surface}cc 100%)`,
        border: `1px solid ${theme.border}`,
        transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s ease",
        willChange: "transform",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Shine overlay */}
      <div className="shine-overlay absolute inset-0 rounded-2xl pointer-events-none" />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full transition-all duration-500 group-hover:left-0 group-hover:right-0"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      {/* Glow blob */}
      <div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
        style={{ backgroundColor: accent }}
      />

      {/* Icon pill */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{
          background: `${accent}18`,
          color: accent,
          border: `1px solid ${accent}30`,
        }}
      >
        {method.iconUrl ? (
          <div className="relative w-6 h-6">
            <Image src={method.iconUrl} alt={method.type} fill className="object-contain" />
          </div>
        ) : (
          ICONS[method.type] ?? ICONS["PHONE"]
        )}
      </div>

      {/* Label */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: accent }}
        >
          {method.label}
        </p>
        <p
          className="text-base font-medium leading-snug break-words"
          style={{ color: theme.text }}
        >
          {method.value}
        </p>
      </div>

      {/* CTA row */}
      {isLinkable && (
        <div
          className="mt-auto flex items-center gap-1.5 text-sm font-semibold translate-x-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
          style={{ color: accent }}
        >
          <span>Connect now</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Bottom decorative dots */}
      <div className="absolute bottom-4 right-4 flex gap-1">
        {[0.3, 0.6, 1].map((o, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: accent, opacity: o }}
          />
        ))}
      </div>
    </div>
  );

  const wrapStyle: React.CSSProperties = {
    opacity: 0,
    animationName: "cardReveal",
    animationDuration: "0.7s",
    animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
    animationFillMode: "forwards",
    animationDelay: `${0.15 + index * 0.12}s`,
  };

  if (isLinkable && method.link) {
    return (
      <a
        key={method.id}
        href={method.link}
        target={method.type === "EMAIL" ? "_self" : "_blank"}
        rel={method.type !== "EMAIL" ? "noopener noreferrer" : ""}
        style={wrapStyle}
        className="block h-full"
      >
        {inner}
      </a>
    );
  }

  return (
    <div style={wrapStyle} className="h-full">
      {inner}
    </div>
  );
};

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const ContactUsMethods = () => {
  const { theme } = useTheme();
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactMethods = async () => {
      try {
        const { data, error } = await ContactUsService.fetchContactMethodsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setContactMethods(data);
        } else {
          setContactMethods(FALLBACK_METHODS);
        }
      } catch (err) {
        console.error("Error fetching contact methods:", err);
        setError("Failed to load contact methods");
      } finally {
        setLoading(false);
      }
    };
    fetchContactMethods();
  }, []);

  if (loading) return <ContactMethodsSkeleton />;
  if (error)   return <ContactMethodsError error={error} />;

  return (
    <section
      className="w-full py-24 px-4 relative overflow-hidden"
      style={{ background: theme.background }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className="orb orb-1 absolute rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${theme.primary}20` }}
      />
      <div
        className="orb orb-2 absolute rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${theme.secondary}18` }}
      />
      {/* fine grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-16" style={{ animation: "headerReveal 0.9s cubic-bezier(0.23,1,0.32,1) forwards", opacity: 0 }}>
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-5"
            style={{
              backgroundColor: `${theme.primary}12`,
              color: theme.primary,
              border: `1px solid ${theme.primary}25`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
            Get in Touch
          </span>

          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: theme.text, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Let's{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Connect
            </span>
          </h2>

          <p
            className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            Choose the channel that suits you best. We're always a message away.
          </p>

          {/* animated rule */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${theme.primary})` }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
            <div className="h-px w-12 rounded-full" style={{ background: `linear-gradient(90deg, ${theme.primary}, transparent)` }} />
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactMethods.map((method, i) => (
            <ContactCard key={method.id} method={method} index={i} />
          ))}
        </div>

        {/* ── Footer note ── */}
        <p
          className="text-center text-xs mt-10"
          style={{
            color: theme.textSecondary,
            opacity: 0,
            animation: "headerReveal 0.8s ease forwards 0.9s",
          }}
        >
          Our team typically responds within 24 hours during business days
        </p>
      </div>

      {/* ── Global styles ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

        @keyframes headerReveal {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }

        /* Floating orbs */
        .orb { position: absolute; border-radius: 9999px; pointer-events: none; }
        .orb-1 {
          width: 520px; height: 520px;
          top: -120px; left: -140px;
          animation: orbFloat1 14s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px; height: 400px;
          bottom: -80px; right: -100px;
          animation: orbFloat2 18s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, 20px) scale(1.06); }
          66%       { transform: translate(-20px, 40px) scale(0.96); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-40px, -30px) scale(1.08); }
        }

        /* Shine shimmer on card */
        .shine-overlay {
          background: radial-gradient(
            circle at var(--shine-x, 50%) var(--shine-y, 50%),
            rgba(255,255,255,0.07) 0%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card-inner:hover .shine-overlay { opacity: 1; }

        /* Magnetic card shadow */
        .card-inner:hover {
          box-shadow: 0 24px 60px -12px rgba(0,0,0,0.22);
        }
      `}</style>
    </section>
  );
};

/* ─────────────────────────────────────────
   Skeleton
───────────────────────────────────────── */
const ContactMethodsSkeleton = () => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-24 px-4" style={{ background: theme.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <div className="h-5 w-28 mx-auto rounded-full animate-pulse" style={{ backgroundColor: `${theme.primary}25` }} />
          <div className="h-10 w-72 mx-auto rounded-xl animate-pulse" style={{ backgroundColor: `${theme.text}18` }} />
          <div className="h-4 w-80 mx-auto rounded-lg animate-pulse"  style={{ backgroundColor: `${theme.textSecondary}18` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl p-7 animate-pulse" style={{ backgroundColor: theme.surface, height: 200 }}>
              <div className="w-12 h-12 rounded-xl mb-5" style={{ backgroundColor: `${theme.primary}25` }} />
              <div className="h-3 w-16 rounded mb-3" style={{ backgroundColor: `${theme.primary}25` }} />
              <div className="h-5 w-28 rounded"      style={{ backgroundColor: `${theme.text}20` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   Error
───────────────────────────────────────── */
const ContactMethodsError = ({ error }: { error: string | null }) => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-24 px-4 flex items-center justify-center" style={{ background: theme.background }}>
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: `${theme.error ?? "#ef4444"}15`, color: theme.error ?? "#ef4444" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: theme.text }}>
          {error ?? "Unable to load contact methods"}
        </h3>
        <p className="text-sm mb-6" style={{ color: theme.textSecondary }}>
          Please check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          Retry
        </button>
      </div>
    </section>
  );
};

export default ContactUsMethods;