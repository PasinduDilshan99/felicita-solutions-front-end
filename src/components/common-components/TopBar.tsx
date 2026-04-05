// components/TopBar.tsx
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

interface TopBarProps {
  companyName?: string;
  address?: string;
  logoUrl?: string;
  onCloseAll?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  companyName = "Your Software Company",
  address = "139 Baker Street, London, United Kingdom",
  logoUrl = "/logo.png",
  onCloseAll,
}) => {
  const { theme } = useTheme();

  const handleClick = () => {
    if (onCloseAll) {
      onCloseAll();
    }
  };

  return (
    <div
      className="hidden lg:block w-full border-b"
      style={{
        backgroundColor: `${theme.primary}08`,
        borderColor: `${theme.primary}20`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="block hover:opacity-80 transition-opacity duration-200"
              onClick={handleClick}
            >
              <Image
                src={logoUrl}
                alt={companyName}
                width={80}
                height={20}
                className="h-4 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right side - Address */}
          <div className="flex items-center">
            <div
              className="flex items-center gap-1.5 text-xs"
              style={{ color: theme.textSecondary || theme.text }}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="tracking-wide">{address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
