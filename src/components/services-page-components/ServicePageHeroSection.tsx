// components/ServicePageHeroSection.tsx
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroService } from "@/services/heroService";
import { ServiceHeroSection } from "@/types/hero-types";
import { useTheme } from "@/context/ThemeContext";

const ServicePageHeroSection = () => {
  const [heroDataList, setHeroDataList] = useState<ServiceHeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const heroData = heroDataList[currentSlide];

  // Parse services from highlightText
  const services = heroData?.highlightText?.split(",").map(s => s.trim()) || [
    "Web Development",
    "App Development", 
    "Cloud Solutions",
    "AI & ML",
    "UI/UX Design",
    "Digital Marketing"
  ];

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await HeroService.fetchServiceHeroData();

        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setHeroDataList(data);
        } else {
          setError("No service hero section data available");
        }
      } catch (err) {
        console.error("Error fetching service hero data:", err);
        setError("Something went wrong while fetching service hero data");
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
    return <ServiceHeroSkeleton />;
  }

  if (error || heroDataList.length === 0) {
    return <ServiceHeroError />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[650px] lg:min-h-[850px] flex items-center"
    >
      {/* Background - Keeping original */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${theme.primary}08 0%, ${theme.background} 90%)`,
          }}
        />
        
        {/* Radial wave lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-radial-wave"
              style={{
                top: "50%",
                left: "50%",
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                marginLeft: `-${(i + 1) * 100}px`,
                marginTop: `-${(i + 1) * 100}px`,
                borderRadius: "50%",
                border: `1px solid ${theme.primary}15`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "8s",
              }}
            />
          ))}
        </div>

        {/* Animated service badges */}
        <div className="absolute top-20 right-20 w-40 h-40 border-2 rounded-full animate-pulse-slow" style={{ borderColor: `${theme.primary}15` }} />
        <div className="absolute bottom-20 left-20 w-32 h-32 border-2 rounded-lg animate-rotate-slow-service" style={{ borderColor: `${theme.primary}12` }} />
      </div>

      {/* Main Content - Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT COLUMN - Image (Top) + Services (Bottom) */}
          <div className="space-y-8">
            {/* Image Section - Top */}
            <div
              className={`transform transition-all duration-1000 ${
                animationStage >= 1
                  ? "translate-x-0 opacity-100 scale-100"
                  : "-translate-x-40 opacity-0 scale-90"
              }`}
            >
              <div className="relative w-full max-w-md mx-auto group">
                {/* Pulsing rings around image */}
                <div className="absolute inset-0 -m-4 rounded-full opacity-30">
                  <div className="absolute inset-0 rounded-full border-2 animate-pulse-ring" style={{ borderColor: `${theme.primary}30` }} />
                  <div className="absolute inset-4 rounded-full border-2 animate-pulse-ring-delayed" style={{ borderColor: `${theme.primary}20` }} />
                  <div className="absolute inset-8 rounded-full border-2 animate-pulse-ring-slow" style={{ borderColor: `${theme.primary}10` }} />
                </div>

                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <Image
                    src={heroData.imageUrl}
                    alt={heroData.title}
                    width={500}
                    height={500}
                    className="relative z-10 object-cover w-full h-auto transform transition-transform duration-500 group-hover:scale-110"
                    priority
                  />

                  {/* Decorative Border */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 rounded-tl-2xl" style={{ borderColor: theme.primary }} />
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 rounded-tr-2xl" style={{ borderColor: theme.primary }} />
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 rounded-bl-2xl" style={{ borderColor: theme.primary }} />
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 rounded-br-2xl" style={{ borderColor: theme.primary }} />
                  </div>
                </div>

                {/* Scanning line effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan-service" />
                </div>

                {/* Floating badges */}
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500/50 blur-sm animate-ping" />
                <div className="absolute -bottom-3 -right-3 w-5 h-5 rounded-full bg-cyan-500/50 blur-sm animate-pulse-slow" />
              </div>
            </div>

            {/* Services Section - Bottom */}
            <div
              className={`transform transition-all duration-1000 delay-200 ${
                animationStage >= 2
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-40 opacity-0"
              }`}
            >
              <div className="relative">
                {/* Section Header */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: theme.primary }} />
                  <p className="text-sm font-mono font-semibold tracking-wider" style={{ color: theme.primary }}>
                    WHAT WE OFFER
                  </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="group cursor-pointer"
                      onMouseEnter={() => setActiveService(idx)}
                    >
                      <div
                        className={`relative p-4 rounded-xl transition-all duration-300 ${
                          activeService === idx 
                            ? "bg-gradient-to-br border-l-4 shadow-lg" 
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                        style={{
                          background: activeService === idx 
                            ? `linear-gradient(135deg, ${theme.primary}15, ${theme.primary}05)` 
                            : undefined,
                          borderLeftColor: activeService === idx ? theme.primary : "transparent",
                          transform: activeService === idx ? "translateX(5px)" : "translateX(0)",
                        }}
                      >
                        {/* Service Icon */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center transition-transform group-hover:scale-110"
                              style={{ background: `linear-gradient(135deg, ${theme.primary}30, ${theme.primary}10)` }}>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: theme.primary }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-sm font-bold font-mono" style={{ color: theme.text }}>
                            {service}
                          </h3>
                        </div>
                        
                        {/* Service Description */}
                        <div className={`overflow-hidden transition-all duration-300 ${
                          activeService === idx ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}>
                          <p className="text-xs font-mono pl-11" style={{ color: theme.textSecondary }}>
                            Expert {service.toLowerCase()} solutions
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3" fill={theme.primary} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs font-mono" style={{ color: theme.textSecondary }}>
                    Trusted by 500+ businesses worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Content (Title, Description, Buttons) */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 transform transition-all duration-700 ${
                animationStage >= 3
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                <span className="text-sm font-mono" style={{ color: theme.primary }}>
                  {heroData.name || "SERVICES"}
                </span>
              </div>
              {heroData.subtitle && (
                <span className="text-sm font-mono" style={{ color: theme.textSecondary }}>
                  / {heroData.subtitle}
                </span>
              )}
            </div>

            {/* Title with Split Text Effect */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight transform transition-all duration-700 ${
                animationStage >= 4
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC)`;
                    e.currentTarget.style.webkitBackgroundClip = "text";
                    e.currentTarget.style.webkitTextFillColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.text}, ${theme.primary})`;
                    e.currentTarget.style.webkitBackgroundClip = "text";
                    e.currentTarget.style.webkitTextFillColor = "transparent";
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Description with Modern Card Style */}
            <div
              className={`transform transition-all duration-700 ${
                animationStage >= 5
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
                <div className="absolute top-4 right-4 text-4xl font-serif opacity-20" style={{ color: theme.primary }}>
                  "
                </div>
                
                <p className="text-base md:text-lg leading-relaxed font-light relative z-10" style={{ color: theme.textSecondary }}>
                  {heroData.description}
                </p>
                
                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500" 
                     style={{ background: `linear-gradient(90deg, ${theme.primary}, transparent)` }} />
              </div>
            </div>

            {/* Stats Row */}
            <div
              className={`flex flex-wrap gap-8 pt-4 transform transition-all duration-700 ${
                animationStage >= 6
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="group cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold transition-all duration-300 group-hover:scale-110 inline-block" style={{ color: theme.primary }}>
                  500+
                </div>
                <p className="text-xs font-mono mt-1" style={{ color: theme.textSecondary }}>Projects</p>
              </div>
              <div className="group cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold transition-all duration-300 group-hover:scale-110 inline-block" style={{ color: theme.primary }}>
                  100+
                </div>
                <p className="text-xs font-mono mt-1" style={{ color: theme.textSecondary }}>Clients</p>
              </div>
              <div className="group cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold transition-all duration-300 group-hover:scale-110 inline-block" style={{ color: theme.primary }}>
                  24/7
                </div>
                <p className="text-xs font-mono mt-1" style={{ color: theme.textSecondary }}>Support</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-5 pt-4 transform transition-all duration-700 ${
                animationStage >= 7
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              {heroData.primaryButtonText && (
                <Link
                  href={heroData.primaryButtonLink || "/contact"}
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
                  href={heroData.secondaryButtonLink || "/about"}
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
                  <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" 
                       style={{ background: `${theme.primary}15` }} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation */}
      {heroDataList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Previous slide"
          >
            <div className="relative w-12 h-12 transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg transform rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white transform -rotate-45 group-hover:-translate-x-1 transition-transform"
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
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg transform rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white transform -rotate-45 group-hover:translate-x-1 transition-transform"
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

      {/* Slide Indicators */}
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
                  idx === currentSlide ? "w-6 bg-primary" : "w-3 bg-white/30 group-hover:w-4"
                }`}
                style={{
                  backgroundColor: idx === currentSlide ? theme.primary : undefined,
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
        @keyframes radial-wave {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes rotate-slow-service {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        @keyframes scan-service {
          0% { bottom: -10%; }
          100% { bottom: 100%; }
        }
        
        .animate-radial-wave {
          animation: radial-wave 8s ease-out infinite;
          transform-origin: center;
        }
        
        .animate-rotate-slow-service {
          animation: rotate-slow-service 25s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 3s ease-out infinite;
        }
        
        .animate-pulse-ring-delayed {
          animation: pulse-ring 3s ease-out 1s infinite;
        }
        
        .animate-pulse-ring-slow {
          animation: pulse-ring 4s ease-out 2s infinite;
        }
        
        .animate-scan-service {
          animation: scan-service 4s linear infinite;
        }
        
        .pl-11 {
          padding-left: 2.75rem;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const ServiceHeroSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-[650px] lg:min-h-[850px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column Skeleton - Image + Services */}
          <div className="space-y-8">
            <div className="w-full max-w-md mx-auto">
              <div className="relative">
                <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 animate-pulse mx-auto" />
                <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-white/20 rounded-br-xl" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
              </div>
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
            <div className="flex gap-4">
              <div className="w-28 h-10 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
              <div className="w-28 h-10 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Component
const ServiceHeroError = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-[500px] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5" />
      
      <div className="text-center space-y-5 relative z-10 max-w-md mx-auto px-4">
        <div className="relative">
          <div className="text-7xl font-mono font-bold animate-glitch" style={{ color: theme.primary }}>
            404
          </div>
          <div className="absolute inset-0 text-7xl font-mono font-bold animate-glitch-2 opacity-50" style={{ color: theme.primary }}>
            404
          </div>
        </div>
        
        <h3 className="text-xl font-mono font-bold" style={{ color: theme.text }}>
          [ERROR]: SERVICES_DATA_NOT_FOUND
        </h3>
        
        <p className="text-sm font-mono" style={{ color: theme.textSecondary }}>
          &gt; Unable to fetch service showcase data_
          <span className="inline-block w-2 h-3 ml-1 animate-blink" style={{ backgroundColor: theme.primary }} />
        </p>
        
        <div className="flex gap-3 justify-center pt-3">
          <button
            onClick={() => window.location.reload()}
            className="group relative px-5 py-2.5 font-mono font-semibold transition-all rounded-lg overflow-hidden shadow-lg text-sm"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC)`,
              color: "#ffffff",
            }}
          >
            <span className="relative z-10">RETRY_CONNECTION</span>
          </button>
          
          <Link
            href="/"
            className="px-5 py-2.5 font-mono font-semibold transition-all rounded-lg border-2 text-sm"
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
          0%, 100% { transform: translate(0); opacity: 0.5; }
          20% { transform: translate(2px, -2px); opacity: 0.4; }
          40% { transform: translate(2px, 2px); opacity: 0.5; }
          60% { transform: translate(-2px, -2px); opacity: 0.4; }
          80% { transform: translate(-2px, 2px); opacity: 0.5; }
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

export default ServicePageHeroSection;