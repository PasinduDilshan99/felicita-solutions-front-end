// components/home-page-components/MissionVisionAndValues.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { CompanyInformationService } from "@/services/companyInformationService";
import { CompanyInformation } from "@/types/company-information-types";
import Image from "next/image";

const MissionVisionAndValues = () => {
  const { theme } = useTheme();
  const [missionData, setMissionData] = useState<CompanyInformation | null>(null);
  const [visionData, setVisionData] = useState<CompanyInformation | null>(null);
  const [valuesData, setValuesData] = useState<CompanyInformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await CompanyInformationService.fetchCompanyInformationData();
        
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          // Separate data by type
          const mission = data.find(item => item.type === "MISSION");
          const vision = data.find(item => item.type === "VISION");
          const values = data.filter(item => item.type === "VALUE");
          
          setMissionData(mission || null);
          setVisionData(vision || null);
          setValuesData(values);
        } else {
          // Fallback data
          setMissionData({
            id: 1,
            type: "MISSION",
            title: "Our Mission",
            description: "To empower businesses worldwide with innovative software solutions that drive growth, efficiency, and digital transformation.",
            iconUrl: "",
            imageUrl: null,
            displayOrder: 1,
            statusId: 1,
          });
          setVisionData({
            id: 2,
            type: "VISION",
            title: "Our Vision",
            description: "To become the world's most trusted technology partner, creating sustainable value through cutting-edge innovation and exceptional service.",
            iconUrl: "",
            imageUrl: null,
            displayOrder: 2,
            statusId: 1,
          });
          setValuesData([
            {
              id: 3,
              type: "VALUE",
              title: "Innovation",
              description: "We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.",
              iconUrl: "",
              imageUrl: null,
              displayOrder: 1,
              statusId: 1,
            },
            {
              id: 4,
              type: "VALUE",
              title: "Integrity",
              description: "We operate with transparency, honesty, and ethical practices in everything we do.",
              iconUrl: "",
              imageUrl: null,
              displayOrder: 2,
              statusId: 1,
            },
            {
              id: 5,
              type: "VALUE",
              title: "Excellence",
              description: "We strive for perfection and deliver high-quality solutions that exceed expectations.",
              iconUrl: "",
              imageUrl: null,
              displayOrder: 3,
              statusId: 1,
            },
            {
              id: 6,
              type: "VALUE",
              title: "Collaboration",
              description: "We believe in the power of teamwork and building strong partnerships with our clients.",
              iconUrl: "",
              imageUrl: null,
              displayOrder: 4,
              statusId: 1,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching company information:", err);
        setError("Failed to load company information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <MissionVisionSkeleton />;
  }

  if (error) {
    return <MissionVisionError />;
  }

  // Get icon based on value title
  const getValueIcon = (title: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      "Innovation": (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      "Integrity": (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      "Excellence": (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      "Collaboration": (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[title] || icons["Innovation"];
  };

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
              Who We Are
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            Our Mission, Vision & Values
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Guiding principles that drive everything we do
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          {missionData && (
            <div
              className="group relative p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px]"
              style={{
                backgroundColor: `${theme.primary}05`,
                border: `1px solid ${theme.border}`,
                boxShadow: `0 10px 30px -15px rgba(0, 0, 0, 0.1)`,
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
                {missionData.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: theme.textSecondary }}>
                {missionData.description}
              </p>
            </div>
          )}

          {/* Vision Card */}
          {visionData && (
            <div
              className="group relative p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px]"
              style={{
                backgroundColor: `${theme.primary}05`,
                border: `1px solid ${theme.border}`,
                boxShadow: `0 10px 30px -15px rgba(0, 0, 0, 0.1)`,
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
                {visionData.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: theme.textSecondary }}>
                {visionData.description}
              </p>
            </div>
          )}
        </div>

        {/* Values Section */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: theme.text }}>
              Our Core Values
            </h3>
            <p className="text-base" style={{ color: theme.textSecondary }}>
              The principles that guide our actions and decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesData.map((value, index) => (
              <div
                key={value.id}
                className="group cursor-pointer"
                onMouseEnter={() => setActiveValue(value.id)}
                onMouseLeave={() => setActiveValue(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="relative p-6 rounded-2xl transition-all duration-500 h-full text-center"
                  style={{
                    backgroundColor: activeValue === value.id ? `${theme.primary}10` : `${theme.surface}`,
                    border: `1px solid ${activeValue === value.id ? theme.primary : theme.border}`,
                    transform: activeValue === value.id ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: activeValue === value.id 
                      ? `0 20px 40px -12px ${theme.primary}30`
                      : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: activeValue === value.id ? `${theme.primary}20` : `${theme.primary}10`,
                      color: activeValue === value.id ? theme.primary : theme.primary,
                    }}
                  >
                    {getValueIcon(value.title)}
                  </div>

                  {/* Title */}
                  <h4
                    className="text-lg font-bold mb-3 transition-all duration-300"
                    style={{
                      color: activeValue === value.id ? theme.primary : theme.text,
                    }}
                  >
                    {value.title}
                  </h4>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed transition-all duration-300"
                    style={{ color: theme.textSecondary }}
                  >
                    {value.description}
                  </p>

                  {/* Decorative Line */}
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full transition-all duration-300 group-hover:w-16"
                    style={{
                      backgroundColor: activeValue === value.id ? theme.primary : theme.border,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            style={{
              backgroundColor: `${theme.primary}05`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <span className="text-sm" style={{ color: theme.textSecondary }}>
              Join us in our journey to make a difference
            </span>
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
const MissionVisionSkeleton = () => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-8 rounded-2xl animate-pulse"
              style={{ backgroundColor: `${theme.surface}` }}
            >
              <div
                className="w-16 h-16 rounded-2xl mb-6"
                style={{ backgroundColor: `${theme.primary}20` }}
              />
              <div
                className="h-7 w-32 rounded mb-4"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl animate-pulse text-center"
              style={{ backgroundColor: `${theme.surface}` }}
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-5"
                style={{ backgroundColor: `${theme.primary}20` }}
              />
              <div
                className="h-6 w-24 mx-auto rounded mb-3"
                style={{ backgroundColor: `${theme.text}20` }}
              />
              <div
                className="h-4 w-full rounded"
                style={{ backgroundColor: `${theme.textSecondary}20` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Error Component
const MissionVisionError = () => {
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
          Unable to Load Company Information
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please try again later
        </p>
      </div>
    </section>
  );
};

export default MissionVisionAndValues;