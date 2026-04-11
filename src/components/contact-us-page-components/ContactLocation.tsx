// components/contact-us-page/ContactLocation.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

/* ─────────────────────────────────────────
   Config — swap these for your real values
───────────────────────────────────────── */
const LOCATION = {
  name:      "Felicita Trips",
  address:   "99 Caven Point Rd",
  city:      "Jersey City, NJ 07305",
  country:   "USA",
  phone:     "+1 (555) 123-4567",
  email:     "hello@felicitatrips.com",
  // Google Maps embed URL — replace YOUR_API_KEY and the q= param with your address
  mapSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.6!2d-74.074!3d40.671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250c6c2c3f5a5%3A0x1234!2s99+Caven+Point+Rd%2C+Jersey+City%2C+NJ+07305!5e1!3m2!1sen!2sus!4v1700000000000",
  googleMapsLink: "https://maps.google.com/?q=99+Caven+Point+Rd+Jersey+City+NJ",
};

/* ─────────────────────────────────────────
   Icons
───────────────────────────────────────── */
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 3H17M17 3V9M17 3L9 11M7 5H5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2" />
  </svg>
);

const DirectionsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 011-1h5V7.5l3.5 3.5-3.5 3.5z"/>
  </svg>
);

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const ContactLocation = () => {
  const { theme } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer — trigger entrance only when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCardVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{ background: theme.background }}
    >
      {/* ── Section label above map ── */}
      <div
        className="relative z-10 px-6 pt-16 pb-6 text-center section-header"
        style={{ animationPlayState: cardVisible ? "running" : "paused" }}
      >
        <span
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4"
          style={{
            backgroundColor: `${theme.primary}12`,
            color: theme.primary,
            border: `1px solid ${theme.primary}25`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
          Find Us
        </span>

        <h2
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{
            color: theme.text,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Our{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Location
          </span>
        </h2>
      </div>

      {/* ── Map wrapper ── */}
      <div className="relative w-full" style={{ height: "520px" }}>

        {/* Skeleton shimmer while map loads */}
        {!mapLoaded && (
          <div
            className="absolute inset-0 z-10 skeleton-shimmer"
            style={{ backgroundColor: theme.surface }}
          />
        )}

        {/* Actual iframe */}
        <iframe
          src={LOCATION.mapSrc}
          title="Our Location"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
          style={{
            filter: "grayscale(30%) contrast(1.05)",
            opacity: mapLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
          allowFullScreen
        />

        {/* Top gradient fade for depth */}
        <div
          className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to bottom, ${theme.background}60, transparent)`,
          }}
        />

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to top, ${theme.background}80, transparent)`,
          }}
        />

        {/* ── Floating address card (top-left, mirrors the screenshot) ── */}
        <div
          className="address-card absolute top-5 left-5 z-20 rounded-2xl overflow-hidden"
          style={{
            animationPlayState: cardVisible ? "running" : "paused",
            width: "260px",
            background: `${theme.surface}f2`,
            border: `1px solid ${theme.border}`,
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {/* Card top accent */}
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
            }}
          />

          <div className="p-4">
            {/* Business name */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3
                  className="font-bold text-sm leading-tight"
                  style={{ color: theme.text, fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {LOCATION.name}
                </h3>
                <div
                  className="flex items-center gap-1 mt-0.5"
                  style={{ color: theme.primary }}
                >
                  <PinIcon />
                  <span className="text-xs font-medium">Our Office</span>
                </div>
              </div>

              {/* Open in Maps icon button */}
              <a
                href={LOCATION.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}25`,
                }}
                title="Open in Google Maps"
              >
                <ExternalLinkIcon />
              </a>
            </div>

            {/* Divider */}
            <div className="h-px w-full mb-3" style={{ backgroundColor: theme.border }} />

            {/* Address lines */}
            <div className="space-y-1 mb-4">
              <p className="text-xs font-semibold" style={{ color: theme.text }}>
                {LOCATION.address}
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {LOCATION.city}
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {LOCATION.country}
              </p>
            </div>

            {/* Get Directions CTA */}
            <a
              href={LOCATION.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="directions-btn flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary ?? theme.primary})`,
                color: "#fff",
              }}
            >
              <DirectionsIcon />
              Get Directions
            </a>
          </div>
        </div>

        {/* ── Coordinates badge (bottom-right) ── */}
        <div
          className="coords-badge absolute bottom-6 right-5 z-20 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: `${theme.surface}e0`,
            border: `1px solid ${theme.border}`,
            color: theme.textSecondary,
            backdropFilter: "blur(8px)",
            animationPlayState: cardVisible ? "running" : "paused",
          }}
        >
          40.671°N · 74.074°W
        </div>
      </div>

      {/* ── Info strip below map ── */}
      <div
        className="relative z-10 px-6 py-8 info-strip"
        style={{ animationPlayState: cardVisible ? "running" : "paused" }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8">

          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              label: "Address",
              value: `${LOCATION.address}, ${LOCATION.city}`,
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              ),
              label: "Phone",
              value: LOCATION.phone,
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              label: "Email",
              value: LOCATION.email,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 info-item"
              style={{ animationDelay: `${0.5 + i * 0.12}s`, animationPlayState: cardVisible ? "running" : "paused" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.primary }}>
                  {item.label}
                </p>
                <p className="text-sm" style={{ color: theme.text }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Styles ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

        /* Section header entrance */
        .section-header {
          opacity: 0;
          animation: revealUp 0.8s cubic-bezier(0.23,1,0.32,1) forwards;
          animation-play-state: paused;
        }

        /* Floating address card */
        .address-card {
          opacity: 0;
          animation: cardSlideIn 0.7s cubic-bezier(0.23,1,0.32,1) 0.3s forwards;
          animation-play-state: paused;
        }

        /* Coords badge */
        .coords-badge {
          opacity: 0;
          animation: revealUp 0.6s ease 0.6s forwards;
          animation-play-state: paused;
        }

        /* Info strip */
        .info-strip {
          opacity: 0;
          animation: revealUp 0.7s ease 0.45s forwards;
          animation-play-state: paused;
        }

        /* Individual info items */
        .info-item {
          opacity: 0;
          animation: revealUp 0.6s ease forwards;
          animation-play-state: paused;
        }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateX(-24px) translateY(12px); }
          to   { opacity: 1; transform: translateX(0) translateY(0); }
        }

        /* Skeleton shimmer */
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            var(--skeleton-base, #e2e8f0) 25%,
            var(--skeleton-highlight, #f8fafc) 50%,
            var(--skeleton-base, #e2e8f0) 75%
          );
          background-size: 400% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 100% 50%; }
          100% { background-position:   0% 50%; }
        }

        /* Directions button hover glow */
        .directions-btn:hover {
          box-shadow: 0 4px 20px -4px rgba(0,0,0,0.25);
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
};

export default ContactLocation;