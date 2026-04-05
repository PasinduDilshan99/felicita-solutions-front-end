// components/MobileMenuItem.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { NavBarItem } from "@/types/nav-bar-types";
import { getVisibleSubmenus } from "@/utils/utils";
import { useTheme } from "@/context/ThemeContext";

interface MobileMenuItemProps {
  item: NavBarItem;
  onClose: () => void;
  isScrolled?: boolean;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ 
  item, 
  onClose, 
  isScrolled = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const visibleSubmenus = getVisibleSubmenus(item);
  const hasSubmenu = visibleSubmenus.length > 0;

  const buttonClasses = isScrolled
    ? "flex items-center justify-between w-full px-3 py-2 rounded-md font-medium transition-all duration-200 border border-transparent text-sm uppercase tracking-wider"
    : "flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-transparent uppercase tracking-wider";

  const linkClasses = isScrolled
    ? "block px-3 py-2 rounded-md font-medium transition-all duration-200 border border-transparent text-sm uppercase tracking-wider"
    : "block px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-transparent uppercase tracking-wider";

  if (hasSubmenu) {
    return (
      <div className="border-b last:border-b-0" style={{ borderColor: theme.border }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={buttonClasses}
          style={{ color: theme.text }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.primary}20`;
          }}
          onMouseLeave={(e) => {
            if (!isExpanded) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span>{item.name}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="pl-4 mt-1 space-y-1">
            {visibleSubmenus.map((submenu) => (
              <Link
                key={submenu.id}
                href={submenu.linkUrl}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-transparent text-sm"
                style={{ color: theme.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  onClose();
                  setIsExpanded(false);
                }}
              >
                {submenu.icon && (
                  <i className={`${submenu.icon} w-3 h-3`}></i>
                )}
                <div>
                  <div>{submenu.name}</div>
                  {submenu.description && !isScrolled && (
                    <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                      {submenu.description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-b last:border-b-0" style={{ borderColor: theme.border }}>
      <Link
        href={item.linkUrl}
        className={linkClasses}
        style={{ color: theme.text }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${theme.primary}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        onClick={onClose}
      >
        {item.name}
      </Link>
    </div>
  );
};

export default MobileMenuItem;