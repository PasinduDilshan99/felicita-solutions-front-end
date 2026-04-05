// types/nav-bar-types.ts (update if needed - same as you have)

// components/NavBarContainer.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface NavBarContainerProps {
  children: React.ReactNode;
  isScrolled: boolean;
}

const NavBarContainer: React.FC<NavBarContainerProps> = ({ children, isScrolled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".nav-dropdown")) {
        // Close dropdowns logic if needed
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="nav-container"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {children}
    </div>
  );
};

export default NavBarContainer;