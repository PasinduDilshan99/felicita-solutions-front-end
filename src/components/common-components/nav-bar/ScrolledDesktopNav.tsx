// components/ScrolledDesktopNav.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavBarItem } from "@/types/nav-bar-types";
import { User } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import ScrolledDesktopDropdown from "./ScrolledDesktopDropdown";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import UserDropdown from "./UserDropdown";

interface ScrolledDesktopNavProps {
  visibleItems: NavBarItem[];
  moreItems: NavBarItem[];
  user: User | null;
  companyName: string;
  isScrolledMenuOpen: boolean;
  setIsScrolledMenuOpen: (open: boolean) => void;
  onCloseAll: () => void;
}

const ScrolledDesktopNav: React.FC<ScrolledDesktopNavProps> = ({
  visibleItems,
  moreItems,
  user,
  companyName,
  onCloseAll,
}) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [activeScrolledDropdown, setActiveScrolledDropdown] = useState<number | null>(null);
  const [isScrolledMoreDropdownOpen, setIsScrolledMoreDropdownOpen] = useState(false);

  const isItemActive = (item: NavBarItem) => {
    if (pathname === item.linkUrl) return true;
    if (pathname?.startsWith(item.linkUrl) && item.linkUrl !== "/") return true;

    if (item.submenus && item.submenus.length > 0) {
      return item.submenus.some((submenu) => {
        if (pathname === submenu.linkUrl) return true;
        if (pathname?.startsWith(submenu.linkUrl) && submenu.linkUrl !== "/")
          return true;
        return false;
      });
    }

    return false;
  };

  const isSubmenuItemActive = (linkUrl: string) => {
    if (pathname === linkUrl) return true;
    if (pathname?.startsWith(linkUrl) && linkUrl !== "/") return true;
    return false;
  };

  const handleScrolledDropdownToggle = (itemId: number) => {
    setActiveScrolledDropdown(activeScrolledDropdown === itemId ? null : itemId);
    setIsScrolledMoreDropdownOpen(false);
  };

  const closeAllDropdowns = () => {
    setActiveScrolledDropdown(null);
    setIsScrolledMoreDropdownOpen(false);
    onCloseAll();
  };

  const navLinkStyle = {
    color: theme.text,
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    padding: "6px 2px",
    position: "relative" as const,
    transition: "color 0.2s ease",
  };

  const activeIndicatorStyle = {
    content: '""',
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: "-2px",
    height: "3px",
    background: theme.primary,
    borderRadius: "999px",
  };

  const logoUrl = "/logo.png";

  return (
    <>
      <div className="flex items-center">
        <Link
          href="/"
          className="block hover:opacity-90 transition-opacity duration-300"
          onClick={closeAllDropdowns}
        >
          <Image
            src={logoUrl}
            alt={companyName}
            width={2000}
            height={2000}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="hidden lg:flex items-center space-x-4 nav-dropdown">
        {visibleItems.map((item) => {
          const hasSubmenu =
            item.submenus &&
            item.submenus.filter((sub) => sub.status === "VISIBLE").length > 0;
          const isActive = isItemActive(item);

          if (hasSubmenu) {
            return (
              <ScrolledDesktopDropdown
                key={item.id}
                item={item}
                isOpen={activeScrolledDropdown === item.id}
                onToggle={() => handleScrolledDropdownToggle(item.id)}
                onClose={closeAllDropdowns}
                isActive={isActive}
              />
            );
          }

          return (
            <Link
              key={item.id}
              href={item.linkUrl}
              className="relative font-semibold transition-colors duration-200"
              style={{
                ...navLinkStyle,
                color: isActive ? theme.primary : theme.text,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = theme.text;
                }
              }}
              onClick={closeAllDropdowns}
            >
              {item.name}
              {isActive && <span style={activeIndicatorStyle}></span>}
            </Link>
          );
        })}

        {moreItems.length > 0 && (
          <div className="relative nav-dropdown">
            <button
              onClick={() => {
                setIsScrolledMoreDropdownOpen(!isScrolledMoreDropdownOpen);
                setActiveScrolledDropdown(null);
              }}
              className="relative font-semibold transition-colors duration-200 flex items-center space-x-1"
              style={{
                ...navLinkStyle,
                color: isScrolledMoreDropdownOpen ? theme.primary : theme.text,
              }}
              onMouseEnter={(e) => {
                if (!isScrolledMoreDropdownOpen) {
                  e.currentTarget.style.color = theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isScrolledMoreDropdownOpen) {
                  e.currentTarget.style.color = theme.text;
                }
              }}
            >
              <span>More</span>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
                  isScrolledMoreDropdownOpen ? "rotate-180" : ""
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

            {isScrolledMoreDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border z-50"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
              >
                <div className="py-2">
                  {moreItems.map((item) => {
                    const hasSubmenu =
                      item.submenus &&
                      item.submenus.filter((sub) => sub.status === "VISIBLE").length > 0;
                    const isActive = isItemActive(item);

                    if (hasSubmenu) {
                      return (
                        <div key={item.id} className="relative group">
                          <button
                            onClick={() => handleScrolledDropdownToggle(item.id)}
                            className="flex items-center justify-between w-full px-4 py-2 transition-colors duration-200 text-sm"
                            style={{
                              color: activeScrolledDropdown === item.id || isActive
                                ? theme.primary
                                : theme.text,
                              backgroundColor: activeScrolledDropdown === item.id || isActive
                                ? `${theme.primary}20`
                                : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (activeScrolledDropdown !== item.id && !isActive) {
                                e.currentTarget.style.color = theme.primary;
                                e.currentTarget.style.backgroundColor = `${theme.primary}20`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (activeScrolledDropdown !== item.id && !isActive) {
                                e.currentTarget.style.color = theme.text;
                                e.currentTarget.style.backgroundColor = "transparent";
                              }
                            }}
                          >
                            <span className="flex items-center gap-2">
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

                          {activeScrolledDropdown === item.id && (
                            <div
                              className="absolute left-full top-0 ml-1 w-48 rounded-lg shadow-xl border z-50"
                              style={{
                                backgroundColor: theme.surface,
                                borderColor: theme.border,
                              }}
                            >
                              <div className="py-2">
                                {item.submenus
                                  .filter((sub) => sub.status === "VISIBLE")
                                  .map((submenu) => {
                                    const isSubActive = isSubmenuItemActive(submenu.linkUrl);

                                    return (
                                      <Link
                                        key={submenu.id}
                                        href={submenu.linkUrl}
                                        className="flex items-center space-x-2 px-4 py-2 transition-colors duration-200 text-sm"
                                        style={{
                                          color: isSubActive ? theme.primary : theme.text,
                                          backgroundColor: isSubActive ? `${theme.primary}20` : "transparent",
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
                                            e.currentTarget.style.backgroundColor = "transparent";
                                          }
                                        }}
                                        onClick={closeAllDropdowns}
                                      >
                                        {submenu.icon && (
                                          <i className={`${submenu.icon} w-3 h-3`} />
                                        )}
                                        <span className="flex-1">{submenu.name}</span>
                                        {isSubActive && (
                                          <span
                                            className="w-1 h-1 rounded-full"
                                            style={{ backgroundColor: theme.primary }}
                                          />
                                        )}
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
                        className="flex items-center justify-between px-4 py-2 transition-colors duration-200 text-sm"
                        style={{
                          color: isActive ? theme.primary : theme.text,
                          backgroundColor: isActive ? `${theme.primary}20` : "transparent",
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
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                        onClick={closeAllDropdowns}
                      >
                        <span className="flex items-center gap-2">
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
        )}
      </div>

      <div className="hidden md:flex items-center space-x-3">
        {user ? (
          <UserDropdown
            user={user}
            onLogout={logout}
            onCloseAll={closeAllDropdowns}
          />
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-xs uppercase tracking-wider"
              style={{
                color: theme.text,
                border: `1px solid ${theme.border}`,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.primary;
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme.text;
                e.currentTarget.style.borderColor = theme.border;
              }}
              onClick={closeAllDropdowns}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-xs uppercase tracking-wider"
              style={{
                backgroundColor: theme.primary,
                color: "#ffffff",
                border: `1px solid ${theme.primary}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              onClick={closeAllDropdowns}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ScrolledDesktopNav;