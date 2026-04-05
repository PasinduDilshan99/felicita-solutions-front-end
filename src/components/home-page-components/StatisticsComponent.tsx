// components/home-page-components/StatisticsComponent.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { CommonService } from "@/services/commonService";
import { Statistics } from "@/types/common-types";

const StatisticsComponent = () => {
  const { theme } = useTheme();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counters, setCounters] = useState({
    yearsOfExperience: 0,
    users: 0,
    clients: 0,
    projects: 0,
    teamMembers: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Background image URL
  const backgroundImageUrl = "https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg";

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data, error } = await CommonService.fetchStatisticsData();
        if (error) {
          setError(error);
        } else if (data) {
          setStatistics(data);
        } else {
          // Fallback data
          setStatistics({
            totalYearsOfExperience: 25,
            totalUsers: 50000,
            totalClients: 1200,
            totalProjects: 350,
            totalTeamMembers: 150,
          });
        }
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Animate counters when section comes into view
  useEffect(() => {
    if (!statistics || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [statistics, hasAnimated]);

  const animateCounters = () => {
    if (!statistics) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      yearsOfExperience: statistics.totalYearsOfExperience,
      users: statistics.totalUsers,
      clients: statistics.totalClients,
      projects: statistics.totalProjects,
      teamMembers: statistics.totalTeamMembers,
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        yearsOfExperience: Math.floor(targets.yearsOfExperience * progress),
        users: Math.floor(targets.users * progress),
        clients: Math.floor(targets.clients * progress),
        projects: Math.floor(targets.projects * progress),
        teamMembers: Math.floor(targets.teamMembers * progress),
      });

      if (step >= steps) {
        setCounters(targets);
        clearInterval(timer);
      }
    }, interval);
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return <StatisticsSkeleton />;
  }

  if (error || !statistics) {
    return <StatisticsError />;
  }

  const statsItems = [
    {
      id: 1,
      value: counters.yearsOfExperience,
      label: "Years of Experience",
      suffix: "+",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      value: counters.users,
      label: "Happy Users",
      suffix: "+",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      value: counters.clients,
      label: "Trusted Clients",
      suffix: "+",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: 4,
      value: counters.projects,
      label: "Projects Completed",
      suffix: "+",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      id: 5,
      value: counters.teamMembers,
      label: "Team Members",
      suffix: "+",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full py-20 px-4 relative"
      style={{
        backgroundImage: `linear-gradient(135deg, ${theme.primary}CC 0%, ${theme.secondary}CC 100%), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Statistics Grid - All in one line */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {statsItems.map((item, index) => (
            <div
              key={item.id}
              className="text-center group"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                }}
              >
                {item.icon}
              </div>

              {/* Value */}
              <div className="mb-2">
                <span
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {formatNumber(item.value)}
                </span>
                {item.suffix && (
                  <span
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {item.suffix}
                  </span>
                )}
              </div>

              {/* Label */}
              <p
                className="text-xs md:text-sm font-medium uppercase tracking-wide text-white/90"
                style={{
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Decorative Line */}
        <div className="flex justify-center mt-12">
          <div 
            className="w-24 h-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          />
        </div>
      </div>

      {/* Add animations */}
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
const StatisticsSkeleton = () => {
  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="text-center animate-pulse">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              />
              <div
                className="h-8 w-24 mx-auto rounded mb-2"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              />
              <div
                className="h-4 w-20 mx-auto rounded"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Error Component
const StatisticsError = () => {
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
          Unable to Load Statistics
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please try again later
        </p>
      </div>
    </section>
  );
};

export default StatisticsComponent;