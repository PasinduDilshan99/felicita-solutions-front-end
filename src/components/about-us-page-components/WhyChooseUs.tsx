// components/home-page-components/WhyChooseUs.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { WhyChooseUsService } from "@/services/whyChooseUsService";
import Image from "next/image";
import { WhyChooseUsTypes } from "@/types/why-choose-us-types";

const WhyChooseUs = () => {
  const { theme } = useTheme();
  const [reasons, setReasons] = useState<WhyChooseUsTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredReason, setHoveredReason] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await WhyChooseUsService.fetchWhyChooseUsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setReasons(data);
        } else {
          // Fallback data
          setReasons([
            {
              id: 1,
              title: "Expert Team",
              description: "Our team consists of industry experts with years of experience in delivering successful projects.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "10+ Years Experience",
              displayOrder: 1,
            },
            {
              id: 2,
              title: "Innovative Solutions",
              description: "We leverage cutting-edge technologies to provide innovative solutions tailored to your needs.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "Modern Tech Stack",
              displayOrder: 2,
            },
            {
              id: 3,
              title: "Client-Centric Approach",
              description: "Your success is our priority. We work closely with you to ensure your goals are achieved.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "100% Satisfaction",
              displayOrder: 3,
            },
            {
              id: 4,
              title: "24/7 Support",
              description: "Round-the-clock technical support to keep your business running smoothly at all times.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "Always Available",
              displayOrder: 4,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching why choose us data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get icon based on title or use custom icon
  const getIcon = (title: string, iconUrl?: string) => {
    if (iconUrl) {
      return (
        <div className="relative w-12 h-12">
          <Image src={iconUrl} alt={title} fill className="object-contain" />
        </div>
      );
    }

    const icons: { [key: string]: React.ReactNode } = {
      "Expert Team": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      "Innovative Solutions": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      "Client-Centric Approach": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      "24/7 Support": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636L9.172 14.828m0 0l-3.536-3.536m3.536 3.536L9.172 9.172M12 21a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      ),
    };
    return icons[title] || (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  };

  if (loading) {
    return <WhyChooseUsSkeleton />;
  }

  if (error) {
    return <WhyChooseUsError />;
  }

  // Split into two rows for better layout
  const midPoint = Math.ceil(reasons.length / 2);
  const firstRow = reasons.slice(0, midPoint);
  const secondRow = reasons.slice(midPoint);

  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
        }}
      />

      {/* Decorative Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
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
              Why Choose Us
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            What Makes Us Different
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Discover why businesses trust us for their digital transformation journey
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* First Row - Image Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Image */}
          <div className="relative order-2 lg:order-1">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105"
              style={{
                boxShadow: `0 20px 40px -12px ${theme.primary}30`,
              }}
            >
              <Image
                src="https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg"
                alt="Why Choose Us"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
            {/* Floating Badge */}
            <div
              className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg px-4 py-2 animate-float hidden md:flex items-center gap-2"
              style={{
                boxShadow: `0 10px 20px -5px ${theme.primary}20`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                Trusted by 500+ Companies
              </span>
            </div>
          </div>

          {/* Right Side - First Row Reasons */}
          <div className="order-1 lg:order-2 space-y-6">
            {firstRow.map((reason, index) => (
              <div
                key={reason.id}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredReason(reason.id)}
                onMouseLeave={() => setHoveredReason(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="flex gap-5 p-5 rounded-2xl transition-all duration-500"
                  style={{
                    backgroundColor:
                      hoveredReason === reason.id
                        ? `${theme.primary}05`
                        : "transparent",
                    border: `1px solid ${
                      hoveredReason === reason.id
                        ? theme.primary
                        : "transparent"
                    }`,
                    transform:
                      hoveredReason === reason.id
                        ? "translateX(8px)"
                        : "translateX(0)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor:
                        hoveredReason === reason.id
                          ? `${theme.primary}20`
                          : `${theme.primary}10`,
                      color:
                        hoveredReason === reason.id
                          ? theme.primary
                          : theme.primary,
                    }}
                  >
                    {getIcon(reason.title, reason.iconUrl)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${theme.primary}10`,
                          color: theme.primary,
                        }}
                      >
                        {reason.highlightText}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold mb-2 transition-all duration-300"
                      style={{
                        color:
                          hoveredReason === reason.id
                            ? theme.primary
                            : theme.text,
                      }}
                    >
                      {reason.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.textSecondary }}
                    >
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Content Left, Image Right */}
        {secondRow.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Second Row Reasons */}
            <div className="space-y-6">
              {secondRow.map((reason, index) => (
                <div
                  key={reason.id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredReason(reason.id)}
                  onMouseLeave={() => setHoveredReason(null)}
                  style={{
                    animationDelay: `${(firstRow.length + index) * 100}ms`,
                  }}
                >
                  <div
                    className="flex gap-5 p-5 rounded-2xl transition-all duration-500"
                    style={{
                      backgroundColor:
                        hoveredReason === reason.id
                          ? `${theme.primary}05`
                          : "transparent",
                      border: `1px solid ${
                        hoveredReason === reason.id
                          ? theme.primary
                          : "transparent"
                      }`,
                      transform:
                        hoveredReason === reason.id
                          ? "translateX(8px)"
                          : "translateX(0)",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor:
                          hoveredReason === reason.id
                            ? `${theme.primary}20`
                            : `${theme.primary}10`,
                        color:
                          hoveredReason === reason.id
                            ? theme.primary
                            : theme.primary,
                      }}
                    >
                      {getIcon(reason.title, reason.iconUrl)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${theme.primary}10`,
                            color: theme.primary,
                          }}
                        >
                          {reason.highlightText}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold mb-2 transition-all duration-300"
                        style={{
                          color:
                            hoveredReason === reason.id
                              ? theme.primary
                              : theme.text,
                        }}
                      >
                        {reason.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: theme.textSecondary }}
                      >
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Image */}
            <div className="relative">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105"
                style={{
                  boxShadow: `0 20px 40px -12px ${theme.secondary}30`,
                }}
              >
                <Image
                  src="https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg"
                  alt="Why Choose Us"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
              {/* Floating Badge */}
              <div
                className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg px-4 py-2 animate-float hidden md:flex items-center gap-2"
                style={{
                  boxShadow: `0 10px 20px -5px ${theme.secondary}20`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.secondary }}
                />
                <span className="text-sm font-medium" style={{ color: theme.text }}>
                  Award-Winning Service
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .group {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const WhyChooseUsSkeleton = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="h-6 w-32 mx-auto rounded-full mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.primary}20` }}
          />
          <div
            className="h-10 w-64 mx-auto rounded-lg mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.text}20` }}
          />
          <div
            className="h-5 w-96 mx-auto rounded-lg animate-pulse"
            style={{ backgroundColor: `${theme.textSecondary}20` }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-5 p-5 rounded-2xl animate-pulse">
                <div
                  className="w-14 h-14 rounded-xl"
                  style={{ backgroundColor: `${theme.primary}20` }}
                />
                <div className="flex-1">
                  <div
                    className="h-4 w-24 rounded mb-3"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  />
                  <div
                    className="h-6 w-32 rounded mb-2"
                    style={{ backgroundColor: `${theme.text}20` }}
                  />
                  <div className="space-y-2">
                    <div
                      className="h-4 w-full rounded"
                      style={{ backgroundColor: `${theme.textSecondary}20` }}
                    />
                    <div
                      className="h-4 w-11/12 rounded"
                      style={{ backgroundColor: `${theme.textSecondary}20` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="h-[400px] rounded-2xl animate-pulse"
            style={{ backgroundColor: `${theme.surface}` }}
          />
        </div>
      </div>
    </section>
  );
};

// Error Component
const WhyChooseUsError = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: `${theme.error}10` }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke={theme.error}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: theme.text }}
        >
          Unable to Load Data
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please try again later
        </p>
      </div>
    </section>
  );
};

export default WhyChooseUs;