// components/ContactUsHeroSection.tsx
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroService } from "@/services/heroService";
import { PageHeroSection } from "@/types/hero-types";
import { useTheme } from "@/context/ThemeContext";

const ContactUsHeroSection = () => {
  const [heroDataList, setHeroDataList] = useState<PageHeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorIn, setIsCursorIn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const heroData = heroDataList[currentSlide];

  // Parse contact info from highlightText
  const contactItems = heroData?.highlightText ? 
    heroData.highlightText.split(",").map((item) => {
      const [label, value] = item.trim().split(":");
      return { label: label || "Info", value: value || "Available" };
    }) : [];

  // Split into two columns for layout
  const midPoint = Math.ceil(contactItems.length / 2);
  const leftColumnItems = contactItems.slice(0, midPoint);
  const rightColumnItems = contactItems.slice(midPoint);

  // Cursor tracking
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
        const { data, error } = await HeroService.fetchContactUsHeroData();

        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setHeroDataList(data);
        } else {
          setError("No contact hero section data available");
        }
      } catch (err) {
        console.error("Error fetching contact hero data:", err);
        setError("Something went wrong while fetching contact hero data");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Staggered animation
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
    return <ContactHeroSkeleton />;
  }

  if (error || heroDataList.length === 0) {
    return <ContactHeroError />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[650px] lg:min-h-[850px] flex items-center"
    >
      {/* Background - Keep as is */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, 
              ${theme.primary}10 0%, 
              ${theme.background} 85%)`,
            opacity: isCursorIn ? 0.8 : 0.5,
          }}
        />
        
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl animate-float-slower" />
        
        {[...Array(60)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: theme.primary,
              opacity: Math.random() * 0.4 + 0.1,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* New Layout: Split Screen with Different Style */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          
          {/* LEFT COLUMN - Main Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div
              className={`transform transition-all duration-700 ${
                animationStage >= 1
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-32 opacity-0"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.primary }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: theme.primary }} />
                </div>
                <span className="text-sm font-mono" style={{ color: theme.primary }}>
                  {heroData.name || "GET IN TOUCH"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight transform transition-all duration-700 ${
                animationStage >= 2
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-32 opacity-0"
              }`}
              style={{ color: theme.text }}
            >
              {heroData.title}
            </h1>

            {/* Description with new style */}
            <div
              className={`transform transition-all duration-700 ${
                animationStage >= 3
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-32 opacity-0"
              }`}
            >
              <div className="relative pl-6 border-l-4" style={{ borderLeftColor: theme.primary }}>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: theme.textSecondary }}>
                  {heroData.description}
                </p>
              </div>
            </div>

            {/* Contact Info - Split into two columns */}
            {contactItems.length > 0 && (
              <div
                className={`grid grid-cols-2 gap-4 pt-4 transform transition-all duration-700 ${
                  animationStage >= 4
                    ? "translate-y-0 opacity-100"
                    : "translate-y-16 opacity-0"
                }`}
              >
                {/* Left Column of Contact Items */}
                <div className="space-y-4">
                  {leftColumnItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${theme.primary}20` }}>
                        <span className="text-lg">
                          {idx === 0 && "💬"}
                          {idx === 1 && "✉️"}
                          {idx === 2 && "📞"}
                          {idx === 3 && "📍"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-mono opacity-70" style={{ color: theme.textSecondary }}>{item.label}</div>
                        <div className="text-sm font-semibold break-words" style={{ color: theme.text }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Right Column of Contact Items */}
                <div className="space-y-4">
                  {rightColumnItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${theme.primary}20` }}>
                        <span className="text-lg">
                          {idx === 0 && "🌐"}
                          {idx === 1 && "⏰"}
                          {idx === 2 && "⭐"}
                          {idx === 3 && "📱"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-mono opacity-70" style={{ color: theme.textSecondary }}>{item.label}</div>
                        <div className="text-sm font-semibold break-words" style={{ color: theme.text }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons - New style */}
            <div
              className={`flex flex-wrap gap-5 pt-4 transform transition-all duration-700 ${
                animationStage >= 5
                  ? "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0"
              }`}
            >
              {heroData.primaryButtonText && (
                <Link
                  href={heroData.primaryButtonLink || "/contact"}
                  className="group relative px-8 py-3.5 font-semibold transition-all duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
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
                  href={heroData.secondaryButtonLink || "/faq"}
                  className="group relative px-8 py-3.5 font-semibold transition-all duration-300 rounded-xl border-2 hover:shadow-xl"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    background: `${theme.primary}05`,
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {heroData.secondaryButtonText}
                  </span>
                  <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" 
                       style={{ background: `${theme.primary}10` }} />
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Image with New Style */}
          <div
            className={`flex items-center justify-center transform transition-all duration-1000 ${
              animationStage >= 6
                ? "translate-x-0 opacity-100"
                : "translate-x-32 opacity-0"
            }`}
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 border rounded-full animate-spin-slow" style={{ borderColor: `${theme.primary}15` }} />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 border rounded-full animate-spin-reverse" style={{ borderColor: `${theme.primary}12` }} />
              
              {/* Main Image Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                <Image
                  src={heroData.imageUrl}
                  alt={heroData.title}
                  width={500}
                  height={500}
                  className="relative z-0 object-cover w-full h-auto"
                  priority
                />
                
                {/* Overlay Text on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="text-white text-sm font-mono opacity-80">Contact Us</div>
                  <div className="text-white text-lg font-bold">We're here to help</div>
                </div>
                
                {/* Border effect */}
                <div className="absolute inset-0 z-10 pointer-events-none border-2 border-white/20 rounded-2xl" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-30">
                <div
                  className="px-4 py-2 rounded-l-xl shadow-lg text-sm font-bold whitespace-nowrap animate-pulse"
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                  }}
                >
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation - Different style */}
      {heroDataList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Previous slide"
          >
            <div className="w-10 h-10 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center group-hover:scale-110">
              <svg
                className="w-5 h-5 text-white transform group-hover:-translate-x-0.5 transition-transform"
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
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Next slide"
          >
            <div className="w-10 h-10 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center group-hover:scale-110">
              <svg
                className="w-5 h-5 text-white transform group-hover:translate-x-0.5 transition-transform"
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
          </button>
        </>
      )}

      {/* Slide Indicators - Minimalist */}
      {heroDataList.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroDataList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setAnimationStage(0);
              }}
              className="group"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-6" : "w-2"
                }`}
                style={{
                  backgroundColor: idx === currentSlide ? theme.primary : `${theme.textSecondary}30`,
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
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(30px) scale(1.2); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 12s linear infinite;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const ContactHeroSkeleton = () => {
  return (
    <div className="min-h-[650px] lg:min-h-[850px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-cyan-500/20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-purple-500/20 animate-pulse delay-500" />
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500/20 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="w-32 h-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse" />
            <div className="space-y-4">
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-3/4 animate-pulse" />
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-2/3 animate-pulse delay-300" />
            </div>
            <div className="h-24 bg-white/10 rounded-xl w-full animate-pulse delay-150" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-36 h-12 rounded-xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
              <div className="w-36 h-12 rounded-xl bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-96 h-96 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 animate-pulse mx-auto" />
              <div className="absolute -right-4 top-1/2 w-20 h-10 rounded-l-xl bg-cyan-500/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Component
const ContactHeroError = () => {
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
          [ERROR]: CONTACT_DATA_NOT_FOUND
        </h3>
        
        <p className="text-base font-mono" style={{ color: theme.textSecondary }}>
          &gt; Unable to fetch contact showcase data_
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

export default ContactUsHeroSection;