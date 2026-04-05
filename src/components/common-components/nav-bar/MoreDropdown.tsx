// components/MoreDropdown.tsx
"use client";
import React from "react";
import Link from "next/link";
import { NavBarItem } from "@/types/nav-bar-types";
import { getVisibleSubmenus, hasSubmenus } from "@/utils/utils";
import { useTheme } from "@/context/ThemeContext";

interface MoreDropdownProps {
  items: NavBarItem[];
  isOpen: boolean;
  onToggle: () => void;
  activeDropdown: number | null;
  onActiveDropdownChange: (id: number | null) => void;
  onClose: () => void;
  currentPath: string | null;
  isScrolled?: boolean;
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({
  items,
  isOpen,
  onToggle,
  activeDropdown,
  onActiveDropdownChange,
  onClose,
  currentPath,
  isScrolled = false,
}) => {
  const { theme } = useTheme();

  const isItemActive = (item: NavBarItem) => {
    if (currentPath === item.linkUrl) return true;
    if (currentPath?.startsWith(item.linkUrl) && item.linkUrl !== '/') return true;
    
    if (item.submenus && item.submenus.length > 0) {
      return item.submenus.some(submenu => {
        if (currentPath === submenu.linkUrl) return true;
        if (currentPath?.startsWith(submenu.linkUrl) && submenu.linkUrl !== '/') return true;
        return false;
      });
    }
    
    return false;
  };

  const isSubmenuItemActive = (linkUrl: string) => {
    if (currentPath === linkUrl) return true;
    if (currentPath?.startsWith(linkUrl) && linkUrl !== '/') return true;
    return false;
  };

  const handleNestedToggle = (itemId: number) => {
    onActiveDropdownChange(activeDropdown === itemId ? null : itemId);
  };

  const dropdownButtonClasses = isScrolled
    ? "relative font-semibold transition-colors duration-200 px-2 py-1 rounded-md text-sm flex items-center space-x-1 uppercase tracking-wider"
    : "relative font-semibold transition-colors duration-200 px-3 py-2 rounded-lg flex items-center space-x-1 uppercase tracking-wider";

  const dropdownMenuClasses = isScrolled
    ? "absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl border z-50"
    : "absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border z-50";

  const nestedDropdownClasses = isScrolled
    ? "absolute left-full top-0 ml-1 w-40 rounded-lg shadow-xl border z-50"
    : "absolute left-full top-0 ml-1 w-48 rounded-lg shadow-xl border z-50";

  return (
    <div className="relative nav-dropdown">
      <button
        onClick={onToggle}
        className={dropdownButtonClasses}
        style={{
          color: isOpen ? theme.primary : theme.text,
          backgroundColor: isOpen ? `${theme.primary}20` : 'transparent',
          letterSpacing: '0.06em',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = theme.primary;
            e.currentTarget.style.backgroundColor = `${theme.primary}20`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = theme.text;
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <span>More</span>
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
        {!isScrolled && (
          <span
            className="absolute left-0 -bottom-1 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full"
            style={{
              backgroundColor: theme.primary,
            }}
          ></span>
        )}
      </button>

      {isOpen && (
        <div
          className={dropdownMenuClasses}
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className={isScrolled ? "py-1" : "py-2"}>
            {items.map((item) => {
              const hasSubmenu = hasSubmenus(item);
              const isActive = isItemActive(item);

              if (hasSubmenu) {
                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleNestedToggle(item.id)}
                      className="flex items-center justify-between w-full px-4 py-2 transition-colors duration-200"
                      style={{
                        color: activeDropdown === item.id || isActive 
                          ? theme.primary 
                          : theme.text,
                        backgroundColor:
                          activeDropdown === item.id || isActive
                            ? `${theme.primary}20`
                            : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (activeDropdown !== item.id && !isActive) {
                          e.currentTarget.style.color = theme.primary;
                          e.currentTarget.style.backgroundColor = `${theme.primary}20`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeDropdown !== item.id && !isActive) {
                          e.currentTarget.style.color = theme.text;
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className={`${isScrolled ? "text-sm" : ""} flex items-center gap-2 uppercase tracking-wider`}>
                        {item.name}
                        {isActive && (
                          <span 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: theme.primary }}
                          />
                        )}
                      </span>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {activeDropdown === item.id && (
                      <div
                        className={nestedDropdownClasses}
                        style={{
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                        }}
                      >
                        <div className={isScrolled ? "py-1" : "py-2"}>
                          {getVisibleSubmenus(item).map((submenu) => {
                            const isSubActive = isSubmenuItemActive(submenu.linkUrl);
                            
                            return (
                              <Link
                                key={submenu.id}
                                href={submenu.linkUrl}
                                className="flex items-center space-x-2 px-4 py-2 transition-colors duration-200"
                                style={{
                                  color: isSubActive ? theme.primary : theme.text,
                                  backgroundColor: isSubActive ? `${theme.primary}20` : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.color = theme.primary;
                                    e.currentTarget.style.backgroundColor = `${theme.primary}20`;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.color = theme.text;
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }
                                }}
                                onClick={onClose}
                              >
                                {submenu.icon && (
                                  <i
                                    className={`${submenu.icon} w-3 h-3`}
                                    style={{ color: 'currentColor' }}
                                  />
                                )}
                                <span className={`${isScrolled ? "text-sm" : ""} flex items-center gap-2 uppercase tracking-wider`}>
                                  {submenu.name}
                                  {isSubActive && (
                                    <span 
                                      className="w-1.5 h-1.5 rounded-full" 
                                      style={{ backgroundColor: theme.primary }}
                                    />
                                  )}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.linkUrl}
                  className="block px-4 py-2 transition-colors duration-200"
                  style={{
                    color: isActive ? theme.primary : theme.text,
                    backgroundColor: isActive ? `${theme.primary}20` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = theme.primary;
                      e.currentTarget.style.backgroundColor = `${theme.primary}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = theme.text;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={onClose}
                >
                  <span className={`${isScrolled ? "text-sm" : ""} flex items-center gap-2 uppercase tracking-wider`}>
                    {item.name}
                    {isActive && (
                      <span 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: theme.primary }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;