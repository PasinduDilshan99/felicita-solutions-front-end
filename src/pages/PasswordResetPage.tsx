"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AuthService } from "@/services/authService";
import { SecretQuestion } from "@/types/auth-types";
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

/* ─── Aurora Background ─── */
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

/* ─── Recovery Illustration ─── */
function RecoveryArt({ primaryColor, step }: { primaryColor: string; step: 1 | 2 }) {
  // Step 1: key searching / Step 2: key unlocking
  const orbitAngles = [0, 60, 120, 180, 240, 300];
  const innerAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[300px]"
      style={{ filter: `drop-shadow(0 0 45px ${primaryColor}35)` }}
    >
      {/* Outer orbit ring */}
      <circle cx="150" cy="150" r="128" stroke={primaryColor}
        strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4 8" fill="none">
        <animateTransform attributeName="transform" type="rotate"
          from="0 150 150" to="360 150 150" dur="25s" repeatCount="indefinite" />
      </circle>

      {/* Outer orbit dots */}
      {orbitAngles.map((deg, i) => {
        const filled = step === 2 ? true : i < 2;
        return (
          <circle key={i} cx={150 + 128 * Math.cos((deg * Math.PI) / 180)}
            cy={150 + 128 * Math.sin((deg * Math.PI) / 180)}
            r={i === 0 ? 5 : 3.5}
            fill={filled ? primaryColor : "none"}
            stroke={primaryColor} strokeWidth="1"
            fillOpacity={filled ? 0.75 : 0}
            strokeOpacity="0.4">
            <animateTransform attributeName="transform" type="rotate"
              from={`${deg} 150 150`} to={`${deg + 360} 150 150`}
              dur="25s" repeatCount="indefinite" />
          </circle>
        );
      })}

      {/* Inner orbit ring */}
      <circle cx="150" cy="150" r="85" stroke={primaryColor}
        strokeWidth="0.8" strokeOpacity="0.20" strokeDasharray="3 6" fill="none">
        <animateTransform attributeName="transform" type="rotate"
          from="0 150 150" to="-360 150 150" dur="18s" repeatCount="indefinite" />
      </circle>

      {/* Inner orbit dots — progress fills on step 2 */}
      {innerAngles.map((deg, i) => {
        const filled = step === 2 ? i < 6 : i < 2;
        return (
          <circle key={i} cx={150 + 85 * Math.cos((deg * Math.PI) / 180)}
            cy={150 + 85 * Math.sin((deg * Math.PI) / 180)} r="3"
            fill={filled ? primaryColor : "none"}
            stroke={primaryColor} strokeWidth="1"
            fillOpacity={filled ? 0.6 : 0} strokeOpacity="0.35">
            <animateTransform attributeName="transform" type="rotate"
              from={`${deg} 150 150`} to={`${deg - 360} 150 150`}
              dur="18s" repeatCount="indefinite" />
          </circle>
        );
      })}

      {/* Centre glow */}
      <circle cx="150" cy="150" r="52" fill={primaryColor} fillOpacity="0.07">
        <animate attributeName="fill-opacity" values="0.07;0.14;0.07" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="150" cy="150" r="36" fill={primaryColor} fillOpacity="0.10" />

      {/* KEY illustration */}
      {/* Key ring */}
      <circle cx="150" cy="132" r="24"
        fill={primaryColor} fillOpacity="0.12"
        stroke={primaryColor} strokeWidth="4" strokeOpacity="0.9" />
      <circle cx="150" cy="132" r="10"
        fill="none" stroke={primaryColor} strokeWidth="2.5" strokeOpacity="0.6" />
      {/* Key shaft */}
      <rect x="147" y="154" width="6" height="36" rx="2.5"
        fill={primaryColor} fillOpacity="0.9" />
      {/* Key teeth */}
      <rect x="153" y="164" width="9" height="5" rx="2"
        fill={primaryColor} fillOpacity="0.9" />
      <rect x="153" y="176" width="6" height="5" rx="2"
        fill={primaryColor} fillOpacity="0.9" />

      {/* Step indicator dots */}
      {[1, 2].map((s) => (
        <circle key={s} cx={143 + (s - 1) * 14} cy="220" r="4.5"
          fill={step >= s ? primaryColor : "none"}
          stroke={primaryColor} strokeWidth="1.5"
          fillOpacity={step >= s ? 0.85 : 0}
          strokeOpacity={step >= s ? 0 : 0.4}
          style={{ transition: "fill-opacity 0.4s ease" }}
        />
      ))}

      {/* Expanding pulse from centre */}
      <circle cx="150" cy="150" r="36" stroke={primaryColor} strokeWidth="1" fill="none">
        <animate attributeName="r" from="36" to="130" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.4" to="0" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Step 2: unlock indicator badge */}
      {step === 2 && (
        <g style={{ animation: "badgePop 0.4s ease-out both" }}>
          <rect x="95" y="245" width="110" height="24" rx="10"
            fill={primaryColor} fillOpacity="0.15"
            stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.5" />
          <text x="150" y="261" textAnchor="middle"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "8px", fontWeight: 700, fill: primaryColor, letterSpacing: "0.10em" }}>
            VERIFYING IDENTITY
          </text>
        </g>
      )}
    </svg>
  );
}

/* ─── Step Bar ─── */
function StepBar({ step, primary, text, textSecondary, border }: {
  step: 1 | 2; primary: string; text: string; textSecondary: string; border: string;
}) {
  const steps = ["Find Account", "Verify & Reset"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
      {steps.map((label, i) => {
        const idx = (i + 1) as 1 | 2;
        const done = step > idx;
        const active = step === idx;
        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 800, fontFamily: "'Syne', sans-serif",
                transition: "all 0.3s",
                background: done ? primary : active ? `${primary}18` : "transparent",
                border: `2px solid ${done ? primary : active ? primary : border}`,
                color: done ? "#fff" : active ? primary : textSecondary,
              }}>
                {done ? (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : idx}
              </div>
              <span style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em",
                textTransform: "uppercase" as const, fontFamily: "'DM Sans', sans-serif",
                color: active ? text : done ? primary : textSecondary,
                display: "none",
              }} className="sm:block">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: "2px", borderRadius: "999px", margin: "0 4px",
                background: step > 1 ? primary : border,
                transition: "background 0.5s",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
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
    { label: "Weak",   color: "#ef4444" },
    { label: "Fair",   color: "#f59e0b" },
    { label: "Good",   color: "#3b82f6" },
    { label: "Strong", color: "#22c55e" },
  ];
  const current = levels[Math.max(0, score - 1)] ?? levels[0];

  return (
    <div style={{
      borderRadius: "12px", padding: "12px 14px",
      background: `${primaryColor}0d`, border: `1px solid ${primaryColor}20`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
          Strength
        </span>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: current.color, fontFamily: "'DM Sans', sans-serif" }}>
          {current.label}
        </span>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {levels.map((lvl, i) => (
          <div key={i} style={{
            flex: 1, height: "4px", borderRadius: "999px",
            background: i < score ? lvl.color : "rgba(0,0,0,0.10)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function PasswordResetPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const { primary, background, surface, text, textSecondary, border, error: errorColor, success: successColor } = theme;

  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [secretQuestions, setSecretQuestions] = useState<SecretQuestion[]>([]);
  const [formData, setFormData] = useState({
    secretQuestion1: 0, secretQuestion1Answer: "",
    secretQuestion2: 0, secretQuestion2Answer: "",
    secretQuestion3: 0, secretQuestion3Answer: "",
    newPassword: "", confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    AuthService.getSecretQuestions()
      .then(setSecretQuestions)
      .catch(() => setError("Failed to load security questions. Please try again."));
  }, []);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError("Please enter your username."); return; }
    setError(null);
    setStep(2);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    if (!formData.secretQuestion1 || !formData.secretQuestion2 || !formData.secretQuestion3) {
      setError("Please select all three security questions."); return;
    }
    if (!formData.secretQuestion1Answer || !formData.secretQuestion2Answer || !formData.secretQuestion3Answer) {
      setError("Please answer all three security questions."); return;
    }
    if (formData.newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (formData.newPassword !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    const unique = new Set([formData.secretQuestion1, formData.secretQuestion2, formData.secretQuestion3]);
    if (unique.size !== 3) { setError("Please select three different security questions."); return; }

    setLoading(true);
    try {
      const message = await AuthService.resetPassword({ username, ...formData });
      setSuccess(message || "Password reset successful! Redirecting to login…");
      setTimeout(() => router.push("/login"), 2200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password. Please check your answers.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const getAvailableQuestions = (excludeQuestion: number) => {
    const selected = [formData.secretQuestion1, formData.secretQuestion2, formData.secretQuestion3]
      .filter((q) => q !== 0 && q !== excludeQuestion);
    return secretQuestions.filter((q) => !selected.includes(q.questionId));
  };

  /* ── Shared themed input ── */
  function ThemedInput({
    id, type = "text", value, onChange, placeholder, disabled, icon, rightSlot, required,
  }: {
    id?: string; type?: string; value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string; disabled?: boolean; icon: React.ReactNode;
    rightSlot?: React.ReactNode; required?: boolean;
  }) {
    const [focused, setFocused] = useState(false);
    return (
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", display: "flex",
          color: focused ? primary : textSecondary, transition: "color 0.2s",
        }}>{icon}</span>
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} disabled={disabled} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", borderRadius: "12px",
            border: `1.5px solid ${focused ? primary : border}`,
            padding: "13px 44px 13px 46px",
            fontSize: "14px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
            outline: "none", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
            background: disabled ? `${textSecondary}14` : (focused ? background : surface),
            color: disabled ? textSecondary : text,
            boxShadow: focused ? `0 0 0 4px ${primary}20` : "none",
            cursor: disabled ? "not-allowed" : "text",
            paddingRight: rightSlot ? "44px" : "14px",
          }}
        />
        {rightSlot && (
          <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </span>
        )}
      </div>
    );
  }

  /* ── Themed select ── */
  function ThemedSelect({
    value, onChange, children, required, disabled,
  }: {
    value: number; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode; required?: boolean; disabled?: boolean;
  }) {
    const [focused, setFocused] = useState(false);
    return (
      <select
        value={value} onChange={onChange} required={required} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", borderRadius: "12px",
          border: `1.5px solid ${focused ? primary : border}`,
          padding: "13px 44px 13px 16px",
          fontSize: "14px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
          outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
          background: surface, color: value === 0 ? textSecondary : text,
          boxShadow: focused ? `0 0 0 4px ${primary}20` : "none",
          cursor: "pointer", appearance: "none" as const,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='${encodeURIComponent(primary)}' stroke-width='2.5' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        }}
      >
        {children}
      </select>
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

  function SectionDivider({ label }: { label: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ flex: 1, height: "1px", background: border }} />
        <span style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase" as const, color: textSecondary,
          fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" as const,
        }}>{label}</span>
        <div style={{ flex: 1, height: "1px", background: border }} />
      </div>
    );
  }

  function ToggleBtn({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
      <button type="button" onClick={onToggle}
        style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 0, display: "flex", transition: "color 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
      >
        {show ? <EyeOff /> : <EyeOpen />}
      </button>
    );
  }

  const iconProps = { width: 17, height: 17, fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24" };
  const UserIcon   = <svg {...iconProps}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>;
  const LockIcon   = <svg {...iconProps}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
  const CheckIcon  = <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  const ChatIcon   = <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" /></svg>;

  const leftBg = "#0d0f12";
  const passwordsMatch = formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword && formData.newPassword !== formData.confirmPassword;

  return (
    <>
      <style global jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap");

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepSlide {
          from { opacity: 0; transform: translateX(22px); }
          to   { opacity: 1; transform: translateX(0); }
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
          from { opacity: 0; transform: scale(0.7) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
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
        .float-art  { animation: floatY 6s ease-in-out infinite; }
        .scale-in   { animation: scaleIn 0.6s cubic-bezier(.22,.68,0,1.2) both; }
        .step-enter { animation: stepSlide 0.35s cubic-bezier(.22,.68,0,1.2) both; }
        .banner-in  { animation: bannerIn 0.3s ease-out; }

        .btn-primary-reset {
          width: 100%; border: none; border-radius: 12px;
          padding: 15px 24px; font-size: 15px; font-weight: 700;
          font-family: 'Syne', sans-serif; letter-spacing: 0.04em;
          cursor: pointer; background: ${primary}; color: #ffffff;
          transition: transform 0.18s, box-shadow 0.18s, filter 0.18s, opacity 0.18s;
          box-shadow: 0 4px 20px ${primary}44;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary-reset:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px ${primary}55;
          filter: brightness(1.07);
        }
        .btn-primary-reset:disabled { opacity: 0.44; cursor: not-allowed; }

        .btn-secondary-reset {
          width: 100%; border-radius: 12px; font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          padding: 13px 24px; transition: background 0.18s, color 0.18s;
          background: ${surface}; color: ${textSecondary};
          border: 1.5px solid ${border};
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .btn-secondary-reset:hover:not(:disabled) {
          background: ${border}; color: ${text};
        }
        .btn-secondary-reset:disabled { opacity: 0.44; cursor: not-allowed; }
      `}</style>

      <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: background }}>

        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex lg:w-[46%] relative flex-col justify-between overflow-hidden"
          style={{ background: leftBg, padding: "56px 60px" }}
        >
          <AuroraBackground primaryColor={primary} />

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

          {/* Illustration */}
          <div className="relative z-10 flex items-center justify-center flex-1 py-10">
            <div className="float-art scale-in">
              <RecoveryArt primaryColor={primary} step={step} />
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
              Account Recovery
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(24px, 2.4vw, 38px)", letterSpacing: "-0.035em",
              color: "#ffffff", lineHeight: 1.1, marginBottom: "14px",
              transition: "opacity 0.3s",
            }}>
              {step === 1 ? (
                <>Find your<br /><span style={{ color: primary }}>account.</span></>
              ) : (
                <>Verify &amp;<br /><span style={{ color: primary }}>reset.</span></>
              )}
            </h2>

            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "14px", lineHeight: 1.7, maxWidth: "340px", marginBottom: "28px" }}>
              {step === 1
                ? "Enter your username to begin secure password recovery in just two steps."
                : "Answer your security questions and choose a strong new password."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {(step === 1 ? [
                "Enter your account username",
                "We'll verify your identity",
                "Reset securely in two steps",
              ] : [
                "Answer 3 security questions",
                "Choose a strong new password",
                "Back to your account instantly",
              ]).map((tip) => (
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
          className="w-full lg:w-[54%] flex items-start justify-center overflow-y-auto px-6 py-12"
          style={{ background: background }}
        >
          <div className="w-full max-w-[480px]">

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
            <div className="fade-up mb-7">
              <div style={{
                width: "50px", height: "50px", borderRadius: "13px", marginBottom: "18px",
                background: `${primary}15`, border: `1.5px solid ${primary}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" fill="none" stroke={primary} strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "4px 12px", borderRadius: "999px",
                border: `1px solid ${primary}44`, background: `${primary}12`,
                color: primary, fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.05em", marginBottom: "12px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <span style={{ height: "5px", width: "5px", borderRadius: "50%", background: primary }} />
                Account Recovery
              </div>

              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(24px, 2.6vw, 36px)", letterSpacing: "-0.035em",
                color: text, lineHeight: 1.1, marginBottom: "10px",
              }}>
                Reset your<br />
                <span style={{ color: primary }}>password</span>
              </h1>
              <p style={{ color: textSecondary, fontSize: "14px", lineHeight: 1.6 }}>
                {step === 1
                  ? "Enter your username to begin the recovery process."
                  : "Answer your security questions and set a new password."}
              </p>
            </div>

            {/* Step bar */}
            <StepBar step={step} primary={primary} text={text} textSecondary={textSecondary} border={border} />

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

            {/* ════ STEP 1: Username ════ */}
            {step === 1 && (
              <form onSubmit={handleUsernameSubmit} className="step-enter" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="fade-up fade-up-d1">
                  <FieldLabel>Username <span style={{ color: primary }}>*</span></FieldLabel>
                  <ThemedInput
                    id="username" type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(null); }}
                    required icon={UserIcon}
                  />
                </div>

                <button type="submit" className="btn-primary-reset fade-up fade-up-d2">
                  Continue
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <div className="text-center fade-up fade-up-d2">
                  <Link href="/login" style={{
                    fontSize: "13px", fontWeight: 600, color: textSecondary,
                    textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                    display: "inline-flex", alignItems: "center", gap: "6px", transition: "color 0.15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </form>
            )}

            {/* ════ STEP 2: Security Qs + Password ════ */}
            {step === 2 && (
              <form onSubmit={handleResetSubmit} className="step-enter" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                <SectionDivider label="Security Questions" />

                {/* Q1, Q2, Q3 */}
                {([1, 2, 3] as const).map((n) => {
                  const qKey = `secretQuestion${n}` as keyof typeof formData;
                  const aKey = `secretQuestion${n}Answer` as keyof typeof formData;
                  return (
                    <div key={n} className={`fade-up fade-up-d${n}`} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <FieldLabel>
                        Security Question {n} <span style={{ color: primary }}>*</span>
                      </FieldLabel>
                      <ThemedSelect
                        value={formData[qKey] as number}
                        onChange={(e) => handleChange(qKey, Number(e.target.value))}
                        required
                      >
                        <option value={0}>Select a question…</option>
                        {getAvailableQuestions(formData[qKey] as number).map((q) => (
                          <option key={q.questionId} value={q.questionId}>{q.question}</option>
                        ))}
                      </ThemedSelect>
                      <ThemedInput
                        type="text"
                        placeholder="Your answer"
                        value={formData[aKey] as string}
                        onChange={(e) => handleChange(aKey, e.target.value)}
                        required
                        disabled={!formData[qKey]}
                        icon={ChatIcon}
                      />
                    </div>
                  );
                })}

                <SectionDivider label="New Password" />

                {/* New password */}
                <div className="fade-up fade-up-d4">
                  <FieldLabel>New Password <span style={{ color: primary }}>*</span></FieldLabel>
                  <ThemedInput
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    required icon={LockIcon}
                    rightSlot={<ToggleBtn show={showNewPassword} onToggle={() => setShowNewPassword(v => !v)} />}
                  />
                </div>

                {formData.newPassword && (
                  <StrengthBar password={formData.newPassword} primaryColor={primary} />
                )}

                {/* Confirm password */}
                <div className="fade-up fade-up-d4">
                  <FieldLabel>Confirm Password <span style={{ color: primary }}>*</span></FieldLabel>
                  <ThemedInput
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required icon={CheckIcon}
                    rightSlot={<ToggleBtn show={showConfirmPassword} onToggle={() => setShowConfirmPassword(v => !v)} />}
                  />
                  {formData.confirmPassword && (
                    <p style={{
                      marginTop: "6px", fontSize: "12px", fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      color: passwordsMatch ? "#22c55e" : "#ef4444",
                    }}>
                      {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !!passwordsMismatch}
                  className="btn-primary-reset fade-up fade-up-d4 mt-1"
                >
                  {loading ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting password…
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Back to step 1 */}
                <button type="button" disabled={loading}
                  className="btn-secondary-reset"
                  onClick={() => { setStep(1); setError(null); }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to Step 1
                </button>

                <div className="text-center">
                  <Link href="/login" style={{
                    fontSize: "13px", fontWeight: 600, color: textSecondary,
                    textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                    display: "inline-flex", alignItems: "center", gap: "4px", transition: "color 0.15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
                  >
                    Remember your password? Sign in →
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}