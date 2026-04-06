// components/home-page-components/AboutUsOverview.tsx
"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

const AboutUsOverview = () => {
  const { theme } = useTheme();

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

  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Gradient Overlay */}
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
            {/* Title */}
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              style={{ color: theme.text }}
            >
              We Specialize in Transforming Your Idea or Business in The Current
              Digital Era.
            </h2>

            {/* Description */}
            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: theme.textSecondary }}
            >
              Our platform is tailor-made for developers, providing a powerful
              and easy-to-use solution. With our tools, you can streamline your
              development process. We offer a range of features that enable you
              to create robust applications quickly.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex items-center gap-3 group cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
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

            {/* CTA Button */}
            <div className="mt-10">
              <button
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: theme.primary,
                  color: "#ffffff",
                  boxShadow: `0 4px 15px ${theme.primary}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Learn More About Us
              </button>
            </div>
          </div>

          {/* Right Side - Image/Illustration */}
          <div className="relative">
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
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 -z-10"
              style={{ backgroundColor: theme.primary }}
            />
            <div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-2xl opacity-20 -z-10"
              style={{ backgroundColor: theme.secondary }}
            />

            {/* Floating Badge */}
            <div
              className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg px-4 py-2 animate-float hidden md:flex items-center gap-2"
              style={{
                boxShadow: `0 10px 20px -5px ${theme.primary}20`,
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

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .feature-item {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default AboutUsOverview;
