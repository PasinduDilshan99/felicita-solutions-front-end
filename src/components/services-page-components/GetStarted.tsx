"use client";

import React from "react";

const GetStarted = () => {
  // Background image URL (same as StatisticsComponent)
  const backgroundImageUrl =
    "https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg";

  // Theme colors (matching the StatisticsComponent gradient)
  const theme = {
    primary: "#3B82F6", // blue-500
    secondary: "#8B5CF6", // purple-500
  };

  return (
    <section
      className="w-full min-h-screen flex items-center justify-center px-4 relative animate-fadeInUp"
      style={{
        backgroundImage: `linear-gradient(135deg, ${theme.primary}CC 0%, ${theme.secondary}CC 100%), url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          style={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span className="text-white">Let's Discuss Your</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
            Digital Opportunity.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
          style={{
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          Unlock your digital transformation opportunities now!
        </p>

        {/* CTA Button */}
        <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent">
          <span>Get Started</span>
          <svg
            className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Bottom Decorative Line */}
        <div className="flex justify-center mt-16">
          <div
            className="w-24 h-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default GetStarted;