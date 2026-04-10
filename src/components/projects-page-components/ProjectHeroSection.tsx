// components/ProjectHeroSection.tsx
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroService } from "@/services/heroService";
import { PageHeroSection } from "@/types/hero-types";
import { useTheme } from "@/context/ThemeContext";

const ProjectHeroSection = () => {
  const [heroDataList, setHeroDataList] = useState<PageHeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState(0);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorIn, setIsCursorIn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const heroData = heroDataList[currentSlide];

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Cursor tracking for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setCursorPosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);
    section?.addEventListener("mouseenter", () => setIsCursorIn(true));
    section?.addEventListener("mouseleave", () => setIsCursorIn(false));
    
    return () => {
      section?.removeEventListener("mousemove", handleMouseMove);
      section?.removeEventListener("mouseenter", () => setIsCursorIn(true));
      section?.removeEventListener("mouseleave", () => setIsCursorIn(false));
    };
  }, []);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await HeroService.fetchProjectsHeroData();

        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setHeroDataList(data);
        } else {
          setError("No projects hero section data available");
        }
      } catch (err) {
        console.error("Error fetching projects hero data:", err);
        setError("Something went wrong while fetching projects hero data");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Staggered animation sequence
  useEffect(() => {
    if (!loading && heroData) {
      setAnimationStage(0);
      
      const intervals = [
        setTimeout(() => setAnimationStage(1), 100),
        setTimeout(() => setAnimationStage(2), 300),
        setTimeout(() => setAnimationStage(3), 500),
        setTimeout(() => setAnimationStage(4), 700),
        setTimeout(() => setAnimationStage(5), 900),
        setTimeout(() => setAnimationStage(6), 1100),
      ];

      return () => intervals.forEach(interval => clearTimeout(interval));
    }
  }, [loading, heroData]);

  // Auto carousel
  useEffect(() => {
    if (heroDataList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroDataList.length);
      setAnimationStage(0);
    }, 7000);

    return () => clearInterval(interval);
  }, [heroDataList.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroDataList.length);
    setAnimationStage(0);
  }, [heroDataList.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroDataList.length) % heroDataList.length);
    setAnimationStage(0);
  }, [heroDataList.length]);

  if (loading) {
    return <ProjectHeroSkeleton />;
  }

  if (error || heroDataList.length === 0) {
    return <ProjectHeroError />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[650px] lg:min-h-[850px] flex items-center"
    >
      {/* Dynamic Background with Spotlight Effect */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, 
              ${theme.primary}15 0%, 
              ${theme.background} 70%)`,
            opacity: isCursorIn ? 1 : 0.5,
          }}
        />
        
        {/* Animated Diagonal Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-diagonal-sweep"
              style={{
                top: `${i * 25}%`,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${theme.primary}30, transparent)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "4s",
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        {particles.map((particle, idx) => (
          <div
            key={idx}
            className="absolute rounded-full animate-float-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: theme.primary,
              opacity: 0.3,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}

        {/* Animated Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 rounded-3xl animate-rotate-slow" style={{ borderColor: `${theme.primary}20` }} />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 rounded-full animate-pulse-slow" style={{ borderColor: `${theme.primary}15` }} />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl animate-float" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Project Counter Badge */}
            <div
              className={`inline-flex items-center gap-2 transform transition-all duration-700 ${
                animationStage >= 1
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="flex items-center gap-1 px-4 py-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                <span className="text-sm font-mono" style={{ color: theme.primary }}>
                  {heroData.name || "PROJECTS"}
                </span>
              </div>
              {heroData.subtitle && (
                <span className="text-sm font-mono" style={{ color: theme.textSecondary }}>
                  / {heroData.subtitle}
                </span>
              )}
            </div>

            {/* Title with Code-like Animation */}
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight font-mono transform transition-all duration-700 ${
                animationStage >= 2
                  ? "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0"
              }`}
              style={{ color: theme.text }}
            >
              {heroData.title.split("").map((char, idx) => (
                <span
                  key={idx}
                  className="inline-block hover:text-primary transition-colors duration-300"
                  style={{
                    animationDelay: `${idx * 0.02}s`,
                    display: "inline-block",
                    color: char === " " ? "inherit" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (char !== " ") e.currentTarget.style.color = theme.primary;
                  }}
                  onMouseLeave={(e) => {
                    if (char !== " ") e.currentTarget.style.color = "";
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Description with Terminal Cursor Effect */}
            <div
              className={`transform transition-all duration-700 ${
                animationStage >= 3
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div
                className="relative p-6 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10"
                style={{
                  boxShadow: `0 0 20px ${theme.primary}10`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="text-xs font-mono ml-2" style={{ color: theme.textSecondary }}>
                    terminal@{heroData.name?.toLowerCase() || "project"}:~$
                  </span>
                </div>
                <p className="text-base md:text-lg leading-relaxed font-mono" style={{ color: theme.textSecondary }}>
                  {heroData.description}
                  <span className="inline-block w-2 h-4 ml-1 animate-blink" style={{ backgroundColor: theme.primary }} />
                </p>
              </div>
            </div>

            {/* Highlight Text with Dynamic Stats */}
            {heroData.highlightText && (
              <div
                className={`grid grid-cols-2 gap-4 transform transition-all duration-700 delay-200 ${
                  animationStage >= 4
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                {heroData.highlightText.split(",").map((stat, idx) => {
                  const [value, label] = stat.trim().split(" ");
                  return (
                    <div
                      key={idx}
                      className="group relative p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-opacity-50 transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                           style={{ background: `radial-gradient(circle at center, ${theme.primary}10, transparent)` }} />
                      <div className="relative">
                        <div className="text-2xl font-bold font-mono" style={{ color: theme.primary }}>
                          {value}
                        </div>
                        <div className="text-xs uppercase tracking-wider mt-1" style={{ color: theme.textSecondary }}>
                          {label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Buttons with Improved Styles */}
            <div
              className={`flex flex-wrap gap-5 pt-4 transform transition-all duration-700 ${
                animationStage >= 5
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              {heroData.primaryButtonText && (
                <Link
                  href={heroData.primaryButtonLink || "/projects"}
                  className="group relative px-8 py-4 font-semibold transition-all duration-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}DD)`,
                    color: "#ffffff",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {heroData.primaryButtonText}
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-white/20" />
                </Link>
              )}

              {heroData.secondaryButtonText && (
                <Link
                  href={heroData.secondaryButtonLink || "/contact"}
                  className="group relative px-8 py-4 font-semibold transition-all duration-300 rounded-lg border-2 hover:shadow-lg"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    background: `${theme.primary}08`,
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {heroData.secondaryButtonText}
                  </span>
                  <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" 
                       style={{ background: `${theme.primary}15` }} />
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Image with Cyberpunk Glitch Effect */}
          <div
            className={`hidden lg:flex justify-center items-center transform transition-all duration-1000 ${
              animationStage >= 6
                ? "translate-x-0 opacity-100 scale-100"
                : "translate-x-40 opacity-0 scale-75"
            }`}
          >
            <div className="relative w-full max-w-md mx-auto group">
              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden">
                {/* Glitch Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-glitch-scan" />
                  <div className="absolute inset-0 flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-glitch-bar"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>

                <Image
                  src={heroData.imageUrl}
                  alt={heroData.title}
                  width={600}
                  height={600}
                  className="relative z-10 object-cover w-full h-auto transform transition-transform duration-500 group-hover:scale-110"
                  priority
                />

                {/* Cyberpunk Border */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4" style={{ borderColor: theme.primary }} />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4" style={{ borderColor: theme.primary }} />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4" style={{ borderColor: theme.primary }} />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4" style={{ borderColor: theme.primary }} />
                </div>
              </div>

              {/* Scanning Line Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan" />
              </div>

              {/* Data Nodes */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-cyan-500/50 blur-sm animate-ping" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 rounded-full bg-purple-500/50 blur-sm animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation - Hexagonal Design */}
      {heroDataList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Previous slide"
          >
            <div className="relative w-14 h-14 transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg transform rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white transform -rotate-45 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Next slide"
          >
            <div className="relative w-14 h-14 transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg transform rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white transform -rotate-45 group-hover:translate-x-1 transition-transform"
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
              </div>
            </div>
          </button>
        </>
      )}

      {/* Slide Indicators - Hexagonal Dots */}
      {heroDataList.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {heroDataList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setAnimationStage(0);
              }}
              className="group relative"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div
                className={`w-3 h-3 transition-all duration-300 transform rotate-45 ${
                  idx === currentSlide ? "bg-primary scale-125" : "bg-white/30"
                }`}
                style={{
                  backgroundColor: idx === currentSlide ? theme.primary : undefined,
                }}
              />
              {idx === currentSlide && (
                <div
                  className="absolute -inset-1 rounded-full animate-ping opacity-50"
                  style={{ backgroundColor: theme.primary }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar - Digital Style */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="relative h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
            style={{
              width: `${((currentSlide + 1) / heroDataList.length) * 100}%`,
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}CC, ${theme.primary})`,
              boxShadow: `0 0 10px ${theme.primary}`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes diagonal-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0px) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes glitch-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glitch-bar {
          0%, 100% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 0.5; transform: scaleY(1); }
        }
        
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 100%; }
        }
        
        .animate-diagonal-sweep {
          animation: diagonal-sweep 4s linear infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .animate-glitch-scan {
          animation: glitch-scan 2s linear infinite;
        }
        
        .animate-glitch-bar {
          animation: glitch-bar 0.5s ease-in-out infinite;
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

// Tech-themed Skeleton Loader
const ProjectHeroSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-[650px] lg:min-h-[850px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      {/* Animated Code Lines */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
            style={{
              top: `${i * 5}%`,
              left: 0,
              right: 0,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex gap-2">
              <div className="w-24 h-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse" />
              <div className="w-16 h-8 bg-white/5 rounded-full animate-pulse delay-150" />
            </div>
            <div className="space-y-4">
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-3/4 animate-pulse" />
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-2/3 animate-pulse delay-300" />
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
                <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse delay-150" />
                <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse delay-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-36 h-12 rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
              <div className="w-36 h-12 rounded-lg bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-96 h-96 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 animate-pulse mx-auto" />
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-cyan-500/30 animate-ping" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 rounded-full bg-purple-500/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cyberpunk Error Component
const ProjectHeroError = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-[500px] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5" />
      
      <div className="text-center space-y-6 relative z-10 max-w-md mx-auto px-4">
        <div className="relative">
          <div className="text-8xl font-mono font-bold animate-glitch" style={{ color: theme.primary }}>
            404
          </div>
          <div className="absolute inset-0 text-8xl font-mono font-bold animate-glitch-2 opacity-50" style={{ color: theme.primary }}>
            404
          </div>
        </div>
        
        <h3 className="text-2xl font-mono font-bold" style={{ color: theme.text }}>
          [ERROR]: PROJECTS_DATA_NOT_FOUND
        </h3>
        
        <p className="text-base font-mono" style={{ color: theme.textSecondary }}>
          &gt; Unable to fetch project showcase data_
          <span className="inline-block w-2 h-4 ml-1 animate-blink" style={{ backgroundColor: theme.primary }} />
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => window.location.reload()}
            className="group relative px-6 py-3 font-mono font-semibold transition-all rounded-lg overflow-hidden shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC)`,
              color: "#ffffff",
            }}
          >
            <span className="relative z-10">RETRY_CONNECTION</span>
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 font-mono font-semibold transition-all rounded-lg border-2"
            style={{
              borderColor: theme.primary,
              color: theme.primary,
            }}
          >
            RETURN_HOME
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .animate-glitch {
          animation: glitch 0.3s infinite;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
};

export default ProjectHeroSection;