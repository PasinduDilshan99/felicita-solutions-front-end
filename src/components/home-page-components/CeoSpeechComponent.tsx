// components/CeoSpeechComponent.tsx
"use client";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchCeoData = async () => {
      try {
        const { data, error } = await UserService.fetchCeoSpeechData();
        if (error) {
          setError(error);
        } else {
          setCeoData(data);
        }
      } catch (err) {
        console.error("Error fetching CEO data:", err);
        setError("Failed to load CEO information");
      } finally {
        setLoading(false);
      }
    };

    fetchCeoData();
  }, []);

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleWatchVideo = () => {
    if (ceoData?.videoUrl) {
      setIsVideoModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
                <div className="h-4 w-10/12 bg-gray-200 rounded"></div>
                <div className="h-4 w-9/12 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-8">
                <div className="h-7 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="w-full h-[500px] bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ceoData) {
    return (
      <div className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg" style={{ color: theme.error }}>
            {error || "Unable to load CEO information"}
          </p>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(ceoData.videoUrl);

  return (
    <>
      <section className="w-full py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              {/* Section Label */}
              <div className="mb-6">
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: theme.primary }}
                >
                  ABOUT US
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ color: theme.text }}
              >
                Our values and goals
              </h2>

              {/* Description/Speech */}
              <div className="mb-8">
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {ceoData.speech ||
                    ceoData.description ||
                    "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris."}
                </p>
              </div>

              {/* CEO Info */}
              <div>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: theme.text }}
                >
                  {ceoData.fullName}
                </h3>
                <p className="text-sm" style={{ color: theme.primary }}>
                  {ceoData.designation}
                </p>
              </div>
            </div>

            {/* Right Side - CEO Image */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                {ceoData.profileImageUrl ? (
                  <div className="relative w-full">
                    <Image
                      src={ceoData.profileImageUrl}
                      alt={ceoData.fullName}
                      width={600}
                      height={700}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div
                    className="w-full h-[500px] flex items-center justify-center"
                    style={{ backgroundColor: `${theme.primary}10` }}
                  >
                    <div className="text-center">
                      <svg
                        className="w-24 h-24 mx-auto mb-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.primary }}
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <p style={{ color: theme.textSecondary }}>CEO Image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Button - Positioned at bottom right of image */}
              {ceoData.videoUrl && videoId && (
                <button
                  onClick={handleWatchVideo}
                  className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 group shadow-lg"
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-sm font-medium">Watch Video</span>
                </button>
              )}
            </div>
          </div>
        </div>
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

export default CeoSpeechComponent;
