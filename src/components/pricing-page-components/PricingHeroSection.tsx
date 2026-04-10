// components/PricingHeroSection.tsx
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroService } from "@/services/heroService";
import { PageHeroSection } from "@/types/hero-types";
import { useTheme } from "@/context/ThemeContext";

const PricingHeroSection = () => {
  const [heroDataList, setHeroDataList] = useState<PageHeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState(0);
  const [diamonds, setDiamonds] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorIn, setIsCursorIn] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const heroData = heroDataList[currentSlide];

  // Parse pricing plans from highlightText - filter out $0 plans
  const allPlans = heroData?.highlightText ? 
    heroData.highlightText.split(",").map((item) => {
      const [plan, price] = item.trim().split(":");
      return { 
        plan: plan || "Plan", 
        price: price || "0"
      };
    }) : [];

  // Filter out plans with price "0" or "0.00"
  const pricingPlans = allPlans.filter(plan => plan.price !== "0" && plan.price !== "0.00");

  // Parse features from subtitle
  const features = heroData?.subtitle ? 
    heroData.subtitle.split(",").map(feature => feature.trim()) : [];

  // Generate diamond shapes
  useEffect(() => {
    const newDiamonds = Array.from({ length: 25 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 10,
      delay: Math.random() * 5,
    }));
    setDiamonds(newDiamonds);
  }, []);

  // Trigger fade animation when slide changes
  useEffect(() => {
    if (!loading && heroData) {
      setFadeKey(prev => prev + 1);
    }
  }, [currentSlide, heroData]);

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
        const { data, error } = await HeroService.fetchPricingHeroData();

        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setHeroDataList(data);
        } else {
          setError("No pricing hero section data available");
        }
      } catch (err) {
        console.error("Error fetching pricing hero data:", err);
        setError("Something went wrong while fetching pricing hero data");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Animation sequence
  useEffect(() => {
    if (!loading && heroData) {
      setAnimationStage(0);
      
      const intervals = [
        setTimeout(() => setAnimationStage(1), 150),
        setTimeout(() => setAnimationStage(2), 350),
        setTimeout(() => setAnimationStage(3), 550),
        setTimeout(() => setAnimationStage(4), 750),
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
    return <PricingHeroSkeleton />;
  }

  if (error || heroDataList.length === 0) {
    return <PricingHeroError />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[650px] lg:min-h-[850px] flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, 
              ${theme.primary}08 0%, 
              ${theme.background} 90%)`,
            opacity: isCursorIn ? 0.8 : 0.5,
          }}
        />
        
        {diamonds.map((diamond, idx) => (
          <div
            key={idx}
            className="absolute animate-float-diamond"
            style={{
              left: `${diamond.x}%`,
              top: `${diamond.y}%`,
              width: `${diamond.size}px`,
              height: `${diamond.size}px`,
              border: `1px solid ${theme.primary}12`,
              transform: "rotate(45deg)",
              animationDelay: `${diamond.delay}s`,
              animationDuration: `${Math.random() * 10 + 8}s`,
            }}
          />
        ))}

        <div className="absolute top-20 right-20 w-64 h-64 border-2 rotate-45 animate-rotate-slow" style={{ borderColor: `${theme.primary}10` }} />
        <div className="absolute bottom-20 left-20 w-56 h-56 rounded-full border-2 animate-pulse-slow" style={{ borderColor: `${theme.primary}08` }} />

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
              opacity: Math.random() * 0.3 + 0.1,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Vertical Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT SECTION - Info, Features & Buttons */}
          <div
            className={`space-y-8 transform transition-all duration-700 ${
              animationStage >= 1
                ? "translate-x-0 opacity-100"
                : "-translate-x-16 opacity-0"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
              <span className="text-sm font-mono" style={{ color: theme.primary }}>
                {heroData.name || "PRICING"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight" style={{ color: theme.text }}>
              {heroData.title}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg leading-relaxed" style={{ color: theme.textSecondary }}>
              {heroData.description}
            </p>

            {/* Features List */}
            {features.length > 0 && (
              <div className="space-y-3 pt-4">
                {features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 transform transition-all duration-300 hover:translate-x-2"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.primary}20` }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ stroke: theme.primary }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: theme.textSecondary }}>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons - Moved to Left Side */}
            <div className="flex flex-wrap gap-4 pt-6">
              {heroData.primaryButtonText && (
                <Link
                  href={heroData.primaryButtonLink || "/pricing"}
                  className="group relative px-8 py-3 font-semibold transition-all duration-300 rounded-full overflow-hidden shadow-lg hover:shadow-xl text-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}DD)`,
                    color: "#ffffff",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
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
                  className="group relative px-8 py-3 font-semibold transition-all duration-300 rounded-full border-2 hover:shadow-xl text-center"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    background: `${theme.primary}05`,
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {heroData.secondaryButtonText}
                  </span>
                  <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" 
                       style={{ background: `${theme.primary}10` }} />
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - Image & Pricing Plans with Smooth Data Change Animation */}
          <div
            className={`space-y-8 transform transition-all duration-700 ${
              animationStage >= 2
                ? "translate-x-0 opacity-100"
                : "translate-x-16 opacity-0"
            }`}
          >
            {/* Image from API with fade animation on change */}
            <div 
              key={`image-${fadeKey}`}
              className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-up"
            >
              <Image
                src={heroData.imageUrl}
                alt={heroData.title}
                width={600}
                height={400}
                className="object-cover w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Pricing Plans - Horizontal List with Smooth Data Change Animation */}
            <div 
              key={`pricing-${fadeKey}`}
              className="flex flex-wrap gap-8 justify-between animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              {pricingPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className="flex-1 min-w-[100px] text-center cursor-pointer transform transition-all duration-300"
                  style={{
                    transform: hoveredPlan === idx ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                  }}
                  onMouseEnter={() => setHoveredPlan(idx)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {/* Plan Name */}
                  <div 
                    className="text-sm font-mono mb-2 transition-all duration-300"
                    style={{ 
                      color: hoveredPlan === idx ? theme.primary : theme.textSecondary,
                    }}
                  >
                    {plan.plan}
                  </div>
                  
                  {/* Price with smooth number transition */}
                  <div 
                    className="text-3xl font-bold transition-all duration-300"
                    style={{ 
                      color: hoveredPlan === idx ? theme.primary : theme.text,
                    }}
                  >
                    ${plan.price}
                  </div>
                  
                  {/* Animated Divider Line */}
                  <div 
                    className="h-px mx-auto mt-3 transition-all duration-500"
                    style={{ 
                      backgroundColor: hoveredPlan === idx ? theme.primary : `${theme.primary}30`,
                      width: hoveredPlan === idx ? "40px" : "24px",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Trust Badge with fade animation */}
            {heroData.highlightText && heroData.highlightText.split(",")[allPlans.length] && (
              <div 
                key={`trust-${fadeKey}`}
                className="text-center pt-2 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10">
                  <span className="text-xs" style={{ color: theme.textSecondary }}>
                    {heroData.highlightText.split(",")[allPlans.length]}
                  </span>
                </div>
              </div>
            )}
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
            <div className="w-12 h-12 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:-translate-x-1">
              <svg className="w-5 h-5 text-white transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Next slide"
          >
            <div className="w-12 h-12 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1">
              <svg className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {heroDataList.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
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
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? "w-10" : "w-2"
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
            className="absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-r-full"
            style={{
              width: `${((currentSlide + 1) / heroDataList.length) * 100}%`,
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}CC, ${theme.primary})`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float-diamond {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(45deg); 
            opacity: 0.1;
          }
          33% { 
            transform: translateY(-25px) translateX(15px) rotate(45deg); 
            opacity: 0.25;
          }
          66% { 
            transform: translateY(15px) translateX(-10px) rotate(45deg); 
            opacity: 0.15;
          }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(0deg); opacity: 0.1; }
          to { transform: rotate(360deg); opacity: 0.2; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.06); }
        }
        
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(2.5); opacity: 0.25; }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float-diamond {
          animation: float-diamond 12s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 25s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-dot {
          animation: pulse-dot 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const PricingHeroSkeleton = () => {
  return (
    <div className="min-h-[650px] lg:min-h-[850px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-32 h-32 border-2 rotate-45 border-cyan-500/30 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-28 h-28 rounded-full border-2 border-purple-500/30 animate-pulse delay-500" />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
            style={{
              top: `${i * 7}%`,
              left: 0,
              right: 0,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Skeleton */}
          <div className="space-y-8 animate-pulse">
            <div className="w-32 h-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full" />
            <div className="space-y-4">
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-3/4" />
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-2/3" />
            </div>
            <div className="h-32 bg-white/10 rounded-xl w-full" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 bg-white/10 rounded w-3/4" />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-40 h-12 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30" />
              <div className="w-40 h-12 rounded-full bg-white/10" />
            </div>
          </div>
          
          {/* Right Skeleton */}
          <div className="space-y-8 animate-pulse">
            <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-white/10 to-white/5" />
            <div className="flex gap-8 justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 text-center space-y-2">
                  <div className="h-4 bg-white/10 rounded w-16 mx-auto" />
                  <div className="h-8 bg-white/10 rounded w-20 mx-auto" />
                  <div className="w-6 h-px bg-white/10 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Component
const PricingHeroError = () => {
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
          [ERROR]: PRICING_DATA_NOT_FOUND
        </h3>
        
        <p className="text-base font-mono" style={{ color: theme.textSecondary }}>
          &gt; Unable to fetch pricing showcase data_
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

export default PricingHeroSection;