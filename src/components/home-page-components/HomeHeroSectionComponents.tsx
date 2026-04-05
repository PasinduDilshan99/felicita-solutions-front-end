// components/HomeHeroSectionComponents.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroService } from "@/services/heroService";
import { HeroSection } from "@/types/hero-types";
import { useTheme } from "@/context/ThemeContext";

const HomeHeroSectionComponents = () => {
  const [heroDataList, setHeroDataList] = useState<HeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationState, setAnimationState] = useState({
    title: false,
    subtitle: false,
    description: false,
    buttons: false,
    image: false,
  });
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { theme } = useTheme();

  const heroData = heroDataList[currentSlide];

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await HeroService.fetchAllHeroData();

        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setHeroDataList(data);
        } else {
          setError("No hero section data available");
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
        setError("Something went wrong while fetching hero data");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Reset animations when slide changes
  const resetAnimations = useCallback(() => {
    setAnimationState({
      title: false,
      subtitle: false,
      description: false,
      buttons: false,
      image: false,
    });
    setDisplayText("");
    setTextIndex(0);
  }, []);

  // Trigger animations sequentially when data loads or slide changes
  useEffect(() => {
    if (!loading && heroData) {
      resetAnimations();

      // Title animation (top to bottom)
      setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, title: true }));
      }, 100);

      // Subtitle animation (top to bottom)
      setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, subtitle: true }));
      }, 400);

      // Description typing animation
      setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, description: true }));
      }, 700);

      // Buttons animation (bottom to top)
      setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, buttons: true }));
      }, 1000);

      // Image animation (bottom to top)
      setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, image: true }));
      }, 1300);
    }
  }, [loading, heroData, resetAnimations]);

  // Typing effect for description
  useEffect(() => {
    if (animationState.description && heroData?.description) {
      if (textIndex < heroData.description.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + heroData.description[textIndex]);
          setTextIndex((prev) => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      }
    }
  }, [animationState.description, textIndex, heroData?.description]);

  // Auto-play carousel every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying || heroDataList.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide, heroDataList.length]);

  const nextSlide = useCallback(() => {
    setIsAutoPlaying(true);
    setCurrentSlide((prev) => (prev + 1) % heroDataList.length);
  }, [heroDataList.length]);

  const prevSlide = useCallback(() => {
    setIsAutoPlaying(true);
    setCurrentSlide(
      (prev) => (prev - 1 + heroDataList.length) % heroDataList.length,
    );
  }, [heroDataList.length]);

  const goToSlide = useCallback((index: number) => {
    setIsAutoPlaying(true);
    setCurrentSlide(index);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Calculate progress percentage based on current slide number
  const progressPercentage = ((currentSlide + 1) / heroDataList.length) * 100;

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error || heroDataList.length === 0) {
    return <HeroError />;
  }

  return (
    <section
      className="relative overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image with Crossfade */}
      <div className="absolute inset-0 z-0">
        {heroDataList.map((data, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 scale-110 animate-slow-zoom">
              <Image
                src={data.imageUrl || "/hero-bg.jpg"}
                alt={`Hero Background ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
                quality={100}
              />
            </div>
          </div>
        ))}
        {/* Overlay for better text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"
          style={{
            background: `linear-gradient(90deg, ${theme.background}CC 0%, ${theme.background}99 100%)`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            {/* Subtitle / Badge - Top to Bottom Animation */}
            {heroData.subTitle && (
              <div
                key={`subtitle-${currentSlide}`}
                className={`inline-block transform transition-all duration-700 ${
                  animationState.subtitle
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }`}
              >
                <span
                  className="text-sm uppercase tracking-wider font-semibold px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}40`,
                  }}
                >
                  {heroData.subTitle}
                </span>
              </div>
            )}

            {/* Title - Top to Bottom Animation */}
            <h1
              key={`title-${currentSlide}`}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transform transition-all duration-700 ${
                animationState.title
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
              style={{ color: theme.text }}
            >
              {heroData.title}
            </h1>

            {/* Description - Typing Animation */}
            <div className="min-h-[100px]">
              {animationState.description ? (
                <p
                  key={`desc-${currentSlide}`}
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {displayText}
                  {textIndex < heroData.description.length && (
                    <span
                      className="inline-block w-0.5 h-5 ml-1 animate-blink"
                      style={{ backgroundColor: theme.primary }}
                    />
                  )}
                </p>
              ) : (
                <div
                  className="h-24 w-full bg-gradient-to-r from-transparent to-transparent"
                  style={{ backgroundColor: `${theme.textSecondary}10` }}
                />
              )}
            </div>

            {/* Buttons - Bottom to Top Animation */}
            <div
              key={`buttons-${currentSlide}`}
              className={`flex flex-wrap gap-4 pt-4 transform transition-all duration-700 ${
                animationState.buttons
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }`}
            >
              {heroData.primaryButtonText && (
                <Link
                  href={heroData.primaryButtonLink || "/request-quote"}
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                    boxShadow: `0 4px 15px ${theme.primary}40`,
                  }}
                >
                  <span className="relative z-10">
                    {heroData.primaryButtonText}
                  </span>
                  <span
                    className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ backgroundColor: `${theme.primary}CC` }}
                  />
                </Link>
              )}

              {heroData.secondaryButtonText && (
                <Link
                  href={heroData.secondaryButtonLink || "/free-trial"}
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 hover:scale-105 transform"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {heroData.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Person/Product Image - Bottom to Top Animation */}
          {heroData.personImageUrl && (
            <div
              key={`image-${currentSlide}`}
              className={`hidden lg:flex justify-center items-center transform transition-all duration-700 ${
                animationState.image
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }`}
            >
              <div className="relative w-full max-w-md mx-auto">
                <div
                  className="absolute inset-0 rounded-full animate-pulse-slow"
                  style={{
                    background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)`,
                  }}
                />
                <div className="relative z-10 animate-float">
                  <Image
                    src={heroData.personImageUrl}
                    alt="Hero Illustration"
                    width={500}
                    height={500}
                    className="relative z-10 object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      {heroDataList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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
        </>
      )}

      {/* Carousel Dots/Indicators */}
      {heroDataList.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
          {heroDataList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSlide
                  ? "w-8 md:w-10 h-2 md:h-2.5"
                  : "w-2 h-2 md:w-2.5 md:h-2.5"
              }`}
              style={{
                backgroundColor:
                  idx === currentSlide
                    ? theme.primary
                    : `${theme.textSecondary}50`,
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar - Fills based on current slide number */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="relative h-1 bg-white/20">
          <div
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: theme.primary,
              boxShadow: `0 0 10px ${theme.primary}`,
              transition: "width 0.5s ease-out",
            }}
          />
        </div>
      </div>

      {/* Scroll Indicator with fade-in animation */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block transition-all duration-1000 delay-1000 ${
          animationState.buttons ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="animate-bounce">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke={theme.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        @keyframes slowZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        .animate-slow-zoom {
          animation: slowZoom 20s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader Component with shimmer effect
const HeroSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-[600px] lg:min-h-[700px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-32 h-8 bg-gray-700 rounded-full animate-shimmer" />
            <div className="space-y-4">
              <div className="h-16 bg-gray-700 rounded-lg w-3/4 animate-shimmer" />
              <div className="h-16 bg-gray-700 rounded-lg w-2/3 animate-shimmer" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-full animate-shimmer" />
              <div className="h-4 bg-gray-700 rounded w-5/6 animate-shimmer" />
              <div className="h-4 bg-gray-700 rounded w-4/6 animate-shimmer" />
            </div>
            <div className="flex gap-4">
              <div className="w-32 h-12 bg-gray-700 rounded-lg animate-shimmer" />
              <div className="w-32 h-12 bg-gray-700 rounded-lg animate-shimmer" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-96 h-96 bg-gray-700 rounded-full animate-shimmer mx-auto" />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(55, 65, 81, 1) 0%,
            rgba(75, 85, 99, 1) 50%,
            rgba(55, 65, 81, 1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

// Error Component with fade-in animation
const HeroError = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-[400px] flex items-center justify-center animate-fade-in">
      <div className="text-center space-y-4">
        <div
          className="text-6xl animate-bounce-slow"
          style={{ color: theme.textSecondary }}
        >
          ⚠️
        </div>
        <h3 className="text-xl font-semibold" style={{ color: theme.text }}>
          Hero Section Unavailable
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Unable to load hero section content at this moment.
        </p>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomeHeroSectionComponents;
