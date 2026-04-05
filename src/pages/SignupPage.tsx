"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

/* ══════════════════════════════════════════
   ICON HELPERS
══════════════════════════════════════════ */
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

/* ─── Aurora / Blob Background (same as LoginPage) ─── */
function AuroraBackground({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div style={{
        position: "absolute", top: "-10%", left: "-15%",
        width: "500px", height: "500px", borderRadius: "50%",
        background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
        animation: "blobDrift1 14s ease-in-out infinite", filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", right: "-10%",
        width: "440px", height: "440px", borderRadius: "50%",
        background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
        animation: "blobDrift2 18s ease-in-out infinite", filter: "blur(50px)",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "25%",
        width: "260px", height: "260px", borderRadius: "50%",
        background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
        animation: "blobDrift3 10s ease-in-out infinite", filter: "blur(30px)",
      }} />
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {[
          [10,12],[82,18],[40,50],[68,78],[25,88],[58,32],[18,60],[76,44],[48,8],[32,70],
          [90,55],[6,38],[72,12],[52,85],[22,28],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="1.5"
            fill={primaryColor} fillOpacity="0.22"
            style={{ animation: `dotPulse ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Signup Illustration: branching workflow / user-onboarding graph ─── */
function SignupArt({ primaryColor }: { primaryColor: string }) {
  // A tree-like structure representing account creation steps
  const nodes = [
    { cx: 130, cy: 200, r: 16, label: "YOU" },  // root
    { cx: 60,  cy: 120, r: 9  },
    { cx: 130, cy: 100, r: 9  },
    { cx: 200, cy: 120, r: 9  },
    { cx: 35,  cy: 55,  r: 6  },
    { cx: 80,  cy: 50,  r: 6  },
    { cx: 130, cy: 45,  r: 6  },
    { cx: 180, cy: 50,  r: 6  },
    { cx: 225, cy: 55,  r: 6  },
    { cx: 60,  cy: 285, r: 7  },
    { cx: 130, cy: 295, r: 7  },
    { cx: 200, cy: 285, r: 7  },
  ];
  const edges = [
    [0,1],[0,2],[0,3],
    [1,4],[1,5],[2,6],[3,7],[3,8],
    [0,9],[0,10],[0,11],
  ];
  // Packet paths for animated data
  const packets = [
    { from: 0, to: 1 }, { from: 0, to: 3 }, { from: 2, to: 6 },
    { from: 0, to: 10 }, { from: 3, to: 8 },
  ];

  return (
    <svg
      viewBox="0 0 260 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[280px]"
      style={{ filter: `drop-shadow(0 0 40px ${primaryColor}30)` }}
    >
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.28"
        >
          <animate attributeName="stroke-opacity"
            values="0.28;0.55;0.28"
            dur={`${3.5 + (i % 4)}s`}
            begin={`${i * 0.25}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}

      {/* Travelling data packets */}
      {packets.map((pkt, i) => (
        <circle key={`pkt-${i}`} r="2.5" fill={primaryColor} opacity="0.8">
          <animateMotion
            dur={`${2 + i * 0.6}s`}
            begin={`${i * 0.5}s`}
            repeatCount="indefinite"
            path={`M${nodes[pkt.from].cx},${nodes[pkt.from].cy} L${nodes[pkt.to].cx},${nodes[pkt.to].cy}`}
          />
        </circle>
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          {/* Pulse glow */}
          <circle cx={n.cx} cy={n.cy} r={n.r + 5} fill={primaryColor} fillOpacity="0.07">
            <animate attributeName="r"
              values={`${n.r + 3};${n.r + 9};${n.r + 3}`}
              dur={`${2.5 + (i % 3)}s`} begin={`${i * 0.28}s`}
              repeatCount="indefinite"
            />
            <animate attributeName="fill-opacity"
              values="0.07;0.18;0.07"
              dur={`${2.5 + (i % 3)}s`} begin={`${i * 0.28}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Node body */}
          <circle cx={n.cx} cy={n.cy} r={n.r}
            fill={i === 0 ? primaryColor : "none"}
            stroke={primaryColor}
            strokeWidth={i === 0 ? 0 : 1.6}
            fillOpacity={i === 0 ? 1 : 0.12}
            strokeOpacity="0.75"
          />
          {/* Centre dot for leaves */}
          {i !== 0 && (
            <circle cx={n.cx} cy={n.cy} r={n.r * 0.35} fill={primaryColor} fillOpacity="0.7" />
          )}
          {/* White core for root */}
          {i === 0 && (
            <circle cx={n.cx} cy={n.cy} r={6} fill="white" fillOpacity="0.9" />
          )}
        </g>
      ))}

      {/* Expanding pulse from root */}
      <circle cx="130" cy="200" r="16" stroke={primaryColor} strokeWidth="1" fill="none">
        <animate attributeName="r" from="16" to="90" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3.5s" repeatCount="indefinite" />
      </circle>

      {/* "Account Created" badge that fades in/out */}
      <g style={{ animation: "badgePop 4s ease-in-out infinite" }}>
        <rect x="155" y="182" width="88" height="24" rx="10"
          fill={primaryColor} fillOpacity="0.15"
          stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.5"
        />
        <text x="199" y="198" textAnchor="middle"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "8px", fontWeight: 700, fill: primaryColor, letterSpacing: "0.08em" }}
        >
          ACCOUNT READY
        </text>
      </g>

      {/* Step rings around leaf nodes — hint at multi-step form */}
      {[1,2,3].map((idx, i) => (
        <circle key={`ring-${i}`}
          cx={nodes[idx].cx} cy={nodes[idx].cy}
          r={nodes[idx].r + 14}
          stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.15"
          fill="none" strokeDasharray="3 5"
        />
      ))}
    </svg>
  );
}

/* ─── Field label ─── */
function FieldLabel({ children, htmlFor, textColor }: {
  children: React.ReactNode; htmlFor: string; textColor: string;
}) {
  return (
    <label htmlFor={htmlFor} style={{
      display: "block", fontSize: "11px", fontWeight: 700,
      letterSpacing: "0.09em", textTransform: "uppercase" as const,
      color: textColor, marginBottom: "8px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </label>
  );
}

/* ─── Section divider ─── */
function SectionHead({ label, borderColor }: { label: string; borderColor: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <span style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase" as const, color: borderColor,
        fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" as const,
      }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: borderColor, opacity: 0.3 }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { theme } = useTheme();

  const {
    primary, background, surface, text, textSecondary, border, error: errorColor,
  } = theme;

  const [formData, setFormData] = useState({
    username: "", password: "", firstName: "", middleName: "",
    lastName: "", email: "", mobileNumber1: "", mobileNumber2: "", confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const submitData = {
        ...formData,
        middleName: formData.middleName || undefined,
        mobileNumber2: formData.mobileNumber2 || undefined,
      };
      await signup(submitData);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  /* Shared input style builder */
  const inputStyle = (focused: boolean) => ({
    width: "100%", borderRadius: "12px",
    border: `1.5px solid ${focused ? primary : border}`,
    padding: "13px 44px 13px 46px",
    fontSize: "14px", fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    background: focused ? background : surface,
    color: text,
    boxShadow: focused ? `0 0 0 4px ${primary}20` : "none",
  });

  /* Reusable controlled input */
  function ThemedInput({
    id, name, type = "text", placeholder, value, onChange, disabled,
    icon, rightSlot, required,
  }: {
    id: string; name: string; type?: string; placeholder: string;
    value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean; icon: React.ReactNode; rightSlot?: React.ReactNode;
    required?: boolean;
  }) {
    const [focused, setFocused] = useState(false);
    return (
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: focused ? primary : textSecondary,
          transition: "color 0.2s", display: "flex",
        }}>{icon}</span>
        <input
          id={id} name={name} type={type} placeholder={placeholder}
          value={value} onChange={onChange} disabled={disabled} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...inputStyle(focused), paddingRight: rightSlot ? "44px" : "14px" }}
        />
        {rightSlot && (
          <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </span>
        )}
      </div>
    );
  }

  const iconProps = { width: 17, height: 17, fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24" };
  const UserIcon   = <svg {...iconProps}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>;
  const EmailIcon  = <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
  const LockIcon   = <svg {...iconProps}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
  const PhoneIcon  = <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

  const leftBg = "#0d0f12";

  return (
    <>
      <style global jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap");

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(28px, -18px) scale(1.05); }
          66%       { transform: translate(-18px, 22px) scale(0.95); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-22px, 18px) scale(1.07); }
          70%       { transform: translate(18px, -12px) scale(0.96); }
        }
        @keyframes blobDrift3 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(12px, -16px); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.22; transform: scale(1); }
          50%       { opacity: 0.65; transform: scale(1.7); }
        }
        @keyframes badgePop {
          0%, 100% { opacity: 0; transform: scale(0.8) translateY(4px); }
          30%, 70%  { opacity: 1; transform: scale(1) translateY(0); }
        }

        .fade-up    { animation: fadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-up-d1 { animation-delay: 0.07s; }
        .fade-up-d2 { animation-delay: 0.14s; }
        .fade-up-d3 { animation-delay: 0.21s; }
        .fade-up-d4 { animation-delay: 0.28s; }
        .fade-up-d5 { animation-delay: 0.35s; }
        .float-art  { animation: floatY 6s ease-in-out infinite; }
        .scale-in   { animation: scaleIn 0.6s cubic-bezier(.22,.68,0,1.2) both; }

        /* Custom checkbox */
        .theme-check {
          appearance: none;
          width: 17px; height: 17px; min-width: 17px;
          border: 1.5px solid ${border};
          border-radius: 5px;
          background: ${surface};
          cursor: pointer;
          position: relative;
          transition: border-color 0.15s, background 0.15s;
        }
        .theme-check:checked {
          background: ${primary};
          border-color: ${primary};
        }
        .theme-check:checked::after {
          content: "";
          position: absolute;
          left: 3px; top: 0px;
          width: 6px; height: 10px;
          border: 2px solid #fff;
          border-top: none; border-left: none;
          transform: rotate(45deg);
        }
        .theme-check:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${primary}30;
        }

        .btn-primary-signup {
          width: 100%; border: none; border-radius: 12px;
          padding: 15px 24px; font-size: 15px; font-weight: 700;
          font-family: 'Syne', sans-serif; letter-spacing: 0.04em;
          cursor: pointer; background: ${primary}; color: #ffffff;
          transition: transform 0.18s, box-shadow 0.18s, filter 0.18s, opacity 0.18s;
          box-shadow: 0 4px 20px ${primary}44;
        }
        .btn-primary-signup:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px ${primary}55;
          filter: brightness(1.07);
        }
        .btn-primary-signup:disabled { opacity: 0.44; cursor: not-allowed; }
      `}</style>

      <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: background }}>

        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex lg:w-[44%] relative flex-col justify-between overflow-hidden"
          style={{ background: leftBg, padding: "56px 56px" }}
        >
          <AuroraBackground primaryColor={primary} />

          {/* Gradient blob center */}
          <div className="absolute pointer-events-none" style={{
            width: "500px", height: "500px", borderRadius: "50%",
            background: `radial-gradient(circle, ${primary}1e 0%, transparent 70%)`,
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          }} />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: primary }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" fill="white" fillOpacity="0.9" />
                <path d="M10 2v16M3 6l7 4 7-4" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
              </svg>
            </div>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px",
              color: "#ffffff", letterSpacing: "-0.02em",
            }}>
              YourSoft<span style={{ color: primary }}>.</span>
            </span>
          </div>

          {/* Centred art */}
          <div className="relative z-10 flex items-center justify-center flex-1 py-10">
            <div className="float-art scale-in">
              <SignupArt primaryColor={primary} />
            </div>
          </div>

          {/* Copy */}
          <div className="relative z-10">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 12px", borderRadius: "999px",
              border: `1px solid ${primary}55`, background: `${primary}15`,
              color: primary, fontSize: "12px", fontWeight: 600,
              letterSpacing: "0.05em", marginBottom: "20px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <span style={{ height: "6px", width: "6px", borderRadius: "50%", background: primary }} />
              Join the Platform
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(26px, 2.6vw, 40px)", letterSpacing: "-0.035em",
              color: "#ffffff", lineHeight: 1.1, marginBottom: "14px",
            }}>
              Your workspace,<br />
              <span style={{ color: primary }}>starts here.</span>
            </h2>

            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "14px", lineHeight: 1.7, maxWidth: "340px", marginBottom: "28px" }}>
              Create your account in under a minute and get access to your team&apos;s tools, dashboards, and deployment pipelines.
            </p>

            {/* Benefits */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Full dashboard & analytics access",
                "Collaborate with your team instantly",
                "Deploy projects in one click",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                    background: `${primary}20`, border: `1.5px solid ${primary}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="12" height="12" fill="none" stroke={primary} strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px",
              borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px", marginTop: "28px",
            }}>
              {[
                { num: "50K+", label: "Teams" },
                { num: "99.9%", label: "Uptime" },
                { num: "< 2s", label: "Response" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 800,
                    fontSize: "22px", color: primary, letterSpacing: "-0.03em", lineHeight: 1,
                  }}>{num}</div>
                  <div style={{
                    fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em",
                    color: "rgba(255,255,255,0.32)", marginTop: "4px", textTransform: "uppercase",
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form ── */}
        <div
          className="w-full lg:w-[56%] flex items-start justify-center overflow-y-auto px-6 py-12"
          style={{ background: background }}
        >
          <div className="w-full max-w-[560px]">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-10">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: primary }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px", color: text }}>
                YourSoft<span style={{ color: primary }}>.</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8 fade-up">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "4px 12px", borderRadius: "999px",
                border: `1px solid ${primary}44`, background: `${primary}12`,
                color: primary, fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.05em", marginBottom: "14px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <span style={{ height: "5px", width: "5px", borderRadius: "50%", background: primary }} />
                Get started — it&apos;s free
              </div>

              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(26px, 2.8vw, 38px)", letterSpacing: "-0.035em",
                color: text, lineHeight: 1.1, marginBottom: "10px",
              }}>
                Create your<br />
                <span style={{ color: primary }}>account</span>
              </h1>
              <p style={{ color: textSecondary, fontSize: "14px", lineHeight: 1.6 }}>
                Fill in your details below. It only takes a minute.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="fade-up" style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                borderRadius: "12px", padding: "14px 16px", marginBottom: "20px",
                background: `${errorColor}12`, border: `1.5px solid ${errorColor}44`,
                color: errorColor, fontSize: "14px", fontWeight: 600,
              }}>
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* ── Personal Info ── */}
              <div className="fade-up fade-up-d1">
                <SectionHead label="Personal Info" borderColor={textSecondary} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}
                  className="grid-cols-1 md:grid-cols-3">
                  <div>
                    <FieldLabel htmlFor="firstName" textColor={textSecondary}>
                      First Name <span style={{ color: primary }}>*</span>
                    </FieldLabel>
                    <ThemedInput id="firstName" name="firstName" placeholder="John"
                      value={formData.firstName} onChange={handleChange} disabled={loading}
                      icon={UserIcon} required />
                  </div>
                  <div>
                    <FieldLabel htmlFor="middleName" textColor={textSecondary}>
                      Middle{" "}
                      <span style={{ color: textSecondary, fontSize: "9px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "none" }}>
                        (opt)
                      </span>
                    </FieldLabel>
                    <ThemedInput id="middleName" name="middleName" placeholder="M."
                      value={formData.middleName} onChange={handleChange} disabled={loading} icon={UserIcon} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="lastName" textColor={textSecondary}>
                      Last Name <span style={{ color: primary }}>*</span>
                    </FieldLabel>
                    <ThemedInput id="lastName" name="lastName" placeholder="Doe"
                      value={formData.lastName} onChange={handleChange} disabled={loading}
                      icon={UserIcon} required />
                  </div>
                </div>
              </div>

              {/* ── Account Details ── */}
              <div className="fade-up fade-up-d2">
                <SectionHead label="Account Details" borderColor={textSecondary} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <FieldLabel htmlFor="username" textColor={textSecondary}>
                      Username <span style={{ color: primary }}>*</span>
                    </FieldLabel>
                    <ThemedInput id="username" name="username" placeholder="johndoe"
                      value={formData.username} onChange={handleChange} disabled={loading}
                      icon={UserIcon} required />
                  </div>
                  <div>
                    <FieldLabel htmlFor="email" textColor={textSecondary}>
                      Email Address <span style={{ color: primary }}>*</span>
                    </FieldLabel>
                    <ThemedInput id="email" name="email" type="email" placeholder="john@company.com"
                      value={formData.email} onChange={handleChange} disabled={loading}
                      icon={EmailIcon} required />
                  </div>
                </div>
              </div>

              {/* ── Password ── */}
              <div className="fade-up fade-up-d3">
                <SectionHead label="Security" borderColor={textSecondary} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <FieldLabel htmlFor="password" textColor={textSecondary}>
                      Password <span style={{ color: primary }}>*</span>
                    </FieldLabel>
                    <ThemedInput id="password" name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password} onChange={handleChange} disabled={loading}
                      icon={LockIcon} required
                      rightSlot={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 0, display: "flex" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
                        >
                          {showPassword ? <EyeOff /> : <EyeOpen />}
                        </button>
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="confirmPassword" textColor={textSecondary}>
                      Confirm Password <span style={{ color: primary }}>*</span>
                    </FieldLabel>
                    <ThemedInput id="confirmPassword" name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword} onChange={handleChange} disabled={loading}
                      icon={LockIcon} required
                      rightSlot={
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 0, display: "flex" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
                        >
                          {showConfirm ? <EyeOff /> : <EyeOpen />}
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ── Contact ── */}
              <div className="fade-up fade-up-d4">
                <SectionHead label="Contact" borderColor={textSecondary} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <FieldLabel htmlFor="mobileNumber1" textColor={textSecondary}>
                      Primary Mobile <span style={{ color: primary }}>*</span>
                    </FieldLabel>
                    <ThemedInput id="mobileNumber1" name="mobileNumber1" type="tel"
                      placeholder="0771234567"
                      value={formData.mobileNumber1} onChange={handleChange} disabled={loading}
                      icon={PhoneIcon} required />
                  </div>
                  <div>
                    <FieldLabel htmlFor="mobileNumber2" textColor={textSecondary}>
                      Secondary{" "}
                      <span style={{ color: textSecondary, fontSize: "9px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "none" }}>
                        (opt)
                      </span>
                    </FieldLabel>
                    <ThemedInput id="mobileNumber2" name="mobileNumber2" type="tel"
                      placeholder="0711234567"
                      value={formData.mobileNumber2} onChange={handleChange} disabled={loading}
                      icon={PhoneIcon} />
                  </div>
                </div>
              </div>

              {/* ── Terms ── */}
              <label className="fade-up fade-up-d5" style={{
                display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="theme-check"
                  style={{ marginTop: "1px" }}
                />
                <span style={{ fontSize: "13px", fontWeight: 500, color: textSecondary, lineHeight: 1.6 }}>
                  I agree to the{" "}
                  <Link href="/terms" style={{ color: primary, fontWeight: 700, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" style={{ color: primary, fontWeight: 700, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >Privacy Policy</Link>
                </span>
              </label>

              {/* ── Submit ── */}
              <button type="submit" disabled={loading || !agreed} className="btn-primary-signup fade-up fade-up-d5">
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating your account…
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    Create Account
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1, height: "1px", background: border }} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: textSecondary, letterSpacing: "0.08em" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: border }} />
              </div>

              {/* Login link */}
              <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 500, color: textSecondary }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: primary, fontWeight: 700, textDecoration: "none", transition: "opacity 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Sign in instead →
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}