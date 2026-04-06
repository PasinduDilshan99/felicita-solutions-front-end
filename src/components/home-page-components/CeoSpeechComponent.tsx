// components/CeoSpeechComponent.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CeoSpeech } from "@/types/user-types";
import { useTheme } from "@/context/ThemeContext";
import VideoModal from "./VideoModal";
import { UserService } from "@/services/userService";

const CeoSpeechComponent = () => {
  const { theme } = useTheme();
  const [ceoData, setCeoData] = useState<CeoSpeech | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [animationState, setAnimationState] = useState({
    label: false,
    title: false,
    description: false,
    ceoInfo: false,
    image: false,
    videoButton: false,
  });
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch CEO data only when section becomes visible
  useEffect(() => {
    if (!sectionVisible || hasLoaded) return;

    const fetchCeoData = async () => {
      try {
        const { data, error } = await UserService.fetchCeoSpeechData();
        if (error) {
          setError(error);
        } else {
          setCeoData(data);
          setHasLoaded(true);
        }
      } catch (err) {
        console.error("Error fetching CEO data:", err);
        setError("Failed to load CEO information");
      } finally {
        setLoading(false);
      }
    };

    fetchCeoData();
  }, [sectionVisible, hasLoaded]);

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !sectionVisible) {
            setSectionVisible(true);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [sectionVisible]);

  // Trigger animations when data is loaded
  useEffect(() => {
    if (!loading && ceoData && sectionVisible) {
      // Sequential animations
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, label: true }));
      }, 100);
      
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, title: true }));
      }, 300);
      
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, description: true }));
      }, 500);
      
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, ceoInfo: true }));
      }, 700);
      
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, image: true }));
      }, 400);
      
      if (ceoData.videoUrl) {
        setTimeout(() => {
          setAnimationState(prev => ({ ...prev, videoButton: true }));
        }, 900);
      }
    }
  }, [loading, ceoData, sectionVisible]);

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleWatchVideo = () => {
    if (ceoData?.videoUrl) {
      setIsVideoModalOpen(true);
    }
  };

  // Don't render content until section is visible
  if (!sectionVisible) {
    return (
      <section 
        ref={sectionRef}
        className="w-full py-20 px-4 relative min-h-[600px]"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center h-full min-h-[500px]">
          <div className="text-center">
            <div className="inline-block">
              <div 
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${theme.primary} transparent ${theme.primary} transparent` }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section ref={sectionRef} className="w-full py-20 px-4 overflow-hidden">
        <CeoSkeleton />
      </section>
    );
  }

  if (error || !ceoData) {
    return (
      <section ref={sectionRef} className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-bounce-slow"
            style={{ backgroundColor: `${theme.error}10` }}
          >
            <svg className="w-8 h-8" fill="none" stroke={theme.error} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg" style={{ color: theme.error }}>
            {error || "Unable to load CEO information"}
          </p>
        </div>
        <style jsx>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </section>
    );
  }

  const videoId = getYouTubeVideoId(ceoData.videoUrl);

  return (
    <>
      <section 
        ref={sectionRef}
        className="w-full py-20 px-4 overflow-hidden relative"
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 100% 50%, ${theme.primary}05 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              {/* Section Label - Top to Bottom Animation */}
              <div className="mb-6">
                <span 
                  className={`text-sm font-semibold uppercase tracking-wider inline-block transform transition-all duration-700 ${
                    animationState.label
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0"
                  }`}
                  style={{ color: theme.primary }}
                >
                  ABOUT US
                </span>
              </div>

              {/* Title - Top to Bottom Animation */}
              <h2 
                className={`text-4xl md:text-5xl font-bold mb-6 leading-tight transform transition-all duration-700 delay-200 ${
                  animationState.title
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }`}
                style={{ color: theme.text }}
              >
                Our values and goals
              </h2>

              {/* Description/Speech - Fade In with Typing Effect */}
              <div className="mb-8">
                <p 
                  className={`text-gray-600 leading-relaxed transform transition-all duration-700 delay-400 ${
                    animationState.description
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-full opacity-0"
                  }`}
                  style={{ color: theme.textSecondary }}
                >
                  {ceoData.speech || ceoData.description || "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris."}
                </p>
              </div>

              {/* CEO Info - Bottom to Top Animation */}
              <div>
                <h3 
                  className={`text-xl font-bold mb-1 transform transition-all duration-700 delay-600 ${
                    animationState.ceoInfo
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0"
                  }`}
                  style={{ color: theme.text }}
                >
                  {ceoData.fullName}
                </h3>
                <p 
                  className={`text-sm transform transition-all duration-700 delay-700 ${
                    animationState.ceoInfo
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0"
                  }`}
                  style={{ color: theme.primary }}
                >
                  {ceoData.designation}
                </p>
              </div>
            </div>

            {/* Right Side - CEO Image - Bottom to Top Animation */}
            <div className="relative">
              <div 
                className={`relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-700 delay-300 ${
                  animationState.image
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-full opacity-0 scale-95"
                }`}
              >
                {ceoData.profileImageUrl ? (
                  <div className="relative w-full group">
                    <div className="relative overflow-hidden">
                      <Image
                        src={ceoData.profileImageUrl}
                        alt={ceoData.fullName}
                        width={600}
                        height={700}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      {/* Overlay gradient on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary}20 0%, transparent 100%)`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-[500px] flex items-center justify-center transition-all duration-500 hover:scale-105"
                    style={{ backgroundColor: `${theme.primary}10` }}
                  >
                    <div className="text-center">
                      <svg className="w-24 h-24 mx-auto mb-4 animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.primary }}>
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <p style={{ color: theme.textSecondary }}>CEO Image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Button - Positioned at bottom right with animation */}
              {ceoData.videoUrl && videoId && (
                <button
                  onClick={handleWatchVideo}
                  className={`absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-500 hover:scale-105 group shadow-lg transform ${
                    animationState.videoButton
                      ? "translate-x-0 opacity-100"
                      : "translate-x-full opacity-0"
                  }`}
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                  }}
                >
                  <svg 
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span className="text-sm font-medium">Watch Video</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.1);
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* Video Modal */}
      {videoId && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoId={videoId}
          title={`${ceoData.fullName} - ${ceoData.designation}`}
        />
      )}
    </>
  );
};

// Skeleton Component
const CeoSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div 
            className="h-6 w-24 rounded animate-shimmer"
            style={{ backgroundColor: `${theme.primary}20` }}
          />
          <div 
            className="h-12 w-3/4 rounded animate-shimmer"
            style={{ backgroundColor: `${theme.text}20` }}
          />
          <div className="space-y-3">
            <div 
              className="h-4 w-full rounded animate-shimmer"
              style={{ backgroundColor: `${theme.textSecondary}20` }}
            />
            <div 
              className="h-4 w-11/12 rounded animate-shimmer"
              style={{ backgroundColor: `${theme.textSecondary}20` }}
            />
            <div 
              className="h-4 w-10/12 rounded animate-shimmer"
              style={{ backgroundColor: `${theme.textSecondary}20` }}
            />
            <div 
              className="h-4 w-9/12 rounded animate-shimmer"
              style={{ backgroundColor: `${theme.textSecondary}20` }}
            />
          </div>
          <div className="space-y-2">
            <div 
              className="h-7 w-48 rounded animate-shimmer"
              style={{ backgroundColor: `${theme.text}20` }}
            />
            <div 
              className="h-5 w-32 rounded animate-shimmer"
              style={{ backgroundColor: `${theme.primary}20` }}
            />
          </div>
        </div>
        <div 
          className="w-full h-[500px] rounded-2xl animate-shimmer"
          style={{ backgroundColor: `${theme.primary}10` }}
        />
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
            rgba(55, 65, 81, 0.2) 0%,
            rgba(75, 85, 99, 0.4) 50%,
            rgba(55, 65, 81, 0.2) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default CeoSpeechComponent;