"use client";
import { themes, useTheme } from "@/context/ThemeContext";
import React, { useState, useEffect, useRef } from "react";

const ThemePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColorInput, setCustomColorInput] = useState("#3b82f6");
  const { themeName, setTheme, customColor, setCustomColor, availableThemes } =
    useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (theme: string) => {
    setTheme(theme);
    setIsOpen(false);
  };

  const handleCustomColorSelect = () => {
    setCustomColor(customColorInput);
    setIsOpen(false);
  };

  const handleResetToTheme = () => {
    setCustomColor(null);
    setIsOpen(false);
  };

  const getCurrentColor = () => {
    if (customColor) return customColor;
    const theme = themes[themeName as keyof typeof themes];
    return theme?.primary || "#3b82f6";
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        left: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1000,
      }}
    >
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: getCurrentColor(),
          border: "2px solid var(--theme-border, #e5e7eb)",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
            fill="white"
          />
          <path
            d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7Z"
            fill="white"
          />
        </svg>
      </button>

      {/* Theme Picker Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            left: "60px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "var(--theme-surface, #ffffff)",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            minWidth: "280px",
            border: "1px solid var(--theme-border, #e5e7eb)",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--theme-text, #111827)",
            }}
          >
            Choose Theme
          </h3>

          {/* Theme Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {availableThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeSelect(theme)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `2px solid ${
                    themeName === theme && !customColor
                      ? "var(--theme-primary, #3b82f6)"
                      : "var(--theme-border, #e5e7eb)"
                  }`,
                  backgroundColor: "var(--theme-surface, #ffffff)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor:
                      themes[theme as keyof typeof themes].primary,
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--theme-text, #111827)",
                    textTransform: "capitalize",
                  }}
                >
                  {theme}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Color Picker */}
          <div
            style={{
              borderTop: "1px solid var(--theme-border, #e5e7eb)",
              paddingTop: "12px",
              marginTop: "8px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                color: "var(--theme-text, #111827)",
              }}
            >
              Custom Color
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="color"
                value={customColorInput}
                onChange={(e) => setCustomColorInput(e.target.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "1px solid var(--theme-border, #e5e7eb)",
                }}
              />
              <button
                onClick={handleCustomColorSelect}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--theme-primary, #3b82f6)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Apply Custom Color
              </button>
            </div>
          </div>

          {/* Reset Button */}
          {customColor && (
            <button
              onClick={handleResetToTheme}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid var(--theme-border, #e5e7eb)",
                backgroundColor: "transparent",
                color: "var(--theme-text, #111827)",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--theme-surface, #f3f4f6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Reset to {themeName} theme
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
