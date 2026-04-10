// components/BlogHeroSection.tsx
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroService } from "@/services/heroService";
import { PageHeroSection } from "@/types/hero-types";
import { useTheme } from "@/context/ThemeContext";

const BlogHeroSection = () => {
  const [heroDataList, setHeroDataList] = useState<PageHeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const heroData = heroDataList[currentSlide];

  // Track scroll progress for parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollPercent = Math.min(Math.max((window.scrollY - rect.top) / rect.height, 0), 1);
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse tracking for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };

    sectionRef.current?.addEventListener("mousemove", handleMouseMove);
    return () => sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await HeroService.fetchBlogsHeroData();

        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setHeroDataList(data);
        } else {
          setError("No blog hero section data available");
        }
      } catch (err) {
        console.error("Error fetching blog hero data:", err);
        setError("Something went wrong while fetching blog hero data");
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
        setTimeout(() => setAnimationStage(1), 150),
        setTimeout(() => setAnimationStage(2), 350),
        setTimeout(() => setAnimationStage(3), 550),
        setTimeout(() => setAnimationStage(4), 750),
        setTimeout(() => setAnimationStage(5), 950),
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
    }, 8000);

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
    return <BlogHeroSkeleton />;
  }

  if (error || heroDataList.length === 0) {
    return <BlogHeroError />;
  }

  // 3D transform values for tilt effect
  const tiltX = mousePosition.y * 10;
  const tiltY = mousePosition.x * 10;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[700px] lg:min-h-[900px] flex items-center"
      style={{
        transform: `perspective(1000px) rotateX(${tiltX * scrollProgress}deg) rotateY(${tiltY * scrollProgress}deg)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      {/* New Background Design - Wave Pattern */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl animate-float-slow"
          style={{ background: `radial-gradient(circle, ${theme.primary}20, transparent)` }}
        />
        <div 
          className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl animate-float-slow-delayed"
          style={{ background: `radial-gradient(circle, ${theme.primary}15, transparent)` }}
        />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(${theme.primary}10 1px, transparent 1px), linear-gradient(90deg, ${theme.primary}10 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollProgress * 100}px)`,
          }} />
        </div>

        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              background: theme.primary,
              opacity: Math.random() * 0.4,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 8 + 5}s`,
            }}
          />
        ))}

        {/* Wave Shapes */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-10"
          viewBox="0 0 1440 320"
          style={{ transform: `translateY(${scrollProgress * 50}px)` }}
        >
          <path
            fill={theme.primary}
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main Content - New Layout: Image on Left, Content on Right */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Featured Image with 3D Card Effect */}
          <div
            className={`transform transition-all duration-1000 ${
              animationStage >= 1
                ? "translate-x-0 opacity-100 rotate-0"
                : "-translate-x-32 opacity-0 -rotate-12"
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: `perspective(1000px) rotateY(${tiltY * 5}deg) rotateX(${tiltX * 3}deg)`,
            }}
          >
            <div className="relative group">
              {/* Card Background Glow */}
              <div 
                className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${theme.primary}30, ${theme.primary}10)` }}
              />
              
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                <Image
                  src={heroData.imageUrl}
                  alt={heroData.title}
                  width={600}
                  height={600}
                  className="relative z-10 object-cover w-full h-auto"
                  priority
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-4 border-l-4 rounded-tl-2xl animate-pulse-slow" style={{ borderColor: theme.primary }} />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-4 border-r-4 rounded-br-2xl animate-pulse-slow" style={{ borderColor: theme.primary }} />
              
              {/* Floating Badge */}
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg animate-float">
                <p className="text-sm font-mono" style={{ color: theme.primary }}>
                  FEATURED
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Category Tags */}
            <div className="flex flex-wrap gap-3">
              {heroData.categories?.slice(0, 3).map((category, idx) => (
                <span
                  key={idx}
                  className={`transform transition-all duration-500 delay-${idx * 100} ${
                    animationStage >= 2
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <span 
                    className="px-4 py-2 text-sm font-mono rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 inline-block"
                    style={{ 
                      borderColor: `${theme.primary}40`,
                      background: `${theme.primary}10`,
                      color: theme.primary
                    }}
                  >
                    #{category}
                  </span>
                </span>
              ))}
            </div>

            {/* Title with Typewriter Effect */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight transform transition-all duration-700 ${
                animationStage >= 3
                  ? "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0"
              }`}
              style={{ color: theme.text }}
            >
              {heroData.title.split(" ").map((word, idx) => (
                <span
                  key={idx}
                  className="inline-block mr-4 hover:animate-wiggle"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Author Info with Avatar */}
            <div
              className={`flex items-center gap-4 transform transition-all duration-700 delay-300 ${
                animationStage >= 4
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: theme.primary }}>
                  <Image
                    src={heroData.authorAvatar || "/default-avatar.jpg"}
                    alt={heroData.authorName || "Author"}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div>
                <p className="font-mono font-semibold" style={{ color: theme.text }}>
                  {heroData.authorName || "Editorial Team"}
                </p>
                <p className="text-sm font-mono" style={{ color: theme.textSecondary }}>
                  {heroData.publishDate || "Latest Post"} • {heroData.readTime || "5 min read"}
                </p>
              </div>
            </div>

            {/* Description with Quote Style */}
            <div
              className={`transform transition-all duration-700 delay-500 ${
                animationStage >= 5
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 text-6xl font-serif opacity-30" style={{ color: theme.primary }}>
                  "
                </div>
                <p className="text-lg leading-relaxed font-light" style={{ color: theme.textSecondary }}>
                  {heroData.description}
                </p>
              </div>
            </div>

            {/* Action Buttons with New Design */}
            <div
              className={`flex flex-wrap gap-5 pt-6 transform transition-all duration-700 delay-700 ${
                animationStage >= 6
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              {heroData.primaryButtonText && (
                <Link
                  href={heroData.primaryButtonLink || "/blogs"}
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
                  href={heroData.secondaryButtonLink || "/subscribe"}
                  className="group relative px-8 py-4 font-semibold transition-all duration-300 rounded-full border-2 hover:shadow-lg overflow-hidden"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
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
                       style={{ background: `${theme.primary}10` }} />
                </Link>
              )}
            </div>

            {/* Stats Row */}
            <div
              className={`flex gap-8 pt-8 border-t transform transition-all duration-700 delay-1000 ${
                animationStage >= 7
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ borderColor: `${theme.primary}20` }}
            >
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: theme.primary }}>
                  {heroData.likes || "2.5k"}
                </p>
                <p className="text-xs font-mono" style={{ color: theme.textSecondary }}>Likes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: theme.primary }}>
                  {heroData.comments || "189"}
                </p>
                <p className="text-xs font-mono" style={{ color: theme.textSecondary }}>Comments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: theme.primary }}>
                  {heroData.shares || "432"}
                </p>
                <p className="text-xs font-mono" style={{ color: theme.textSecondary }}>Shares</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation - Minimalist Design */}
      {heroDataList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 group"
            aria-label="Previous slide"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
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
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
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

      {/* Slide Indicators - Modern Dots */}
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
                  idx === currentSlide ? "w-8 bg-primary" : "w-4 bg-white/30 group-hover:w-6"
                }`}
                style={{
                  backgroundColor: idx === currentSlide ? theme.primary : undefined,
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Scroll Progress Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
        <div className="relative h-32 w-px bg-white/20">
          <div
            className="absolute bottom-0 left-0 w-full transition-all duration-300"
            style={{
              height: `${scrollProgress * 100}%`,
              backgroundColor: theme.primary,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        
        @keyframes float-slow-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(30px) translateX(-20px); }
        }
        
        @keyframes particle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slow-delayed {
          animation: float-slow-delayed 10s ease-in-out infinite;
        }
        
        .animate-particle {
          animation: particle 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader - Modern Design
const BlogHeroSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-[700px] lg:min-h-[900px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl animate-pulse bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side Skeleton */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
            </div>
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-4 border-l-4 rounded-tl-2xl border-white/20" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-4 border-r-4 rounded-br-2xl border-white/20" />
          </div>

          {/* Right Side Skeleton */}
          <div className="space-y-8">
            <div className="flex gap-3">
              <div className="w-20 h-8 rounded-full bg-white/10 animate-pulse" />
              <div className="w-24 h-8 rounded-full bg-white/10 animate-pulse delay-150" />
              <div className="w-16 h-8 rounded-full bg-white/10 animate-pulse delay-300" />
            </div>
            
            <div className="space-y-4">
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-3/4 animate-pulse" />
              <div className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-2/3 animate-pulse delay-300" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
                <div className="h-3 bg-white/10 rounded w-24 animate-pulse delay-150" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse delay-150" />
              <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse delay-300" />
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

// Error Component - Modern Design
const BlogHeroError = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-[500px] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5" />
      
      <div className="text-center space-y-6 relative z-10 max-w-md mx-auto px-4">
        <div className="relative">
          <div className="text-9xl font-bold font-mono animate-bounce" style={{ color: theme.primary }}>
            !
          </div>
          <div className="absolute inset-0 text-9xl font-bold font-mono animate-ping opacity-20" style={{ color: theme.primary }}>
            !
          </div>
        </div>
        
        <h3 className="text-2xl font-mono font-bold" style={{ color: theme.text }}>
          Oops! Something went wrong
        </h3>
        
        <p className="text-base font-mono" style={{ color: theme.textSecondary }}>
          We couldn't load the blog showcase. Please try again.
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => window.location.reload()}
            className="group relative px-8 py-3 font-mono font-semibold transition-all rounded-full shadow-lg hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC)`,
              color: "#ffffff",
            }}
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="px-8 py-3 font-mono font-semibold transition-all rounded-full border-2 hover:shadow-lg"
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

export default BlogHeroSection;