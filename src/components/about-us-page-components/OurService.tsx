// components/home-page-components/OurService.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ServiceService } from "@/services/serviceService";
import Image from "next/image";
import Link from "next/link";
import { BasicService } from "@/services/service-types";

const OurService = () => {
  const { theme } = useTheme();
  const [services, setServices] = useState<BasicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await ServiceService.fetchBasicServicesData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          // Filter only active services
          const activeServices = data.filter(
            (service) => service.status === "ACTIVE" || service.status === "VISIBLE"
          );
          setServices(activeServices);
        } else {
          // Fallback data
          setServices([
            {
              serviceId: 1,
              title: "Web Development",
              slug: "web-development",
              shortDescription: "Build modern, responsive websites and web applications with cutting-edge technologies.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Development",
            },
            {
              serviceId: 2,
              title: "Mobile App Development",
              slug: "mobile-app-development",
              shortDescription: "Create native and cross-platform mobile apps for iOS and Android devices.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Development",
            },
            {
              serviceId: 3,
              title: "Cloud Solutions",
              slug: "cloud-solutions",
              shortDescription: "Leverage cloud computing for scalability, security, and cost-efficiency.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Infrastructure",
            },
            {
              serviceId: 4,
              title: "AI & Machine Learning",
              slug: "ai-ml",
              shortDescription: "Implement intelligent solutions with advanced AI and ML algorithms.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Advanced Tech",
            },
            {
              serviceId: 5,
              title: "UI/UX Design",
              slug: "ui-ux-design",
              shortDescription: "Create beautiful, intuitive user interfaces with exceptional user experiences.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Design",
            },
            {
              serviceId: 6,
              title: "IT Consulting",
              slug: "it-consulting",
              shortDescription: "Get expert advice on technology strategy and digital transformation.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Consulting",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get unique categories for filter
  const categories = ["all", ...new Set(services.map((service) => service.categoryName))];

  // Filter services by category
  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.categoryName === selectedCategory);

  // Get icon based on service title or use custom icon
  const getServiceIcon = (title: string, iconUrl?: string) => {
    if (iconUrl) {
      return (
        <div className="relative w-12 h-12">
          <Image src={iconUrl} alt={title} fill className="object-contain" />
        </div>
      );
    }

    const icons: { [key: string]: React.ReactNode } = {
      "Web Development": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      "Mobile App Development": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      "Cloud Solutions": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      "AI & Machine Learning": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      "UI/UX Design": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      "IT Consulting": (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };
    return icons[title] || icons["Web Development"];
  };

  if (loading) {
    return <ServiceSkeleton />;
  }

  if (error) {
    return <ServiceError />;
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
              What We Do
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            Our Services
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Comprehensive solutions tailored to meet your business needs
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize"
                style={{
                  backgroundColor:
                    selectedCategory === category
                      ? theme.primary
                      : `${theme.primary}10`,
                  color:
                    selectedCategory === category
                      ? "#ffffff"
                      : theme.primary,
                  border: `1px solid ${
                    selectedCategory === category
                      ? theme.primary
                      : `${theme.primary}20`
                  }`,
                  transform: selectedCategory === category ? "scale(1.05)" : "scale(1)",
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service, index) => (
            <Link
              key={service.serviceId}
              href={`/services/${service.slug}`}
              className="group"
              onMouseEnter={() => setHoveredService(service.serviceId)}
              onMouseLeave={() => setHoveredService(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className="relative p-6 rounded-2xl transition-all duration-500 h-full"
                style={{
                  backgroundColor:
                    hoveredService === service.serviceId
                      ? `${theme.primary}05`
                      : theme.background,
                  border: `1px solid ${
                    hoveredService === service.serviceId
                      ? theme.primary
                      : theme.border
                  }`,
                  transform:
                    hoveredService === service.serviceId
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredService === service.serviceId
                      ? `0 20px 40px -12px ${theme.primary}30`
                      : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor:
                      hoveredService === service.serviceId
                        ? `${theme.primary}20`
                        : `${theme.primary}10`,
                    color:
                      hoveredService === service.serviceId
                        ? theme.primary
                        : theme.primary,
                  }}
                >
                  {getServiceIcon(service.title, service.iconUrl)}
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${theme.primary}10`,
                      color: theme.primary,
                    }}
                  >
                    {service.categoryName}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3 transition-all duration-300"
                  style={{
                    color:
                      hoveredService === service.serviceId
                        ? theme.primary
                        : theme.text,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: theme.textSecondary }}
                >
                  {service.shortDescription}
                </p>

                {/* Learn More Link */}
                <div
                  className="flex items-center gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{
                    transform:
                      hoveredService === service.serviceId
                        ? "translateX(0)"
                        : "translateX(-10px)",
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: theme.primary }}>
                    Learn More
                  </span>
                  <svg
                    className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: theme.primary }}
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
                </div>

                {/* Decorative Line */}
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full transition-all duration-300 group-hover:w-20"
                  style={{
                    backgroundColor:
                      hoveredService === service.serviceId
                        ? theme.primary
                        : theme.border,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Services Button */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: `${theme.primary}10`,
              color: theme.primary,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <span>View All Services</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
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
const ServiceSkeleton = () => {
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
                className="h-4 w-20 rounded mb-3"
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
const ServiceError = () => {
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
          Unable to Load Services
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please try again later
        </p>
      </div>
    </section>
  );
};

export default OurService;