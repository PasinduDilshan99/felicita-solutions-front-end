// components/home-page-components/AboutUsOverview.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";

const AboutUsOverview = () => {
  const { theme } = useTheme();
  const [animationState, setAnimationState] = useState({
    title: false,
    description: false,
    features: false,
    button: false,
    image: false,
    badge: false,
  });
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      id: 1,
      text: "Accelerate Innovation",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      text: "With world-class tech teams",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      text: "Our all service offerings to enhance",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: 4,
      text: "Simply drag, drop and customize",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  // Trigger animations sequentially when component mounts
  useEffect(() => {
    // Title animation (top to bottom)
    const titleTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, title: true }));
    }, 100);

    // Description animation (top to bottom)
    const descTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, description: true }));
    }, 400);

    // Features animation - staggered
    const featureTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, features: true }));
      // Stagger feature items
      features.forEach((_, index) => {
        setTimeout(() => {
          setCurrentFeatureIndex(index + 1);
        }, index * 150);
      });
    }, 700);

    // Button animation (bottom to top)
    const buttonTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, button: true }));
    }, 1000);

    // Image animation (bottom to top)
    const imageTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, image: true }));
    }, 1300);

    // Badge animation (scale)
    const badgeTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, badge: true }));
    }, 1600);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(descTimer);
      clearTimeout(featureTimer);
      clearTimeout(buttonTimer);
      clearTimeout(imageTimer);
      clearTimeout(badgeTimer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 px-4 relative overflow-hidden"
    >
      {/* Background Image with Parallax and Slow Zoom */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 scale-110 animate-slow-zoom">
          <Image
            src="https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg"
            alt="Background"
            fill
            className="object-cover"
            quality={100}
          />
        </div>
        {/* Gradient Overlay with theme colors */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.background}EE 0%, ${theme.background}DD 100%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div>
            {/* Title - Top to Bottom Animation */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight transform transition-all duration-700 ${
                animationState.title
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
              style={{ color: theme.text }}
            >
              We Specialize in Transforming Your Idea or Business in The Current
              Digital Era.
            </h2>

            {/* Description - Top to Bottom Animation */}
            <p
              className={`text-base md:text-lg leading-relaxed mb-8 transform transition-all duration-700 ${
                animationState.description
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
              style={{ color: theme.textSecondary }}
            >
              Our platform is tailor-made for developers, providing a powerful
              and easy-to-use solution. With our tools, you can streamline your
              development process. We offer a range of features that enable you
              to create robust applications quickly.
            </p>

            {/* Features List - Staggered Fade-in from Left */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`flex items-center gap-3 group cursor-pointer transform transition-all duration-500 ${
                    currentFeatureIndex > index
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-full opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      backgroundColor: `${theme.primary}15`,
                      color: theme.primary,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <span
                    className="text-base md:text-lg font-medium transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: theme.text }}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button - Bottom to Top Animation */}
            <div
              className={`mt-10 transform transition-all duration-700 ${
                animationState.button
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }`}
            >
              <Link
                href="/about"
                className="inline-block px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                style={{
                  backgroundColor: theme.primary,
                  color: "#ffffff",
                  boxShadow: `0 4px 15px ${theme.primary}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <span className="relative z-10">Learn More About Us</span>
                <span
                  className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ backgroundColor: `${theme.primary}CC` }}
                />
              </Link>
            </div>
          </div>

          {/* Right Side - Image/Illustration - Bottom to Top Animation */}
          <div
            className={`relative transform transition-all duration-700 ${
              animationState.image
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105"
              style={{
                boxShadow: `0 20px 40px -12px ${theme.primary}30`,
              }}
            >
              <Image
                src="https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg"
                alt="About Us Illustration"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Decorative Elements with Pulse Animation */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 -z-10 animate-pulse-slow"
              style={{ backgroundColor: theme.primary }}
            />
            <div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-2xl opacity-20 -z-10 animate-pulse-slow"
              style={{ backgroundColor: theme.secondary || theme.primary }}
            />

            {/* Floating Badge - Scale Animation */}
            <div
              className={`absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg px-4 py-2 hidden md:flex items-center gap-2 transition-all duration-500 ${
                animationState.badge
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0"
              }`}
              style={{
                boxShadow: `0 10px 20px -5px ${theme.primary}20`,
                transitionDelay: "200ms",
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: theme.text }}
              >
                10+ Years of Excellence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add animations matching hero section */}
      <style jsx>{`
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
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slow-zoom {
          animation: slowZoom 20s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutUsOverview;