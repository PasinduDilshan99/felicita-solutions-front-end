"use client";
import { themes, useTheme } from "@/context/ThemeContext";
import React, { useState, useEffect, useRef } from "react";

/* ── Palette icon ── */
const PaletteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

/* ── Close icon ── */
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

/* ── Check icon ── */
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* ── Theme meta — display names & descriptions ── */
const themeMeta: Record<string, { label: string; desc: string }> = {
  light:  { label: "Light",  desc: "Clean & minimal" },
  dark:   { label: "Dark",   desc: "Easy on the eyes" },
  blue:   { label: "Ocean",  desc: "Cool & focused" },
  green:  { label: "Forest", desc: "Natural & calm" },
  purple: { label: "Violet", desc: "Creative & bold" },
  orange: { label: "Ember",  desc: "Warm & energetic" },
};

const ThemePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColorInput, setCustomColorInput] = useState("#3b82f6");
  const [hovered, setHovered] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { themeName, setTheme, customColor, setCustomColor, availableThemes, theme } = useTheme();

  const currentColor = customColor ?? themes[themeName as keyof typeof themes]?.primary ?? "#3b82f6";

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleThemeSelect = (t: string) => { setTheme(t); };
  const handleCustomApply = () => { setCustomColor(customColorInput); };
  const handleReset = () => { setCustomColor(null); };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap");

        /* ── Trigger button ── */
        .tp-trigger {
          position: fixed;
          left: 20px;
          bottom: 28px;
          z-index: 1100;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
          background: ${currentColor};
          box-shadow: 0 4px 18px ${currentColor}55;
          color: #fff;
          outline: none;
        }
        .tp-trigger:hover {
          transform: scale(1.08) rotate(18deg);
          box-shadow: 0 6px 24px ${currentColor}77;
        }
        .tp-trigger.open {
          transform: scale(1.05) rotate(45deg);
        }

        /* ── Overlay ── */
        .tp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(3px);
          z-index: 1050;
          opacity: 0;
          animation: overlayIn 0.28s ease forwards;
        }
        @keyframes overlayIn {
          to { opacity: 1; }
        }
        .tp-overlay.closing {
          animation: overlayOut 0.22s ease forwards;
        }
        @keyframes overlayOut {
          to { opacity: 0; }
        }

        /* ── Side Panel ── */
        .tp-panel {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 320px;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          background: ${theme.surface};
          box-shadow: 6px 0 40px rgba(0,0,0,0.18);
          transform: translateX(-100%);
          animation: panelSlideIn 0.32s cubic-bezier(.22,.68,0,1.2) forwards;
          overflow: hidden;
        }
        @keyframes panelSlideIn {
          to { transform: translateX(0); }
        }
        .tp-panel.closing {
          animation: panelSlideOut 0.24s cubic-bezier(.55,0,1,.45) forwards;
        }
        @keyframes panelSlideOut {
          to { transform: translateX(-100%); }
        }

        /* ── Panel header ── */
        .tp-header {
          padding: 28px 24px 20px;
          border-bottom: 1px solid ${theme.border};
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        /* ── Scrollable content ── */
        .tp-body {
          flex: 1;
          overflow-y: auto;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          gap: 26px;
          scrollbar-width: thin;
          scrollbar-color: ${currentColor}44 transparent;
        }
        .tp-body::-webkit-scrollbar { width: 4px; }
        .tp-body::-webkit-scrollbar-thumb { background: ${currentColor}55; border-radius: 4px; }

        /* ── Section label ── */
        .tp-section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: ${theme.textSecondary};
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tp-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: ${theme.border};
        }

        /* ── Theme card ── */
        .tp-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 13px;
          border-radius: 12px;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .tp-card:hover {
          background: ${theme.background};
          transform: translateX(3px);
        }
        .tp-card.active {
          border-color: ${currentColor}60;
          background: ${currentColor}0e;
        }

        /* ── Swatch ── */
        .tp-swatch {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .tp-card:hover .tp-swatch,
        .tp-card.active .tp-swatch {
          transform: scale(1.08);
        }

        /* ── Custom color input wrapper ── */
        .tp-color-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tp-color-input {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1.5px solid ${theme.border};
          cursor: pointer;
          padding: 2px;
          background: none;
          flex-shrink: 0;
        }
        .tp-apply-btn {
          flex: 1;
          height: 42px;
          border: none;
          border-radius: 10px;
          background: ${currentColor};
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: filter 0.2s, transform 0.15s;
          box-shadow: 0 3px 12px ${currentColor}44;
        }
        .tp-apply-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        /* ── Reset btn ── */
        .tp-reset-btn {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: 1.5px solid ${theme.border};
          background: transparent;
          color: ${theme.textSecondary};
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
        }
        .tp-reset-btn:hover {
          background: ${currentColor}12;
          color: ${currentColor};
          border-color: ${currentColor}55;
        }

        /* ── Close button ── */
        .tp-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          border: none;
          background: ${theme.background};
          color: ${theme.textSecondary};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s, color 0.18s, transform 0.18s;
        }
        .tp-close-btn:hover {
          background: ${currentColor}18;
          color: ${currentColor};
          transform: scale(1.08);
        }

        /* ── Active indicator dot ── */
        @keyframes dotPop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        .tp-active-dot {
          animation: dotPop 0.2s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ── Footer ── */
        .tp-footer {
          padding: 16px 20px;
          border-top: 1px solid ${theme.border};
          flex-shrink: 0;
        }

        /* ── Preview bar at top of panel ── */
        .tp-preview-bar {
          height: 4px;
          background: linear-gradient(90deg, ${currentColor}, ${currentColor}88);
          border-radius: 0 0 4px 4px;
          transition: background 0.3s;
          flex-shrink: 0;
        }

        /* Cards staggered entry */
        @keyframes cardIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .tp-card-animated {
          opacity: 0;
          animation: cardIn 0.3s cubic-bezier(.22,.68,0,1.2) forwards;
        }
      `}</style>

      {/* ── Floating trigger button ── */}
      <button
        className={`tp-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Appearance Settings"
        aria-label="Open theme settings"
      >
        <PaletteIcon />
      </button>

      {/* ── Overlay + Panel ── */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="tp-overlay" onClick={() => setIsOpen(false)} />

          {/* Side panel */}
          <div className="tp-panel" ref={panelRef} role="dialog" aria-label="Theme settings panel">

            {/* Accent bar at top */}
            <div className="tp-preview-bar" />

            {/* Header */}
            <div className="tp-header">
              <div>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "18px", color: theme.text, letterSpacing: "-0.02em",
                  lineHeight: 1.1, marginBottom: "3px",
                }}>
                  Appearance
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                  color: theme.textSecondary, fontWeight: 500,
                }}>
                  Personalise your workspace
                </div>
              </div>
              <button className="tp-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="tp-body">

              {/* Active theme preview */}
              <div style={{
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${currentColor}18 0%, ${currentColor}08 100%)`,
                border: `1.5px solid ${currentColor}30`,
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: currentColor,
                  boxShadow: `0 4px 14px ${currentColor}55`,
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    fontSize: "14px", color: theme.text,
                  }}>
                    {customColor ? "Custom Color" : (themeMeta[themeName]?.label ?? themeName)}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                    color: theme.textSecondary, marginTop: "2px",
                  }}>
                    {customColor ? currentColor : (themeMeta[themeName]?.desc ?? "Active theme")}
                  </div>
                </div>
                <div style={{
                  marginLeft: "auto",
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: currentColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CheckIcon />
                </div>
              </div>

              {/* Preset themes */}
              <div>
                <div className="tp-section-label">Preset Themes</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {availableThemes.map((t, i) => {
                    const meta = themeMeta[t];
                    const tPrimary = themes[t as keyof typeof themes]?.primary;
                    const isActive = themeName === t && !customColor;
                    return (
                      <button
                        key={t}
                        className={`tp-card ${isActive ? "active" : ""} tp-card-animated`}
                        style={{ animationDelay: `${i * 0.045}s` }}
                        onClick={() => handleThemeSelect(t)}
                        onMouseEnter={() => setHovered(t)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {/* Swatch */}
                        <div className="tp-swatch" style={{ background: `${tPrimary}20` }}>
                          <div style={{
                            width: "22px", height: "22px", borderRadius: "7px",
                            background: tPrimary,
                            boxShadow: `0 2px 8px ${tPrimary}55`,
                          }} />
                        </div>

                        {/* Labels */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            fontSize: "13px", color: theme.text,
                          }}>
                            {meta?.label ?? t}
                          </div>
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
                            color: theme.textSecondary, marginTop: "1px",
                          }}>
                            {meta?.desc ?? ""}
                          </div>
                        </div>

                        {/* Active dot */}
                        {isActive && (
                          <div className="tp-active-dot" style={{
                            width: "8px", height: "8px", borderRadius: "50%",
                            background: tPrimary,
                            boxShadow: `0 0 6px ${tPrimary}`,
                          }} />
                        )}

                        {/* Hover mini preview */}
                        {hovered === t && !isActive && (
                          <div style={{
                            width: "6px", borderRadius: "3px",
                            alignSelf: "stretch",
                            background: tPrimary,
                            opacity: 0.5,
                            marginLeft: "4px",
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom color */}
              <div>
                <div className="tp-section-label">Custom Color</div>
                <div style={{
                  borderRadius: "14px", border: `1.5px solid ${theme.border}`,
                  background: theme.background, padding: "14px", display: "flex",
                  flexDirection: "column", gap: "12px",
                }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                    color: theme.textSecondary, fontWeight: 500,
                  }}>
                    Pick any brand color to match your preferences
                  </div>
                  <div className="tp-color-row">
                    <input
                      type="color"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      className="tp-color-input"
                      title="Pick a color"
                    />
                    {/* Live preview swatch */}
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "10px",
                      background: customColorInput,
                      border: `1.5px solid ${theme.border}`,
                      flexShrink: 0,
                      boxShadow: `0 2px 10px ${customColorInput}44`,
                      transition: "background 0.2s, box-shadow 0.2s",
                    }} />
                    <button className="tp-apply-btn" onClick={handleCustomApply}
                      style={{ background: customColorInput, boxShadow: `0 3px 12px ${customColorInput}44` }}>
                      Apply Color
                    </button>
                  </div>
                  {/* Hex display */}
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
                    color: theme.textSecondary, textAlign: "center",
                    letterSpacing: "0.08em",
                  }}>
                    {customColorInput.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Reset — only when custom active */}
              {customColor && (
                <button className="tp-reset-btn" onClick={handleReset}>
                  ↩ Reset to {themeMeta[themeName]?.label ?? themeName} theme
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="tp-footer">
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
                color: theme.textSecondary, textAlign: "center", lineHeight: 1.6,
              }}>
                Theme preference is saved automatically
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ThemePicker;