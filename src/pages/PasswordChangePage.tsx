"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UNIQUE_CODE_NAME } from "@/utils/constant";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services/authService";
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

/* ─── Aurora Background (shared) ─── */
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

/* ─── Security Shield Illustration ─── */
function SecurityArt({ primaryColor }: { primaryColor: string }) {
  // Orbiting key dots around a shield
  const orbitDots = [0, 60, 120, 180, 240, 300];
  return (
    <svg
      viewBox="0 0 300 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[300px]"
      style={{ filter: `drop-shadow(0 0 45px ${primaryColor}35)` }}
    >
      {/* Outer orbit ring */}
      <circle cx="150" cy="155" r="110" stroke={primaryColor} strokeWidth="0.8"
        strokeOpacity="0.15" strokeDasharray="4 8" fill="none" />
      {/* Mid orbit ring */}
      <circle cx="150" cy="155" r="80" stroke={primaryColor} strokeWidth="0.8"
        strokeOpacity="0.12" strokeDasharray="3 6" fill="none" />

      {/* Orbiting security dots */}
      {orbitDots.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 150 + 110 * Math.cos(rad);
        const y = 155 + 110 * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={i % 2 === 0 ? 5 : 4} fill={primaryColor}
              fillOpacity={i % 2 === 0 ? 0.7 : 0.45}>
              <animateTransform attributeName="transform" type="rotate"
                from={`${deg} 150 155`} to={`${deg + 360} 150 155`}
                dur={`${20 + i * 2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Shield body */}
      <path
        d="M150 40 L215 68 L215 138 C215 178 185 208 150 222 C115 208 85 178 85 138 L85 68 Z"
        fill={primaryColor} fillOpacity="0.10"
        stroke={primaryColor} strokeWidth="2.5" strokeOpacity="0.8"
        strokeLinejoin="round"
      >
        <animate attributeName="fill-opacity" values="0.10;0.18;0.10"
          dur="3s" repeatCount="indefinite" />
      </path>

      {/* Shield inner glow */}
      <path
        d="M150 58 L205 82 L205 138 C205 172 178 198 150 210 C122 198 95 172 95 138 L95 82 Z"
        fill={primaryColor} fillOpacity="0.06"
        stroke={primaryColor} strokeWidth="1" strokeOpacity="0.3"
        strokeLinejoin="round"
      />

      {/* Lock icon inside shield */}
      <rect x="132" y="128" width="36" height="28" rx="6"
        fill={primaryColor} fillOpacity="0.85" />
      <path d="M141 128 L141 120 A9 9 0 0 1 159 120 L159 128"
        stroke={primaryColor} strokeWidth="4" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
      <circle cx="150" cy="142" r="5" fill="white" fillOpacity="0.85" />
      <rect x="148" y="144" width="4" height="7" rx="2" fill="white" fillOpacity="0.85" />

      {/* Pulse ring from shield centre */}
      <circle cx="150" cy="155" r="50" stroke={primaryColor} strokeWidth="1" fill="none">
        <animate attributeName="r" from="50" to="115" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.45" to="0" dur="3.5s" repeatCount="indefinite" />
      </circle>

      {/* Floating checkmark badges */}
      {[
        { x: 58, y: 95, delay: "0s" },
        { x: 222, y: 110, delay: "1.2s" },
        { x: 68, y: 205, delay: "2.4s" },
      ].map(({ x, y, delay }, i) => (
        <g key={i} style={{ animation: `badgePop 4s ${delay} ease-in-out infinite` }}>
          <circle cx={x} cy={y} r={11} fill={primaryColor} fillOpacity="0.15"
            stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.5" />
          <path d={`M${x-5} ${y} l3 3 6-6`} stroke={primaryColor} strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      {/* Connection lines from shield to badges */}
      {[
        { x1: 100, y1: 115, x2: 68, y2: 95 },
        { x1: 205, y1: 120, x2: 222, y2: 110 },
        { x1: 105, y1: 190, x2: 75, y2: 205 },
      ].map((line, i) => (
        <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.25"
          strokeDasharray="3 4" />
      ))}

      {/* Bottom label */}
      <rect x="108" y="245" width="84" height="22" rx="10"
        fill={primaryColor} fillOpacity="0.12"
        stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.4" />
      <text x="150" y="260" textAnchor="middle"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: "8px", fontWeight: 700, fill: primaryColor, letterSpacing: "0.09em" }}>
        SECURED
      </text>
    </svg>
  );
}

/* ─── Strength Bar ─── */
function StrengthBar({ password, primaryColor }: { password: string; primaryColor: string }) {
  if (!password) return null;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const score = [password.length >= 8, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  const levels = [
    { label: "Weak",   color: "#ef4444", width: "25%" },
    { label: "Fair",   color: "#f59e0b", width: "50%" },
    { label: "Good",   color: "#3b82f6", width: "75%" },
    { label: "Strong", color: "#22c55e", width: "100%" },
  ];
  const current = levels[Math.max(0, score - 1)] ?? levels[0];

  return (
    <div style={{
      borderRadius: "12px", padding: "12px 14px",
      background: `${primaryColor}0d`,
      border: `1px solid ${primaryColor}20`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
          Password Strength
        </span>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: current.color, fontFamily: "'DM Sans', sans-serif" }}>
          {current.label}
        </span>
      </div>
      {/* Bar segments */}
      <div style={{ display: "flex", gap: "4px" }}>
        {levels.map((lvl, i) => (
          <div key={i} style={{
            flex: 1, height: "4px", borderRadius: "999px",
            background: i < score ? lvl.color : "rgba(0,0,0,0.10)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      {/* Requirements */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
        {[
          { label: "8+ chars", met: password.length >= 8 },
          { label: "Uppercase", met: hasUpper },
          { label: "Number", met: hasNumber },
          { label: "Symbol", met: hasSymbol },
        ].map(({ label, met }) => (
          <span key={label} style={{
            fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px",
            fontFamily: "'DM Sans', sans-serif",
            background: met ? "#22c55e18" : "rgba(0,0,0,0.06)",
            color: met ? "#16a34a" : "rgba(0,0,0,0.35)",
            border: `1px solid ${met ? "#22c55e40" : "transparent"}`,
            transition: "all 0.2s",
          }}>
            {met ? "✓ " : ""}{label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function PasswordChangePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();

  const { primary, background, surface, text, textSecondary, border, error: errorColor, success: successColor } = theme;

  const [formData, setFormData] = useState({
    oldPassword: "", newPassword: "", confirmNewPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* auth guard */
  useEffect(() => {
    const uniqueCode = sessionStorage.getItem(UNIQUE_CODE_NAME);
    if (!uniqueCode) router.push("/login");
  }, [router]);

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.oldPassword) { setError("Please enter your current password."); return; }
    if (!formData.newPassword) { setError("Please enter a new password."); return; }
    if (formData.newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (formData.oldPassword === formData.newPassword) { setError("New password must differ from current password."); return; }
    if (formData.newPassword !== formData.confirmNewPassword) { setError("New passwords do not match."); return; }

    setLoading(true);
    try {
      const message = await AuthService.changePassword({
        username: user?.username ?? "",
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });
      setSuccess(message || "Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => router.push("/profile"), 2200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  /* Shared input component */
  function ThemedInput({
    type = "text", value, onChange, placeholder, disabled, readOnly, icon, rightSlot, hint,
  }: {
    type?: string; value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string; disabled?: boolean; readOnly?: boolean;
    icon: React.ReactNode; rightSlot?: React.ReactNode; hint?: string;
  }) {
    const [focused, setFocused] = useState(false);
    const isDisabled = disabled || readOnly;
    return (
      <div>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
            pointerEvents: "none", display: "flex",
            color: focused ? primary : textSecondary,
            transition: "color 0.2s",
          }}>{icon}</span>
          <input
            type={type} value={value} onChange={onChange}
            placeholder={placeholder} disabled={isDisabled} readOnly={readOnly}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              width: "100%", borderRadius: "12px",
              border: `1.5px solid ${focused && !isDisabled ? primary : border}`,
              padding: "13px 44px 13px 46px",
              fontSize: "14px", fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
              background: isDisabled ? `${textSecondary}14` : (focused ? background : surface),
              color: isDisabled ? textSecondary : text,
              boxShadow: focused && !isDisabled ? `0 0 0 4px ${primary}20` : "none",
              cursor: isDisabled ? "not-allowed" : "text",
              paddingRight: rightSlot ? "44px" : "14px",
            }}
          />
          {rightSlot && (
            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}>
              {rightSlot}
            </span>
          )}
        </div>
        {hint && (
          <p style={{ marginTop: "6px", fontSize: "12px", fontWeight: 500, color: textSecondary, fontFamily: "'DM Sans', sans-serif" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }

  function ToggleBtn({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
      <button type="button" onClick={onToggle} disabled={loading}
        style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 0, display: "flex", transition: "color 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
      >
        {show ? <EyeOff /> : <EyeOpen />}
      </button>
    );
  }

  function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
      <div style={{
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em",
        textTransform: "uppercase" as const, color: textSecondary,
        marginBottom: "8px", fontFamily: "'DM Sans', sans-serif",
      }}>{children}</div>
    );
  }

  const iconProps = { width: 17, height: 17, fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24" };
  const LockIcon = <svg {...iconProps}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
  const UserIcon = <svg {...iconProps}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>;
  const CheckIcon = <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

  const leftBg = "#0d0f12";
  const passwordsMatch = formData.newPassword && formData.confirmNewPassword &&
    formData.newPassword === formData.confirmNewPassword;
  const passwordsMismatch = formData.confirmNewPassword &&
    formData.newPassword !== formData.confirmNewPassword;

  return (
    <>
      <style global jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap");

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
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
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes badgePop {
          0%, 100% { opacity: 0; transform: scale(0.7); }
          30%, 70%  { opacity: 1; transform: scale(1); }
        }
        @keyframes bannerIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up    { animation: fadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-up-d1 { animation-delay: 0.07s; }
        .fade-up-d2 { animation-delay: 0.14s; }
        .fade-up-d3 { animation-delay: 0.21s; }
        .fade-up-d4 { animation-delay: 0.28s; }
        .fade-up-d5 { animation-delay: 0.35s; }
        .float-art  { animation: floatY 6s ease-in-out infinite; }
        .scale-in   { animation: scaleIn 0.6s cubic-bezier(.22,.68,0,1.2) both; }
        .banner-in  { animation: bannerIn 0.3s ease-out; }

        .btn-change {
          width: 100%; border: none; border-radius: 12px;
          padding: 15px 24px; font-size: 15px; font-weight: 700;
          font-family: 'Syne', sans-serif; letter-spacing: 0.04em;
          cursor: pointer; background: ${primary}; color: #ffffff;
          transition: transform 0.18s, box-shadow 0.18s, filter 0.18s, opacity 0.18s;
          box-shadow: 0 4px 20px ${primary}44;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-change:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px ${primary}55;
          filter: brightness(1.07);
        }
        .btn-change:disabled { opacity: 0.44; cursor: not-allowed; }
      `}</style>

      <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: background }}>

        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex lg:w-[46%] relative flex-col justify-between overflow-hidden"
          style={{ background: leftBg, padding: "56px 60px" }}
        >
          <AuroraBackground primaryColor={primary} />

          {/* Centre gradient blob */}
          <div className="absolute pointer-events-none" style={{
            width: "480px", height: "480px", borderRadius: "50%",
            background: `radial-gradient(circle, ${primary}1a 0%, transparent 70%)`,
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
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "#ffffff", letterSpacing: "-0.02em" }}>
              YourSoft<span style={{ color: primary }}>.</span>
            </span>
          </div>

          {/* Art */}
          <div className="relative z-10 flex items-center justify-center flex-1 py-10">
            <div className="float-art scale-in">
              <SecurityArt primaryColor={primary} />
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
              Account Security
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(26px, 2.6vw, 40px)", letterSpacing: "-0.035em",
              color: "#ffffff", lineHeight: 1.1, marginBottom: "14px",
            }}>
              Lock it down.<br />
              <span style={{ color: primary }}>Stay protected.</span>
            </h2>

            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "14px", lineHeight: 1.7, maxWidth: "340px", marginBottom: "28px" }}>
              Keep your account secure by updating your password regularly and using strong, unique credentials.
            </p>

            {/* Tips */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Use a unique password not used elsewhere",
                "Minimum 8 characters with mixed types",
                "Include symbols and uppercase letters",
              ].map((tip) => (
                <div key={tip} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                    background: `${primary}20`, border: `1.5px solid ${primary}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="12" height="12" fill="none" stroke={primary} strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 500 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form ── */}
        <div
          className="w-full lg:w-[54%] flex items-center justify-center px-6 py-14 overflow-y-auto"
          style={{ background: background }}
        >
          <div className="w-full max-w-[440px]">

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
            <div className="fade-up mb-8">
              {/* Icon badge */}
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px", marginBottom: "20px",
                background: `${primary}15`, border: `1.5px solid ${primary}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="24" height="24" fill="none" stroke={primary} strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "4px 12px", borderRadius: "999px",
                border: `1px solid ${primary}44`, background: `${primary}12`,
                color: primary, fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.05em", marginBottom: "14px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <span style={{ height: "5px", width: "5px", borderRadius: "50%", background: primary }} />
                Security Settings
              </div>

              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(26px, 2.8vw, 38px)", letterSpacing: "-0.035em",
                color: text, lineHeight: 1.1, marginBottom: "10px",
              }}>
                Change your<br />
                <span style={{ color: primary }}>password</span>
              </h1>
              <p style={{ color: textSecondary, fontSize: "14px", lineHeight: 1.6 }}>
                Update your credentials to keep your account secure.
              </p>
            </div>

            {/* Success banner */}
            {success && (
              <div className="banner-in" style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                borderRadius: "12px", padding: "14px 16px", marginBottom: "20px",
                background: `${successColor}15`, border: `1.5px solid ${successColor}44`,
                color: successColor, fontSize: "14px", fontWeight: 600,
              }}>
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="banner-in" style={{
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Username read-only */}
              <div className="fade-up fade-up-d1">
                <FieldLabel>Username</FieldLabel>
                <ThemedInput
                  type="text" value={user?.username ?? ""} readOnly disabled
                  icon={UserIcon}
                />
              </div>

              {/* Divider */}
              <div className="fade-up fade-up-d1" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, height: "1px", background: border }} />
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textSecondary, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                  Update Password
                </span>
                <div style={{ flex: 1, height: "1px", background: border }} />
              </div>

              {/* Current password */}
              <div className="fade-up fade-up-d2">
                <FieldLabel>Current Password <span style={{ color: primary }}>*</span></FieldLabel>
                <ThemedInput
                  type={showOld ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={(e) => handleChange("oldPassword", e.target.value)}
                  placeholder="Enter current password"
                  disabled={loading}
                  icon={LockIcon}
                  rightSlot={<ToggleBtn show={showOld} onToggle={() => setShowOld(v => !v)} />}
                />
              </div>

              {/* New password */}
              <div className="fade-up fade-up-d3">
                <FieldLabel>New Password <span style={{ color: primary }}>*</span></FieldLabel>
                <ThemedInput
                  type={showNew ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                  placeholder="Create a strong password"
                  disabled={loading}
                  icon={LockIcon}
                  hint="Minimum 6 characters"
                  rightSlot={<ToggleBtn show={showNew} onToggle={() => setShowNew(v => !v)} />}
                />
              </div>

              {/* Strength bar */}
              {formData.newPassword && (
                <div className="fade-up">
                  <StrengthBar password={formData.newPassword} primaryColor={primary} />
                </div>
              )}

              {/* Confirm password */}
              <div className="fade-up fade-up-d4">
                <FieldLabel>Confirm New Password <span style={{ color: primary }}>*</span></FieldLabel>
                <ThemedInput
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmNewPassword}
                  onChange={(e) => handleChange("confirmNewPassword", e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={loading}
                  icon={CheckIcon}
                  rightSlot={<ToggleBtn show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />}
                />
                {/* Match indicator */}
                {formData.confirmNewPassword && (
                  <p style={{
                    marginTop: "6px", fontSize: "12px", fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    color: passwordsMatch ? "#22c55e" : "#ef4444",
                    animation: "bannerIn 0.2s ease-out",
                  }}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!passwordsMismatch}
                className="btn-change fade-up fade-up-d5 mt-1"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating password…
                  </>
                ) : (
                  <>
                    Update Password
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Back link */}
              <div className="text-center fade-up fade-up-d5">
                <Link
                  href="/profile"
                  style={{
                    fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    color: textSecondary, textDecoration: "none", transition: "color 0.15s",
                    display: "inline-flex", alignItems: "center", gap: "6px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to Profile
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}