// components/ProjectClientsSection.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ProjectService } from "@/services/projectService";
import { ClientProject } from "@/types/project-types";
import { useTheme } from "@/context/ThemeContext";

const ProjectClientsSection = () => {
  const { theme } = useTheme();
  const [clients, setClients] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [headerAnimation, setHeaderAnimation] = useState({
    title1: false,
    title2: false,
  });
  const [clientAnimations, setClientAnimations] = useState<{
    [key: number]: boolean;
  }>({});
  const sectionRef = useRef<HTMLElement>(null);

  // Background image URL
  const backgroundImageUrl =
    "https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg";

  // Fetch clients only when section becomes visible
  useEffect(() => {
    if (!sectionVisible || hasLoaded) return;

    const fetchClients = async () => {
      try {
        const { data, error } = await ProjectService.fetchClientProjectsData();
        if (error) {
          setError(error);
        } else {
          setClients(data);
          setHasLoaded(true);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients data");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [sectionVisible, hasLoaded]);

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !sectionVisible) {
            setSectionVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [sectionVisible]);

  // Trigger animations when clients are loaded
  useEffect(() => {
    if (!loading && clients.length > 0 && sectionVisible) {
      // Trigger header animations
      setTimeout(() => {
        setHeaderAnimation((prev) => ({ ...prev, title1: true }));
      }, 100);

      setTimeout(() => {
        setHeaderAnimation((prev) => ({ ...prev, title2: true }));
      }, 300);

      // Trigger client logo animations with stagger effect
      clients.forEach((_, index) => {
        setTimeout(
          () => {
            setClientAnimations((prev) => ({ ...prev, [index]: true }));
          },
          500 + index * 100,
        );
      });
    }
  }, [loading, clients, sectionVisible]);

  const handleClientClick = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Don't render content until section is visible
  if (!sectionVisible) {
    return (
      <section
        ref={sectionRef}
        className="w-full py-16 md:py-24 px-4 relative min-h-[500px] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <div className="inline-block">
              <div
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: `${theme.primary} transparent ${theme.primary} transparent`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="w-full py-20 px-4 overflow-hidden relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <ClientSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section
        ref={sectionRef}
        className="w-full py-20 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-bounce-slow"
            style={{ backgroundColor: `${theme.error}20` }}
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
          <p className="text-lg" style={{ color: theme.error }}>
            {error}
          </p>
        </div>
        <style jsx>{`
          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24 px-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated overlay effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-0 animate-fadeIn delay-1000"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${theme.primary}10 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header with Animations */}
        <div className="text-center mb-16">
          <h2
            className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight transform transition-all duration-700 ${
              headerAnimation.title1
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
            style={{ color: "#ffffff" }}
          >
            Find a evolved and strong connection with
          </h2>
          <h3
            className={`text-3xl md:text-4xl lg:text-5xl font-bold transform transition-all duration-700 delay-300 ${
              headerAnimation.title2
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-full opacity-0 scale-95"
            }`}
            style={{ color: theme.primary }}
          >
            software and hardware communication
          </h3>
        </div>

        {/* Clients Logos with Separators */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
          {clients.map((client, index) => (
            <React.Fragment key={client.projectId}>
              <div
                className={`relative group transform transition-all duration-700 ${
                  clientAnimations[index]
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-full opacity-0 scale-95"
                }`}
                style={{
                  transitionDelay: `${500 + index * 100}ms`,
                }}
                onMouseEnter={() => setHoveredClient(client.projectId)}
                onMouseLeave={() => setHoveredClient(null)}
              >
                <div
                  className="cursor-pointer transition-all duration-500 hover:scale-110 hover:brightness-110 relative"
                  onClick={() => handleClientClick(client.productionUrl)}
                >
                  {client.companyLogo ? (
                    <div className="relative w-28 h-12 md:w-36 md:h-14">
                      <Image
                        src={client.companyLogo}
                        alt={client.companyName}
                        fill
                        className="object-contain transition-all duration-300 group-hover:drop-shadow-glow"
                        style={{
                          filter:
                            hoveredClient === client.projectId
                              ? `drop-shadow(0 0 8px ${theme.primary})`
                              : "none",
                        }}
                      />
                    </div>
                  ) : (
                    <span
                      className="text-base md:text-lg font-semibold whitespace-nowrap transition-all duration-300 group-hover:text-primary-glow"
                      style={{
                        color: "#ffffff",
                        textShadow:
                          hoveredClient === client.projectId
                            ? `0 0 10px ${theme.primary}`
                            : "none",
                      }}
                    >
                      {client.companyName}
                    </span>
                  )}

                  {/* Animated underline on hover */}
                  <div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                </div>

                {/* Tech Stack Tooltip with enhanced animation */}
                {client.techStack && hoveredClient === client.projectId && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none animate-float-up whitespace-nowrap">
                    <div
                      className="px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm"
                      style={{
                        backgroundColor: `${theme.surface}E6`,
                        color: theme.primary,
                        border: `1px solid ${theme.primary}`,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <span>
                          {client.techStack.split(",").slice(0, 3).join(" • ")}
                        </span>
                        {client.techStack.split(",").length > 3 && (
                          <span className="text-xs opacity-75">
                            +{client.techStack.split(",").length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                      style={{ backgroundColor: `${theme.surface}E6` }}
                    />
                  </div>
                )}
              </div>

              {/* Separator with animation */}
              {index < clients.length - 1 && (
                <span
                  className={`text-2xl md:text-3xl font-light opacity-50 select-none transform transition-all duration-500 ${
                    clientAnimations[index]
                      ? "scale-100 opacity-50"
                      : "scale-0 opacity-0"
                  }`}
                  style={{
                    color: theme.primary,
                    transitionDelay: `${600 + index * 100}ms`,
                  }}
                >
                  |
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Decorative element */}
        <div className="mt-16 flex justify-center">
          <div
            className="w-12 h-1 rounded-full opacity-50 animate-pulse-slow"
            style={{ backgroundColor: theme.primary }}
          />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float-up {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            width: 3rem;
          }
          50% {
            opacity: 0.6;
            width: 4rem;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-float-up {
          animation: float-up 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 0px ${theme.primary};
          }
          50% {
            text-shadow: 0 0 10px ${theme.primary};
          }
        }

        .text-primary-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader Component
const ClientSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="relative z-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-8 w-64 bg-gray-700 rounded mx-auto mb-4 animate-shimmer" />
        <div className="h-12 w-96 bg-gray-700 rounded mx-auto animate-shimmer" />
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="animate-shimmer">
            <div className="w-32 h-12 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(55, 65, 81, 0.4) 0%,
            rgba(75, 85, 99, 0.6) 50%,
            rgba(55, 65, 81, 0.4) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProjectClientsSection;
