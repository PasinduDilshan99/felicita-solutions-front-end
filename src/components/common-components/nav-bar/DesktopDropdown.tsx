// components/DesktopDropdown.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavBarItem } from "@/types/nav-bar-types";
import { getVisibleSubmenus } from "@/utils/utils";
import { useTheme } from "@/context/ThemeContext";

interface DesktopDropdownProps {
  item: NavBarItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isActive: boolean;
}

const DesktopDropdown: React.FC<DesktopDropdownProps> = ({
  item,
  isOpen,
  onToggle,
  onClose,
  isActive,
}) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const visibleSubmenus = getVisibleSubmenus(item);

  const isSubmenuActive = (linkUrl: string) => {
    if (pathname === linkUrl) return true;
    if (pathname?.startsWith(linkUrl) && linkUrl !== '/') return true;
    return false;
  };

  const buttonStyle = {
    color: isActive || isOpen ? theme.primary : theme.text,
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    padding: '10px 2px',
    position: 'relative' as const,
    transition: 'color 0.2s ease',
  };

  const activeIndicatorStyle = {
    content: '""',
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: '2px',
    height: '4px',
    background: theme.primary,
    borderRadius: '999px',
  };

  return (
    <div className="relative group nav-dropdown">
      <button
        onClick={onToggle}
        className="relative font-semibold transition-colors duration-200 flex items-center space-x-1"
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!isOpen && !isActive) {
            e.currentTarget.style.color = theme.primary;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen && !isActive) {
            e.currentTarget.style.color = theme.text;
          }
        }}
      >
        <span>{item.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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
        {isActive && <span style={activeIndicatorStyle}></span>}
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2 w-56 rounded-lg shadow-xl border z-50"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="py-2">
            {visibleSubmenus.map((submenu) => {
              const submenuIsActive = isSubmenuActive(submenu.linkUrl);
              
              return (
                <Link
                  key={submenu.id}
                  href={submenu.linkUrl}
                  className="flex items-center space-x-3 px-4 py-3 transition-colors duration-200"
                  style={{
                    color: submenuIsActive ? theme.primary : theme.text,
                    backgroundColor: submenuIsActive ? `${theme.primary}20` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!submenuIsActive) {
                      e.currentTarget.style.color = theme.primary;
                      e.currentTarget.style.backgroundColor = `${theme.primary}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submenuIsActive) {
                      e.currentTarget.style.color = theme.text;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={onClose}
                >
                  {submenu.icon && (
                    <i className={`${submenu.icon} w-4 h-4 text-current`}></i>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{submenu.name}</div>
                    {submenu.description && (
                      <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                        {submenu.description}
                      </div>
                    )}
                  </div>
                  {submenuIsActive && (
                    <div 
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    ></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopDropdown;