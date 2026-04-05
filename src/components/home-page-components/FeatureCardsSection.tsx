// components/home-page-components/FeatureCardsSection.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FeatureService } from "@/services/featureService";
import { FeatureCard } from "@/types/feature-types";

const FeatureCardsSection = () => {
  const { theme } = useTheme();
  const [features, setFeatures] = useState<FeatureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const { data, error } = await FeatureService.fetchAllFeatures();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setFeatures(data);
        } else {
          setFeatures([
            {
              id: 1,
              title: "Smart software",
              description: "Duis aute irure dolor in repreherita ineto.",
              iconUrl: "/icons/smart-software.svg",
              status: "ACTIVE",
              order: 1
            },
            {
              id: 2,
              title: "Trusted security",
              description: "Lorem consectetur adipi elitised tempono.",
              iconUrl: "/icons/security.svg",
              status: "ACTIVE",
              order: 2
            },
            {
              id: 3,
              title: "Awards winners",
              description: "Ariento mesfato prodo arte e eli manifesto.",
              iconUrl: "/icons/awards.svg",
              status: "ACTIVE",
              order: 3
            },
            {
              id: 4,
              title: "Great experience",
              description: "Lorem consectetur adipiscing elitised pro.",
              iconUrl: "/icons/experience.svg",
              status: "ACTIVE",
              order: 4
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching features:", err);
        setError("Failed to load features");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return <FeatureCardsSkeleton />;
  }

  if (error) {
    return <FeatureCardsError />;
  }

  return (
    <section className="w-full py-16 md:py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            Why Choose Us
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Discover what makes us different from the rest
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group"
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className="relative p-6 rounded-xl transition-all duration-500 cursor-pointer h-full"
                style={{
                  backgroundColor: hoveredCard === feature.id ? `${theme.primary}05` : "transparent",
                  transform: hoveredCard === feature.id ? "translateY(-5px)" : "translateY(0)",
                  border: `2px solid ${hoveredCard === feature.id ? theme.primary : theme.border}`,
                  boxShadow: hoveredCard === feature.id 
                    ? `0 10px 30px -10px ${theme.primary}30`
                    : "none",
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{
                    backgroundColor: hoveredCard === feature.id 
                      ? `${theme.primary}15`
                      : `${theme.primary}08`,
                    border: `1px solid ${hoveredCard === feature.id ? theme.primary : theme.border}`,
                  }}
                >
                  {feature.iconUrl ? (
                    <img
                      src={feature.iconUrl}
                      alt={feature.title}
                      className="w-7 h-7 object-contain transition-all duration-300"
                      style={{
                        filter: hoveredCard === feature.id ? `brightness(0) saturate(100%) invert(35%) sepia(84%) saturate(1841%) hue-rotate(${
                          theme.primary === "#3b82f6" ? "210deg" : 
                          theme.primary === "#10b981" ? "140deg" :
                          theme.primary === "#8b5cf6" ? "260deg" : "0deg"
                        })` : "none",
                      }}
                    />
                  ) : (
                    <svg
                      className="w-7 h-7 transition-all duration-300"
                      fill="none"
                      stroke={hoveredCard === feature.id ? theme.primary : theme.textSecondary}
                      viewBox="0 0 24 24"
                    >
                      {index === 0 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      )}
                      {index === 1 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      )}
                      {index === 2 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      )}
                      {index === 3 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      )}
                    </svg>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-semibold mb-2 transition-all duration-300"
                  style={{
                    color: hoveredCard === feature.id ? theme.primary : theme.text,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed transition-all duration-300"
                  style={{ 
                    color: hoveredCard === feature.id ? theme.textSecondary : theme.textSecondary 
                  }}
                >
                  {feature.description}
                </p>

                {/* Optional: Learn More Link */}
                <div
                  className="mt-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
                  style={{
                    transform: hoveredCard === feature.id ? "translateX(0)" : "translateX(-10px)",
                  }}
                >
                  <span
                    className="text-xs font-medium inline-flex items-center gap-1"
                    style={{ color: theme.primary }}
                  >
                    Learn More
                    <svg
                      className="w-3 h-3"
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
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        
        .group {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader with prominent border style
const FeatureCardsSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <section className="w-full py-16 md:py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div 
            className="h-10 w-48 mx-auto rounded-lg mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.text}20` }}
          />
          <div 
            className="h-6 w-96 mx-auto rounded-lg animate-pulse"
            style={{ backgroundColor: `${theme.textSecondary}20` }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl animate-pulse"
              style={{
                backgroundColor: "transparent",
                border: `2px solid ${theme.border}`,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl mb-5"
                style={{ backgroundColor: `${theme.primary}15` }}
              />
              <div
                className="h-6 w-3/4 rounded mb-3"
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
          ))}
        </div>
      </div>
    </section>
  );
};

// Error Component
const FeatureCardsError = () => {
  const { theme } = useTheme();
  
  return (
    <section className="w-full py-16 md:py-20 px-4 relative">
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
          Unable to Load Features
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please try again later
        </p>
      </div>
    </section>
  );
};

export default FeatureCardsSection;