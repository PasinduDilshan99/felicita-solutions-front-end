// components/AboutUsHeroSection.tsx
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroService } from "@/services/heroService";
import { PageHeroSection } from "@/types/hero-types";
import { useTheme } from "@/context/ThemeContext";

const AboutUsHeroSection = () => {
  const [heroDataList, setHeroDataList] = useState<PageHeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState(0);
  const [activeStat, setActiveStat] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const heroData = heroDataList[currentSlide];

  const stats = heroData?.highlightText?.split(",").map((stat) => {
    const [value, label] = stat.trim().split(/\s+(.+)/);
    return { value, label };
  }) || [
    { value: "10+", label: "Years Experience" },
    { value: "500+", label: "Projects" },
    { value: "100+", label: "Happy Clients" },
    { value: "24/7", label: "Support" },
  ];

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await HeroService.fetchAboutUsHeroData();

        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setHeroDataList(data);
        } else {
          setError("No about us hero section data available");
        }
      } catch (err) {
        console.error("Error fetching about us hero data:", err);
        setError("Something went wrong while fetching about us hero data");
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
        setTimeout(() => setAnimationStage(2), 250),
        setTimeout(() => setAnimationStage(3), 400),
        setTimeout(() => setAnimationStage(4), 550),
        setTimeout(() => setAnimationStage(5), 700),
        setTimeout(() => setAnimationStage(6), 850),
      ];

      return () => intervals.forEach((interval) => clearTimeout(interval));
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
    setCurrentSlide(
      (prev) => (prev - 1 + heroDataList.length) % heroDataList.length,
    );
    setAnimationStage(0);
  }, [heroDataList.length]);

  if (loading) {
    return <AboutHeroSkeleton />;
  }

  if (error || heroDataList.length === 0) {
    return <AboutHeroError />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[650px] lg:min-h-[850px] flex items-center"
    >
      {/* Circle-based Background - Keeping original */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${theme.primary}06 0%, ${theme.background} 100%)`,
          }}
        />

        {/* Large animated concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-concentric"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                border: `1px solid ${theme.primary}${15 - i * 2}`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "12s",
              }}
            />
          ))}
        </div>

        {/* Floating circles */}
        {[...Array(20)].map((_, idx) => (
          <div
            key={idx}
            className="absolute rounded-full animate-float-circle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 10}px`,
              height: `${Math.random() * 60 + 10}px`,
              border: `1px solid ${theme.primary}${Math.floor(Math.random() * 15 + 5)}`,
              background: `radial-gradient(circle, ${theme.primary}05, transparent)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 20 + 10}s`,
            }}
          />
        ))}

        {/* Small pulsing dots */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full animate-pulse-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: "2px",
              height: "2px",
              backgroundColor: theme.primary,
              opacity: Math.random() * 0.4,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}

        {/* Decorative corner circles */}
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 animate-pulse-slow"
          style={{ borderColor: `${theme.primary}15` }}
        />
        <div
          className="absolute bottom-10 right-10 w-24 h-24 rounded-full border-2 animate-pulse-slow-delayed"
          style={{ borderColor: `${theme.primary}12` }}
        />
      </div>

      {/* Main Content - Split Layout: Image Left, Content Right */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT COLUMN - Image with Circle Effects */}
          <div
            className={`transform transition-all duration-1000 ${
              animationStage >= 1
                ? "translate-x-0 opacity-100 scale-100"
                : "-translate-x-40 opacity-0 scale-90"
            }`}
          >
            <div className="relative w-full max-w-md mx-auto group">
              {/* Concentric circles around image */}
              <div className="absolute inset-0 -m-8 rounded-full">
                <div
                  className="absolute inset-0 rounded-full border-2 animate-spin-slow"
                  style={{ borderColor: `${theme.primary}25` }}
                />
                <div
                  className="absolute inset-4 rounded-full border-2 animate-spin-reverse"
                  style={{ borderColor: `${theme.primary}18` }}
                />
                <div
                  className="absolute inset-8 rounded-full border-2 animate-pulse-ring"
                  style={{ borderColor: `${theme.primary}12` }}
                />
              </div>

              {/* Main Image Container */}
              <div className="relative rounded-full overflow-hidden shadow-2xl">
                <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full" />
                </div>

                <Image
                  src={heroData.imageUrl}
                  alt={heroData.title}
                  width={500}
                  height={500}
                  className="relative z-10 object-cover w-full h-auto transform transition-transform duration-700 group-hover:scale-105 rounded-full"
                  priority
                />

                {/* Circular border */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none rounded-full ring-4 ring-offset-2 ring-offset-transparent"
                  style={{ ringColor: theme.primary }}
                />
              </div>

              {/* Orbiting dots */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-orbit"
                    style={{
                      backgroundColor: theme.primary,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: "8s",
                    }}
                  />
                ))}
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-6 py-2 shadow-lg whitespace-nowrap">
                <p
                  className="text-sm font-mono"
                  style={{ color: theme.primary }}
                >
                  EST. 2015
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Content */}
          <div className="space-y-8">
            {/* About Badge */}
            <div
              className={`inline-flex items-center gap-2 transform transition-all duration-700 ${
                animationStage >= 2
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.primary }}
                />
                <span
                  className="text-sm font-mono"
                  style={{ color: theme.primary }}
                >
                  {heroData.name || "ABOUT US"}
                </span>
              </div>
              {heroData.subtitle && (
                <span
                  className="text-sm font-mono"
                  style={{ color: theme.textSecondary }}
                >
                  / {heroData.subtitle}
                </span>
              )}
            </div>

            {/* Title with Modern Effect */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight transform transition-all duration-700 ${
                animationStage >= 3
                  ? "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0"
              }`}
            >
              {heroData.title.split(" ").map((word, idx) => (
                <span
                  key={idx}
                  className="inline-block mr-4 hover:scale-105 transition-all duration-300"
                  style={{
                    transitionDelay: `${idx * 0.05}s`,
                    background: `linear-gradient(135deg, ${theme.text}, ${theme.primary})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Description with Quote Style */}
            <div
              className={`transform transition-all duration-700 ${
                animationStage >= 4
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div
                className="relative p-6 rounded-2xl backdrop-blur-sm border"
                style={{
                  background: `${theme.primary}05`,
                  borderColor: `${theme.primary}20`,
                  boxShadow: `0 8px 32px ${theme.primary}10`,
                }}
              >
                {/* Quote Icon */}
                <div
                  className="absolute top-4 right-4 text-5xl font-serif opacity-20"
                  style={{ color: theme.primary }}
                >
                  "
                </div>

                <p
                  className="text-base md:text-lg leading-relaxed font-light relative z-10"
                  style={{ color: theme.textSecondary }}
                >
                  {heroData.description}
                </p>
              </div>
            </div>

            {/* Stats Grid with Animation */}
            <div
              className={`grid grid-cols-2 gap-4 transform transition-all duration-700 delay-300 ${
                animationStage >= 5
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative p-5 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-opacity-50 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setActiveStat(idx)}
                >
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${theme.primary}10, transparent)`,
                    }}
                  />
                  <div className="relative text-center">
                    <div
                      className="text-3xl md:text-4xl font-bold font-mono transition-all duration-300 group-hover:scale-110 inline-block"
                      style={{ color: theme.primary }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wider mt-2 font-mono"
                      style={{ color: theme.textSecondary }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-5 pt-4 transform transition-all duration-700 ${
                animationStage >= 6
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              {heroData.primaryButtonText && (
                <Link
                  href={heroData.primaryButtonLink || "/about"}
                  className="group relative px-8 py-4 font-semibold transition-all duration-300 rounded-full overflow-hidden shadow-lg hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}DD)`,
                    color: "#ffffff",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {heroData.primaryButtonText}
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
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
                  className="group relative px-8 py-4 font-semibold transition-all duration-300 rounded-full border-2 hover:shadow-lg overflow-hidden"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    background: `${theme.primary}05`,
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {heroData.secondaryButtonText}
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div
                    className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ background: `${theme.primary}15` }}
                  />
                </Link>
              )}
            </div>

            {/* Trust Indicator */}
            <div
              className={`flex items-center gap-4 pt-2 transform transition-all duration-700 delay-500 ${
                animationStage >= 7
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-gray-600 to-gray-700"
                  />
                ))}
              </div>
              <div>
                <p
                  className="text-sm font-mono"
                  style={{ color: theme.primary }}
                >
                  Trusted by industry leaders
                </p>
                <p
                  className="text-xs font-mono"
                  style={{ color: theme.textSecondary }}
                >
                  Join 500+ satisfied companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation - Circle-based */}
      {heroDataList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Previous slide"
          >
            <div className="relative w-12 h-12 transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform"
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
            <div className="relative w-12 h-12 transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
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

      {/* Slide Indicators - Circle-based */}
      {heroDataList.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
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
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "w-6 bg-primary"
                    : "w-3 bg-white/30 group-hover:w-4"
                }`}
                style={{
                  backgroundColor:
                    idx === currentSlide ? theme.primary : undefined,
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="relative h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent">
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
        @keyframes concentric {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes float-circle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.3;
          }
          80% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-50px) translateX(20px) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes pulse-dot {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(2);
            opacity: 0.6;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.9);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(180px) rotate(0deg);
            opacity: 0.5;
          }
          100% {
            transform: rotate(360deg) translateX(180px) rotate(-360deg);
            opacity: 0.2;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        .animate-concentric {
          animation: concentric 8s ease-out infinite;
        }

        .animate-float-circle {
          animation: float-circle 15s ease-in-out infinite;
        }

        .animate-pulse-dot {
          animation: pulse-dot 3s ease-in-out infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 3s ease-out infinite;
        }

        .animate-orbit {
          animation: orbit 10s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow-delayed {
          animation: pulse-slow 4s ease-in-out 2s infinite;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const AboutHeroSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-[650px] lg:min-h-[850px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column Skeleton - Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full border-2 border-white/20" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full border-2 border-white/20" />
            </div>
          </div>

          {/* Right Column Skeleton - Content */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="w-20 h-7 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse" />
              <div className="w-14 h-7 bg-white/5 rounded-full animate-pulse delay-150" />
            </div>
            <div className="space-y-3">
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-3/4 animate-pulse" />
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-2/3 animate-pulse delay-300" />
            </div>
            <div className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl bg-white/5 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-36 h-12 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
              <div className="w-36 h-12 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Component
const AboutHeroError = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-[500px] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5" />

      <div className="text-center space-y-5 relative z-10 max-w-md mx-auto px-4">
        <div className="relative">
          <div
            className="text-7xl font-mono font-bold animate-bounce"
            style={{ color: theme.primary }}
          >
            !
          </div>
          <div
            className="absolute inset-0 text-7xl font-mono font-bold animate-ping opacity-20"
            style={{ color: theme.primary }}
          >
            !
          </div>
        </div>

        <h3
          className="text-xl font-mono font-bold"
          style={{ color: theme.text }}
        >
          About Us Data Unavailable
        </h3>

        <p className="text-sm font-mono" style={{ color: theme.textSecondary }}>
          Unable to load company information. Please try again.
        </p>

        <div className="flex gap-3 justify-center pt-3">
          <button
            onClick={() => window.location.reload()}
            className="group relative px-5 py-2.5 font-mono font-semibold transition-all rounded-full shadow-lg hover:shadow-2xl text-sm"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC)`,
              color: "#ffffff",
            }}
          >
            Try Again
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 font-mono font-semibold transition-all rounded-full border-2 text-sm"
            style={{
              borderColor: theme.primary,
              color: theme.primary,
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsHeroSection;
