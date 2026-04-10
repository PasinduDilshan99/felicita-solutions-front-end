// components/pricing-page/PricingOurFeatures.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FeatureService } from "@/services/featureService";
import { FeatureCard } from "@/types/feature-types";
import Image from "next/image";

const PricingOurFeatures = () => {
  const { theme } = useTheme();
  const [features, setFeatures] = useState<FeatureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const { data, error } = await FeatureService.fetchAllFeatures();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setFeatures(data);
        } else {
          // Fallback data
          setFeatures([
            {
              id: 1,
              title: "Easy to Use",
              description: "Intuitive interface designed for seamless user experience with minimal learning curve.",
              iconUrl: "",
              status: "ACTIVE",
              order: 1,
            },
            {
              id: 2,
              title: "Fast Performance",
              description: "Optimized for speed and efficiency with minimal loading times and smooth interactions.",
              iconUrl: "",
              status: "ACTIVE",
              order: 2,
            },
            {
              id: 3,
              title: "Secure Platform",
              description: "Enterprise-grade security with end-to-end encryption to protect your valuable data.",
              iconUrl: "",
              status: "ACTIVE",
              order: 3,
            },
            {
              id: 4,
              title: "24/7 Support",
              description: "Round-the-clock assistance from our expert team via chat, email, and phone.",
              iconUrl: "",
              status: "ACTIVE",
              order: 4,
            },
            {
              id: 5,
              title: "Customizable",
              description: "Tailor the platform to match your specific business needs and branding requirements.",
              iconUrl: "",
              status: "ACTIVE",
              order: 5,
            },
            {
              id: 6,
              title: "Scalable",
              description: "Grow your business with our scalable infrastructure that adapts to your needs.",
              iconUrl: "",
              status: "ACTIVE",
              order: 6,
            },
            {
              id: 7,
              title: "Regular Updates",
              description: "Continuous improvements with new features, security patches, and performance enhancements.",
              iconUrl: "",
              status: "ACTIVE",
              order: 7,
            },
            {
              id: 8,
              title: "API Access",
              description: "Full REST API access for seamless integration with your existing tools and workflows.",
              iconUrl: "",
              status: "ACTIVE",
              order: 8,
            },
            {
              id: 9,
              title: "Analytics Dashboard",
              description: "Comprehensive analytics and reporting to track performance and make data-driven decisions.",
              iconUrl: "",
              status: "ACTIVE",
              order: 9,
            },
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

  // Get icon based on feature title
  const getFeatureIcon = (title: string, iconUrl?: string) => {
    if (iconUrl) {
      return (
        <div className="relative w-12 h-12">
          <Image src={iconUrl} alt={title} fill className="object-contain" />
        </div>
      );
    }

    const icons: { [key: string]: React.ReactNode } = {
      "Easy to Use": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      "Fast Performance": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      "Secure Platform": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      "24/7 Support": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636L9.172 14.828m0 0l-3.536-3.536m3.536 3.536L9.172 9.172M12 21a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      ),
      "Customizable": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      "Scalable": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      "Regular Updates": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      "API Access": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      "Analytics Dashboard": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
    return <FeaturesSkeleton />;
  }

  if (error) {
    return <FeaturesError error={error} />;
  }

  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
          }}
        />
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse-slow"
          style={{ backgroundColor: `${theme.primary}15` }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slower"
          style={{ backgroundColor: `${theme.secondary}15` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span
              className="text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full animate-scale-in"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.primary,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              Platform Features
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            Everything You Need to <span style={{ color: theme.primary }}>Succeed</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Powerful features designed to help you grow your business and streamline your workflow
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group feature-card"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className="relative p-6 rounded-2xl transition-all duration-500 h-full"
                style={{
                  backgroundColor:
                    hoveredFeature === feature.id
                      ? `${theme.primary}05`
                      : theme.background,
                  border: `1px solid ${
                    hoveredFeature === feature.id
                      ? theme.primary
                      : theme.border
                  }`,
                  transform:
                    hoveredFeature === feature.id
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredFeature === feature.id
                      ? `0 25px 50px -12px ${theme.primary}40`
                      : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Icon with Animation */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor:
                      hoveredFeature === feature.id
                        ? `${theme.primary}20`
                        : `${theme.primary}10`,
                    color:
                      hoveredFeature === feature.id
                        ? theme.primary
                        : theme.primary,
                  }}
                >
                  {getFeatureIcon(feature.title, feature.iconUrl)}
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3 transition-all duration-300"
                  style={{
                    color:
                      hoveredFeature === feature.id
                        ? theme.primary
                        : theme.text,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full transition-all duration-300 group-hover:w-20"
                  style={{
                    backgroundColor:
                      hoveredFeature === feature.id
                        ? theme.primary
                        : theme.border,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fade-in-up animation-delay-800">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              backgroundColor: `${theme.primary}05`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <span className="text-sm" style={{ color: theme.textSecondary }}>
              And many more features to help you succeed
            </span>
            <svg
              className="w-4 h-4 animate-pulse-x"
              style={{ color: theme.primary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

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

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2);
          }
        }

        @keyframes pulse-x {
          0%, 100% {
            transform: translateX(0);
            opacity: 0.5;
          }
          50% {
            transform: translateX(5px);
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }

        .animate-pulse-x {
          animation: pulse-x 1.5s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .feature-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const FeaturesSkeleton = () => {
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
const FeaturesError = ({ error }: { error: string | null }) => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-bounce"
          style={{ backgroundColor: `${theme.error}10` }}
        >
          <svg
            className="w-10 h-10"
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
        <h3 className="text-2xl font-semibold mb-2" style={{ color: theme.text }}>
          {error || "Unable to Load Features"}
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please check your connection and try again
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: theme.primary,
            color: "#ffffff",
          }}
        >
          Retry
        </button>
      </div>
    </section>
  );
};

export default PricingOurFeatures;