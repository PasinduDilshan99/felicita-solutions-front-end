// components/home-page-components/OurStack.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

interface StackItem {
  id: number;
  name: string;
  icon: string;
  color: string;
}

const OurStack = () => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  const stackItems: StackItem[] = [
    { id: 1, name: "React", icon: "/icons/react.svg", color: "#61DAFB" },
    { id: 2, name: "Next.js", icon: "/icons/nextjs.svg", color: "#000000" },
    { id: 3, name: "Node.js", icon: "/icons/nodejs.svg", color: "#339933" },
    { id: 4, name: "Python", icon: "/icons/python.svg", color: "#3776AB" },
    { id: 5, name: "Java", icon: "/icons/java.svg", color: "#007396" },
    { id: 6, name: "TypeScript", icon: "/icons/typescript.svg", color: "#3178C6" },
    { id: 7, name: "JavaScript", icon: "/icons/javascript.svg", color: "#F7DF1E" },
    { id: 8, name: "MongoDB", icon: "/icons/mongodb.svg", color: "#47A248" },
    { id: 9, name: "PostgreSQL", icon: "/icons/postgresql.svg", color: "#4169E1" },
    { id: 10, name: "MySQL", icon: "/icons/mysql.svg", color: "#4479A1" },
    { id: 11, name: "Docker", icon: "/icons/docker.svg", color: "#2496ED" },
    { id: 12, name: "Kubernetes", icon: "/icons/kubernetes.svg", color: "#326CE5" },
    { id: 13, name: "AWS", icon: "/icons/aws.svg", color: "#FF9900" },
    { id: 14, name: "Azure", icon: "/icons/azure.svg", color: "#0089D6" },
    { id: 15, name: "Google Cloud", icon: "/icons/gcp.svg", color: "#4285F4" },
    { id: 16, name: "GraphQL", icon: "/icons/graphql.svg", color: "#E10098" },
    { id: 17, name: "Tailwind CSS", icon: "/icons/tailwind.svg", color: "#06B6D4" },
    { id: 18, name: "Figma", icon: "/icons/figma.svg", color: "#F24E1E" },
  ];

  // Triple the items for seamless infinite scroll
  const duplicatedItems = [...stackItems, ...stackItems, ...stackItems];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const speed = 0.5;

    const scroll = () => {
      if (!scrollContainer) return;
      
      if (!isHovered) {
        scrollPosition += speed;
        
        // Reset position when we've scrolled through one set
        if (scrollPosition >= scrollContainer.scrollWidth / 3) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  // Get fallback SVG icons
  const getFallbackIcon = (name: string, color: string) => {
    return (
      <div
        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-3xl md:text-4xl font-bold transition-all duration-300"
        style={{
          color: color,
        }}
      >
        {name.charAt(0) + name.charAt(1)}
      </div>
    );
  };

  return (
    <section className="w-full py-20 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
        }}
      />

      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="relative z-10 ">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span
              className="text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.primary,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              Our Technology Stack
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            Technologies We Work With
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            We leverage cutting-edge technologies to build robust and scalable solutions
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Smooth Carousel Container */}
        <div
          ref={scrollRef}
          className="overflow-x-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            scrollBehavior: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="flex gap-8 md:gap-12 py-8" style={{ width: "max-content" }}>
            {duplicatedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex flex-col items-center gap-3 group cursor-pointer flex-shrink-0 transition-all duration-500 hover:scale-110"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {/* Icon Container */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all duration-500"
                  style={{
                    backgroundColor: `${theme.surface}`,
                    border: `1px solid ${theme.border}`,
                    boxShadow: isHovered ? `0 20px 40px -12px ${theme.primary}30` : `0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {item.icon ? (
                    <div className="relative w-12 h-12 md:w-14 md:h-14">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className="object-contain transition-all duration-500"
                        style={{
                          filter: `grayscale(100%)`,
                          transition: "filter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = "grayscale(0%)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = "grayscale(100%)";
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="transition-all duration-500"
                      style={{
                        filter: `grayscale(100%)`,
                        transition: "filter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "grayscale(0%)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "grayscale(100%)";
                      }}
                    >
                      {getFallbackIcon(item.name, item.color)}
                    </div>
                  )}
                </div>

                {/* Label - appears smoothly on hover */}
                <span
                  className="text-sm font-medium transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-0 group-hover:translate-y-0"
                  style={{
                    color: theme.textSecondary,
                    transition: "opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlays for smooth edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${theme.background}, transparent)`,
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${theme.background}, transparent)`,
          }}
        />

        {/* Scroll Hint - Pulsing animation */}
        <div className="text-center mt-8">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: `${theme.primary}10`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <svg
              className="w-4 h-4 animate-pulse-x"
              style={{ color: theme.primary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              {isHovered ? "Paused — Hover to resume" : "Auto-scrolling — Hover to pause"}
            </span>
            <svg
              className="w-4 h-4 animate-pulse-x"
              style={{ color: theme.primary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-x {
          0%, 100% {
            transform: translateX(0);
            opacity: 0.5;
          }
          50% {
            transform: translateX(5px);
            opacity: 1;
          }
        }
        
        .animate-pulse-x {
          animation: pulse-x 1.5s ease-in-out infinite;
        }
        
        /* Smooth gradient edges */
        .mask-fade {
          mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
        }
      `}</style>
    </section>
  );
};

export default OurStack;