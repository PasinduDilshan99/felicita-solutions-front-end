// components/home-page-components/BenefitsComponent.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { BenefitsService } from "@/services/benefitsService";
import { Benefit } from "@/types/benefits-types";
import Image from "next/image";

const BenefitsComponent = () => {
  const { theme } = useTheme();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const { data, error } = await BenefitsService.fetchActiveBenefitsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setBenefits(data);
          // Set first benefit as expanded by default
          setExpandedBenefit(data[0]?.id || null);
        } else {
          // Fallback data if API returns empty
          setBenefits([
            {
              id: 1,
              title: "The membership cards",
              description: "Lorem ipsum dolor sit amet consectetuer adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.",
              iconUrl: "",
              imageUrl: "https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg",
              highlightText: "Financials helps and money back",
              displayOrder: 1,
              status: "ACTIVE",
              createdAt: "",
              createdBy: null,
              updatedAt: "",
              updatedBy: null,
              terminatedAt: null,
              terminatedBy: null,
            },
            {
              id: 2,
              title: "Team creation and support",
              description: "Lorem ipsum dolor sit amet consectetuer adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.",
              iconUrl: "",
              imageUrl: null,
              highlightText: null,
              displayOrder: 2,
              status: "ACTIVE",
              createdAt: "",
              createdBy: null,
              updatedAt: "",
              updatedBy: null,
              terminatedAt: null,
              terminatedBy: null,
            },
          ]);
          setExpandedBenefit(1);
        }
      } catch (err) {
        console.error("Error fetching benefits:", err);
        setError("Failed to load benefits");
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  const toggleBenefit = (benefitId: number) => {
    setExpandedBenefit(expandedBenefit === benefitId ? null : benefitId);
  };

  // Get the currently expanded benefit
  const currentBenefit = benefits.find(b => b.id === expandedBenefit);

  if (loading) {
    return <BenefitsSkeleton />;
  }

  if (error) {
    return <BenefitsError />;
  }

  return (
    <section
      className="w-full py-20 px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
      }}
    >
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Content */}
          <div>
            {/* Section Label */}
            <div className="mb-6">
              <span
                className="text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}20`,
                }}
              >
                EXCLUSIVE BENEFITS
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: theme.text }}
            >
              You should choose us
            </h2>

            {/* Description */}
            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: theme.textSecondary }}
            >
              Lorem ipsum dolor sit amet consecteture Duis aute irure dolor innocente 
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
            </p>

            {/* Benefits Accordion */}
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: expandedBenefit === benefit.id 
                      ? `${theme.primary}05`
                      : "transparent",
                    border: `1px solid ${
                      expandedBenefit === benefit.id 
                        ? theme.primary 
                        : theme.border
                    }`,
                  }}
                  onMouseEnter={() => setHoveredBenefit(benefit.id)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                >
                  {/* Benefit Title - Clickable Header */}
                  <button
                    onClick={() => toggleBenefit(benefit.id)}
                    className="w-full text-left p-5 flex items-center justify-between group transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {/* Icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: expandedBenefit === benefit.id 
                            ? `${theme.primary}20`
                            : `${theme.primary}10`,
                        }}
                      >
                        {benefit.iconUrl ? (
                          <img
                            src={benefit.iconUrl}
                            alt={benefit.title}
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke={expandedBenefit === benefit.id ? theme.primary : theme.textSecondary}
                            viewBox="0 0 24 24"
                          >
                            {benefit.title.includes("membership") && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M6 14h2m3 0h5M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"
                              />
                            )}
                            {benefit.title.includes("Team") && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            )}
                          </svg>
                        )}
                      </div>
                      <h3
                        className="text-lg font-semibold transition-all duration-300"
                        style={{
                          color: expandedBenefit === benefit.id 
                            ? theme.primary 
                            : theme.text,
                        }}
                      >
                        {benefit.title}
                      </h3>
                    </div>
                    
                    {/* Expand/Collapse Icon */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: expandedBenefit === benefit.id 
                          ? `${theme.primary}20`
                          : `${theme.textSecondary}10`,
                      }}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          expandedBenefit === benefit.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke={expandedBenefit === benefit.id ? theme.primary : theme.textSecondary}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expandable Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedBenefit === benefit.id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-5 pb-5 pt-2">
                      {/* Highlight Text if exists */}
                      {benefit.highlightText && (
                        <p
                          className="text-sm font-semibold mb-3"
                          style={{ color: theme.primary }}
                        >
                          {benefit.highlightText}
                        </p>
                      )}
                      
                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: theme.textSecondary }}
                      >
                        {benefit.description}
                      </p>

                      {/* Additional Features */}
                      {/* <div className="mt-4 space-y-2">
                        {[
                          "Secure and reliable",
                          "24/7 customer support",
                          "Easy to use interface",
                        ].map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke={theme.primary}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              className="text-xs"
                              style={{ color: theme.textSecondary }}
                            >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative lg:sticky lg:top-24">
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 group"
              style={{
                boxShadow: `0 20px 40px -12px ${theme.primary}20`,
              }}
            >
              <Image
                src="https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg"
                alt="Benefits Illustration"
                width={600}
                height={500}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              {/* Decorative Badge */}
              <div
                className="absolute bottom-4 right-4 px-3 py-1 rounded-full backdrop-blur-md bg-black/50"
              >
                <span className="text-xs text-white">Premium Benefits</span>
              </div>
            </div>

            {/* Decorative Elements around Image */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 -z-10"
              style={{ backgroundColor: theme.primary }}
            />
            <div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-2xl opacity-20 -z-10"
              style={{ backgroundColor: theme.secondary }}
            />
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .benefit-item {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const BenefitsSkeleton = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side Skeleton */}
          <div>
            <div
              className="h-6 w-40 rounded-full mb-6 animate-pulse"
              style={{ backgroundColor: `${theme.primary}20` }}
            />
            <div
              className="h-10 w-64 rounded-lg mb-4 animate-pulse"
              style={{ backgroundColor: `${theme.text}20` }}
            />
            <div className="space-y-2 mb-8">
              <div
                className="h-4 w-full rounded animate-pulse"
                style={{ backgroundColor: `${theme.textSecondary}20` }}
              />
              <div
                className="h-4 w-11/12 rounded animate-pulse"
                style={{ backgroundColor: `${theme.textSecondary}20` }}
              />
              <div
                className="h-4 w-10/12 rounded animate-pulse"
                style={{ backgroundColor: `${theme.textSecondary}20` }}
              />
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl animate-pulse"
                  style={{
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: `${theme.primary}20` }}
                      />
                      <div
                        className="h-5 w-32 rounded"
                        style={{ backgroundColor: `${theme.text}20` }}
                      />
                    </div>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: `${theme.textSecondary}10` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Skeleton */}
          <div>
            <div
              className="h-[400px] rounded-2xl animate-pulse"
              style={{ backgroundColor: `${theme.surface}` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Error Component
const BenefitsError = () => {
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
          Unable to Load Benefits
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please try again later
        </p>
      </div>
    </section>
  );
};

export default BenefitsComponent;