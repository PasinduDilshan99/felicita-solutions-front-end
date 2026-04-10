// components/home-page-components/OurBenefits.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { BenefitsService } from "@/services/benefitsService";
import { Benefit } from "@/types/benefits-types";
import Image from "next/image";

const OurBenefits = () => {
  const { theme } = useTheme();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const { data, error } = await BenefitsService.fetchActiveBenefitsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setBenefits(data);
        } else {
          // Fallback data
          setBenefits([
            {
              id: 1,
              title: "Expert Team",
              description: "Work with experienced professionals who are passionate about delivering excellence.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "Top 1% Talent",
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
              title: "Cutting-edge Technology",
              description: "Leverage the latest technologies and frameworks for your projects.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "Modern Stack",
              displayOrder: 2,
              status: "ACTIVE",
              createdAt: "",
              createdBy: null,
              updatedAt: "",
              updatedBy: null,
              terminatedAt: null,
              terminatedBy: null,
            },
            {
              id: 3,
              title: "24/7 Support",
              description: "Round-the-clock technical support to ensure your business runs smoothly.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "Always Available",
              displayOrder: 3,
              status: "ACTIVE",
              createdAt: "",
              createdBy: null,
              updatedAt: "",
              updatedBy: null,
              terminatedAt: null,
              terminatedBy: null,
            },
            {
              id: 4,
              title: "Cost Effective",
              description: "High-quality solutions at competitive prices with maximum ROI.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "Best Value",
              displayOrder: 4,
              status: "ACTIVE",
              createdAt: "",
              createdBy: null,
              updatedAt: "",
              updatedBy: null,
              terminatedAt: null,
              terminatedBy: null,
            },
            {
              id: 5,
              title: "Fast Delivery",
              description: "Agile methodology ensuring timely delivery without compromising quality.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "On Time",
              displayOrder: 5,
              status: "ACTIVE",
              createdAt: "",
              createdBy: null,
              updatedAt: "",
              updatedBy: null,
              terminatedAt: null,
              terminatedBy: null,
            },
            {
              id: 6,
              title: "Scalable Solutions",
              description: "Build solutions that grow with your business needs seamlessly.",
              iconUrl: "",
              imageUrl: null,
              highlightText: "Future Ready",
              displayOrder: 6,
              status: "ACTIVE",
              createdAt: "",
              createdBy: null,
              updatedAt: "",
              updatedBy: null,
              terminatedAt: null,
              terminatedBy: null,
            },
          ]);
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

  // Get icon based on benefit title
  const getBenefitIcon = (title: string, iconUrl?: string) => {
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
      "Cutting-edge Technology": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      "24/7 Support": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636L9.172 14.828m0 0l-3.536-3.536m3.536 3.536L9.172 9.172M12 21a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      ),
      "Cost Effective": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      "Fast Delivery": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      "Scalable Solutions": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
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
    return <BenefitsSkeleton />;
  }

  if (error) {
    return <BenefitsError />;
  }

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
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
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
            Our Benefits
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Discover the advantages of partnering with us
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className="group"
              onMouseEnter={() => setHoveredBenefit(benefit.id)}
              onMouseLeave={() => setHoveredBenefit(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className="relative p-6 rounded-2xl transition-all duration-500 h-full"
                style={{
                  backgroundColor:
                    hoveredBenefit === benefit.id
                      ? `${theme.primary}05`
                      : theme.background,
                  border: `1px solid ${
                    hoveredBenefit === benefit.id
                      ? theme.primary
                      : theme.border
                  }`,
                  transform:
                    hoveredBenefit === benefit.id
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredBenefit === benefit.id
                      ? `0 20px 40px -12px ${theme.primary}30`
                      : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor:
                      hoveredBenefit === benefit.id
                        ? `${theme.primary}20`
                        : `${theme.primary}10`,
                    color:
                      hoveredBenefit === benefit.id
                        ? theme.primary
                        : theme.primary,
                  }}
                >
                  {getBenefitIcon(benefit.title, benefit.iconUrl)}
                </div>

                {/* Highlight Text Badge */}
                {benefit.highlightText && (
                  <div className="mb-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${theme.primary}10`,
                        color: theme.primary,
                      }}
                    >
                      {benefit.highlightText}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3 transition-all duration-300"
                  style={{
                    color:
                      hoveredBenefit === benefit.id
                        ? theme.primary
                        : theme.text,
                  }}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {benefit.description}
                </p>

                {/* Decorative Line */}
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full transition-all duration-300 group-hover:w-20"
                  style={{
                    backgroundColor:
                      hoveredBenefit === benefit.id
                        ? theme.primary
                        : theme.border,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 pt-8 border-t" style={{ borderColor: theme.border }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: theme.primary }}>
                500+
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Projects Completed
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: theme.primary }}>
                200+
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Happy Clients
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: theme.primary }}>
                50+
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Expert Team
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: theme.primary }}>
                24/7
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Support Available
              </div>
            </div>
          </div>
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

// Skeleton Loader
const BenefitsSkeleton = () => {
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
            className="h-10 w-48 mx-auto rounded-lg mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.text}20` }}
          />
          <div
            className="h-5 w-96 mx-auto rounded-lg animate-pulse"
            style={{ backgroundColor: `${theme.textSecondary}20` }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl animate-pulse"
              style={{ backgroundColor: theme.surface }}
            >
              <div
                className="w-16 h-16 rounded-2xl mb-5"
                style={{ backgroundColor: `${theme.primary}20` }}
              />
              <div
                className="h-4 w-24 rounded mb-3"
                style={{ backgroundColor: `${theme.primary}20` }}
              />
              <div
                className="h-6 w-32 rounded mb-3"
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

export default OurBenefits;