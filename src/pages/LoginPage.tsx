"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { UNIQUE_CODE_NAME } from "@/utils/constant";
import { useTheme } from "@/context/ThemeContext";

/* ─── Aurora / Blob Background ─── */
function AuroraBackground({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blob 1 — top-left */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-15%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
          animation: "blobDrift1 14s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      {/* Blob 2 — bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
          animation: "blobDrift2 18s ease-in-out infinite",
          filter: "blur(50px)",
        }}
      />
      {/* Blob 3 — centre accent */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "30%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
          animation: "blobDrift3 10s ease-in-out infinite",
          filter: "blur(30px)",
        }}
      />
      {/* Subtle dot scatter */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {[
          [12,8],[88,22],[45,55],[70,80],[28,90],[60,35],[15,65],[80,48],[50,10],[35,75],
          [92,60],[5,40],[75,15],[55,88],[20,30],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={`${cx}%`}
            cy={`${cy}%`}
            r="1.5"
            fill={primaryColor}
            fillOpacity="0.25"
            style={{ animation: `dotPulse ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Node Network Illustration ─── */
function SoftwareArt({ primaryColor }: { primaryColor: string }) {
  const nodes = [
    { cx: 210, cy: 210, r: 14 }, // centre
    { cx: 210, cy: 80,  r: 7  },
    { cx: 330, cy: 150, r: 9  },
    { cx: 340, cy: 290, r: 7  },
    { cx: 210, cy: 350, r: 9  },
    { cx: 80,  cy: 290, r: 7  },
    { cx: 75,  cy: 150, r: 9  },
    { cx: 270, cy: 130, r: 5  },
    { cx: 310, cy: 220, r: 5  },
    { cx: 150, cy: 130, r: 5  },
    { cx: 105, cy: 220, r: 5  },
    { cx: 150, cy: 310, r: 5  },
    { cx: 270, cy: 310, r: 5  },
  ];
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,7],[2,7],[2,8],[3,8],[3,12],[4,12],[4,11],[5,11],[5,10],[6,10],[6,9],[1,9],
    [7,8],[8,12],[12,11],[11,10],[10,9],[9,7],
  ];
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[400px]"
      style={{ filter: `drop-shadow(0 0 55px ${primaryColor}35)` }}
    >
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeOpacity="0.28"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.28;0.55;0.28"
            dur={`${3 + (i % 5)}s`}
            begin={`${i * 0.22}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}

      {/* Travelling data packets along edges */}
      {[0,3,7,14,19].map((edgeIdx, i) => {
        const [a, b] = edges[edgeIdx];
        return (
          <circle key={`pkt-${i}`} r="3" fill={primaryColor} opacity="0.75">
            <animateMotion
              dur={`${2.5 + i * 0.8}s`}
              begin={`${i * 0.7}s`}
              repeatCount="indefinite"
              path={`M${nodes[a].cx},${nodes[a].cy} L${nodes[b].cx},${nodes[b].cy}`}
            />
          </circle>
        );
      })}

      {/* Node circles */}
      {nodes.map((n, i) => (
        <g key={i}>
          {/* Glow ring */}
          <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill={primaryColor} fillOpacity="0.08">
            <animate
              attributeName="r"
              values={`${n.r + 4};${n.r + 10};${n.r + 4}`}
              dur={`${2.5 + (i % 3)}s`}
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              values="0.08;0.18;0.08"
              dur={`${2.5 + (i % 3)}s`}
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Solid node */}
          <circle
            cx={n.cx} cy={n.cy} r={n.r}
            fill={i === 0 ? primaryColor : "none"}
            stroke={primaryColor}
            strokeWidth={i === 0 ? 0 : 1.8}
            fillOpacity={i === 0 ? 1 : 0.15}
            strokeOpacity="0.8"
          />
          {i === 0 && (
            <circle cx={n.cx} cy={n.cy} r={6} fill="white" fillOpacity="0.9" />
          )}
        </g>
      ))}

      {/* Outer pulse ring from centre */}
      <circle cx="210" cy="210" r="20" stroke={primaryColor} strokeWidth="1" fill="none">
        <animate attributeName="r" from="14" to="110" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ─── Eye Icons ─── */
const EyeOpen = () => (
  <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOff = () => (
  <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

/* ─── Loading screen ─── */
function SpinScreen({ label, bg, primary }: { label: string; bg: string; primary: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
      <div className="text-center">
        <div
          className="h-12 w-12 rounded-full border-4 border-transparent animate-spin mx-auto"
          style={{ borderTopColor: primary }}
        />
        <p className="mt-4 text-sm font-semibold uppercase tracking-widest" style={{ color: primary }}>
          {label}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   PAGE
══════════════════════════════ */
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { theme } = useTheme();

  /* hydration guard + session check */
  useEffect(() => {
    setIsClient(true);
    setUniqueCode(sessionStorage.getItem(UNIQUE_CODE_NAME));
  }, []);

  useEffect(() => {
    if (isClient && uniqueCode) router.push("/profile");
  }, [isClient, uniqueCode, router]);

  const handleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await login(username, password);
      router.back();
    } catch (err: unknown) {
      console.log(err);
      setError("Invalid credentials. Please check your username and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  if (!isClient) return <SpinScreen label="Loading…" bg={theme.background} primary={theme.primary} />;
  if (uniqueCode) return <SpinScreen label="Redirecting…" bg={theme.background} primary={theme.primary} />;

  /* ── Derived colours from theme ── */
  const {
    primary,
    background,
    surface,
    text,
    textSecondary,
    border,
    error: errorColor,
  } = theme;

  /* Left panel is always dark for contrast */
  const leftBg = "#0d0f12";
  const leftText = "#ffffff";

  return (
    <>
      <style global jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap");

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.05); }
          66%       { transform: translate(-20px, 25px) scale(0.95); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(-25px, 20px) scale(1.08); }
          70%       { transform: translate(20px, -15px) scale(0.96); }
        }
        @keyframes blobDrift3 {
          0%, 100% { transform: translate(0px, 0px); }
          50%       { transform: translate(15px, -18px); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%       { opacity: 0.7;  transform: scale(1.6); }
        }

        .fade-up      { animation: fadeUp  0.55s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-up-d1   { animation-delay: 0.08s; }
        .fade-up-d2   { animation-delay: 0.16s; }
        .fade-up-d3   { animation-delay: 0.24s; }
        .fade-up-d4   { animation-delay: 0.32s; }
        .fade-up-d5   { animation-delay: 0.40s; }
        .scale-in     { animation: scaleIn 0.6s cubic-bezier(.22,.68,0,1.2) both; }
        .float-art    { animation: floatY 6s ease-in-out infinite; }

        .input-field {
          width: 100%;
          border-radius: 12px;
          border: 1.5px solid ${border};
          padding: 14px 44px 14px 48px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          background: ${surface};
          color: ${text};
        }
        .input-field::placeholder { color: ${textSecondary}; opacity: 0.6; }
        .input-field:focus {
          border-color: ${primary};
          box-shadow: 0 0 0 4px ${primary}22;
          background: ${background};
        }
        .input-field:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-primary {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 15px 24px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.04em;
          cursor: pointer;
          background: ${primary};
          color: #ffffff;
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s, opacity 0.18s;
          box-shadow: 0 4px 20px ${primary}44;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px ${primary}55;
          filter: brightness(1.07);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid ${primary}55;
          background: ${primary}15;
          color: ${primary};
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div
        className="min-h-screen flex"
        style={{ fontFamily: "'DM Sans', sans-serif", background: background }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex lg:w-[52%] relative flex-col justify-between overflow-hidden"
          style={{ background: leftBg, padding: "56px 64px" }}
        >
          {/* Aurora background */}
          <AuroraBackground primaryColor={primary} />

          {/* Gradient blob */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${primary}22 0%, transparent 70%)`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Logo / Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center"
              style={{ background: primary }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" fill="white" fillOpacity="0.9" />
                <path d="M10 2v16M3 6l7 4 7-4" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "18px",
                color: leftText,
                letterSpacing: "-0.02em",
              }}
            >
              YourSoft<span style={{ color: primary }}>.</span>
            </span>
          </div>

          {/* Centred art */}
          <div className="relative z-10 flex items-center justify-center flex-1 py-12">
            <div className="float-art scale-in">
              <SoftwareArt primaryColor={primary} />
            </div>
          </div>

          {/* Copy */}
          <div className="relative z-10">
            <div className="badge-pill mb-5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: primary }}
              />
              Software Platform
            </div>

            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(30px, 3vw, 46px)",
                letterSpacing: "-0.035em",
                color: leftText,
                lineHeight: 1.1,
                marginBottom: "16px",
              }}
            >
              Build smarter.
              <br />
              <span style={{ color: primary }}>Ship faster.</span>
              <br />
              Scale better.
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "15px",
                lineHeight: 1.7,
                maxWidth: "380px",
                marginBottom: "36px",
              }}
            >
              Your all-in-one workspace for modern software teams — project management, analytics, and deployment in one place.
            </p>

            {/* Stats row */}
            <div
              className="grid grid-cols-3 gap-4"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: "28px",
              }}
            >
              {[
                { num: "99.9%", label: "Uptime SLA" },
                { num: "50K+", label: "Teams" },
                { num: "< 2s", label: "Response Time" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: "26px",
                      color: primary,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      color: "rgba(255,255,255,0.35)",
                      marginTop: "5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="w-full lg:w-[48%] flex items-center justify-center px-6 py-14"
          style={{ background: background }}
        >
          <div className="w-full max-w-[420px]">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-10">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: primary }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "16px",
                  color: text,
                }}
              >
                YourSoft<span style={{ color: primary }}>.</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-9 fade-up">
              <p
                className="badge-pill mb-4"
                style={{ color: primary, borderColor: `${primary}44`, background: `${primary}12` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: primary }} />
                Welcome back
              </p>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3vw, 40px)",
                  letterSpacing: "-0.035em",
                  color: text,
                  lineHeight: 1.1,
                  marginBottom: "10px",
                }}
              >
                Sign in to your
                <br />
                <span style={{ color: primary }}>workspace</span>
              </h1>
              <p style={{ color: textSecondary, fontSize: "15px", lineHeight: 1.6 }}>
                Access dashboards, projects, and team tools from one place.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6 text-sm font-semibold fade-up"
                style={{
                  background: `${errorColor}12`,
                  border: `1.5px solid ${errorColor}44`,
                  color: errorColor,
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <div className="flex flex-col gap-5">

              {/* Username */}
              <div className="fade-up fade-up-d1">
                <label
                  htmlFor="username"
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: textSecondary,
                    marginBottom: "8px",
                  }}
                >
                  Username or Email
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: textSecondary }}
                  >
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    placeholder="you@company.com"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="input-field"
                    style={{ paddingLeft: "48px", paddingRight: "16px" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="fade-up fade-up-d2">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: textSecondary,
                    }}
                  >
                    Password
                  </label>
                  <Link
                    href="/password-reset"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: primary,
                      textDecoration: "none",
                      opacity: 0.85,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: textSecondary }}
                  >
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="input-field"
                    style={{ paddingLeft: "48px", paddingRight: "48px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: textSecondary,
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5 fade-up fade-up-d3">
                <input
                  id="remember"
                  type="checkbox"
                  style={{
                    accentColor: primary,
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="remember"
                  style={{ fontSize: "13px", fontWeight: 500, color: textSecondary, cursor: "pointer" }}
                >
                  Keep me signed in for 30 days
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              className="btn-primary fade-up fade-up-d4 mt-7"
              onClick={handleLogin}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  Sign In
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4 fade-up fade-up-d4">
              <div className="flex-1 h-px" style={{ background: border }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: textSecondary, letterSpacing: "0.08em" }}>
                OR
              </span>
              <div className="flex-1 h-px" style={{ background: border }} />
            </div>

            {/* SSO Button */}
            <button
              className="fade-up fade-up-d4"
              style={{
                width: "100%",
                border: `1.5px solid ${border}`,
                borderRadius: "12px",
                padding: "14px 24px",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                background: surface,
                color: text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = primary;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${primary}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={primary} strokeWidth="2" />
                <path d="M12 8v4l3 3" stroke={primary} strokeWidth="2" strokeLinecap="round" />
              </svg>
              Continue with SSO
            </button>

            {/* Register */}
            <p
              className="text-center mt-8 fade-up fade-up-d5"
              style={{ fontSize: "14px", color: textSecondary }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                style={{
                  color: primary,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Create a free account →
              </Link>
            </p>

            {/* Footer legal */}
            <p
              className="text-center mt-6 fade-up fade-up-d5"
              style={{ fontSize: "11px", color: textSecondary, opacity: 0.55, lineHeight: 1.6 }}
            >
              By signing in, you agree to our{" "}
              <Link href="/terms" style={{ color: textSecondary, textDecoration: "underline" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" style={{ color: textSecondary, textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}