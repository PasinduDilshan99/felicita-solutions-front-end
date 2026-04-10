// components/service-page-components/OurService.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ServiceService } from "@/services/serviceService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BasicService } from "@/services/service-types";

const OurService = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [services, setServices] = useState<BasicService[]>([]);
  const [filteredServices, setFilteredServices] = useState<BasicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

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
          setFilteredServices(activeServices);
          
          // Extract unique categories
          const uniqueCategories = ["all", ...new Set(activeServices.map((s) => s.categoryName).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          // Fallback data
          const fallbackServices = [
            {
              serviceId: 1,
              title: "Web Development",
              slug: "web-development",
              shortDescription: "Build modern, responsive websites and web applications with cutting-edge technologies like React, Next.js, and Node.js.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Development",
            },
            {
              serviceId: 2,
              title: "Mobile App Development",
              slug: "mobile-app-development",
              shortDescription: "Create native and cross-platform mobile apps for iOS and Android using React Native, Flutter, and Swift.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Development",
            },
            {
              serviceId: 3,
              title: "Cloud Solutions",
              slug: "cloud-solutions",
              shortDescription: "Leverage cloud computing for scalability, security, and cost-efficiency with AWS, Azure, and GCP.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Infrastructure",
            },
            {
              serviceId: 4,
              title: "AI & Machine Learning",
              slug: "ai-ml",
              shortDescription: "Implement intelligent solutions with advanced AI and ML algorithms for predictive analytics.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Advanced Tech",
            },
            {
              serviceId: 5,
              title: "UI/UX Design",
              slug: "ui-ux-design",
              shortDescription: "Create beautiful, intuitive user interfaces with exceptional user experiences and modern design.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Design",
            },
            {
              serviceId: 6,
              title: "IT Consulting",
              slug: "it-consulting",
              shortDescription: "Get expert advice on technology strategy, digital transformation, and business optimization.",
              iconUrl: "",
              imageUrl: "",
              status: "ACTIVE",
              categoryName: "Consulting",
            },
          ];
          setServices(fallbackServices);
          setFilteredServices(fallbackServices);
          const uniqueCategories = ["all", ...new Set(fallbackServices.map((s) => s.categoryName))];
          setCategories(uniqueCategories);
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

  // Filter services based on category and search term
  useEffect(() => {
    let filtered = services;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.categoryName === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm, services]);

  const handleServiceClick = (serviceId: number, serviceName: string) => {
    router.push(`/services/${serviceId}?name=${encodeURIComponent(serviceName)}`);
  };

  // Get icon based on service title
  const getServiceIcon = (title: string, iconUrl?: string) => {
    if (iconUrl) {
      return (
        <div className="relative w-14 h-14">
          <Image src={iconUrl} alt={title} fill className="object-contain" />
        </div>
      );
    }

    const icons: { [key: string]: React.ReactNode } = {
      "Web Development": (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      "Mobile App Development": (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      "Cloud Solutions": (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      "AI & Machine Learning": (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      "UI/UX Design": (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      "IT Consulting": (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };
    return icons[title] || (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };

  if (loading) {
    return <ServiceSkeleton />;
  }

  if (error) {
    return <ServiceError />;
  }

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 px-4 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
          }}
        />
        {/* Animated gradient orbs */}
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse-slow"
          style={{ backgroundColor: `${theme.primary}15` }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slower"
          style={{ backgroundColor: `${theme.secondary}15` }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse-slow"
          style={{ backgroundColor: `${theme.primary}08` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header with Animation */}
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
              What We Do
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            Our <span style={{ color: theme.primary }}>Services</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Comprehensive solutions tailored to meet your business needs and drive digital transformation
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 animate-fade-in-up animation-delay-600">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl outline-none transition-all duration-300 focus:ring-2"
              style={{
                backgroundColor: `${theme.surface}`,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1)`;
              }}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: theme.textSecondary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter with Animation */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-800">
            {categories.map((category, index) => (
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
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid with Staggered Animation */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: `${theme.primary}10` }}
            >
              <svg className="w-10 h-10" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>No services found</h3>
            <p style={{ color: theme.textSecondary }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.serviceId}
                className="group service-card cursor-pointer"
                onClick={() => handleServiceClick(service.serviceId, service.title)}
                onMouseEnter={() => setHoveredService(service.serviceId)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="relative p-6 rounded-2xl transition-all duration-500 h-full overflow-hidden"
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
                        ? "translateY(-12px)"
                        : "translateY(0)",
                    boxShadow:
                      hoveredService === service.serviceId
                        ? `0 25px 50px -12px ${theme.primary}40`
                        : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Animated background gradient on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${theme.primary}10, transparent)`,
                      opacity: hoveredService === service.serviceId ? 1 : 0,
                    }}
                  />

                  {/* Icon with animation */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 relative overflow-hidden"
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
                    <div className="transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                      {getServiceIcon(service.title, service.iconUrl)}
                    </div>
                    {/* Ripple effect on hover */}
                    {hoveredService === service.serviceId && (
                      <span className="absolute inset-0 animate-ripple rounded-2xl" />
                    )}
                  </div>

                  {/* Category Badge */}
                  {service.categoryName && (
                    <div className="mb-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: `${theme.primary}10`,
                          color: theme.primary,
                        }}
                      >
                        {service.categoryName}
                      </span>
                    </div>
                  )}

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

                  {/* Description with line clamp */}
                  <p
                    className="text-sm leading-relaxed mb-4 line-clamp-3"
                    style={{ color: theme.textSecondary }}
                  >
                    {service.shortDescription}
                  </p>

                  {/* Learn More Link with animation */}
                  <div
                    className="flex items-center gap-2 transition-all duration-500"
                    style={{
                      transform:
                        hoveredService === service.serviceId
                          ? "translateX(0)"
                          : "translateX(-10px)",
                      opacity: hoveredService === service.serviceId ? 1 : 0.7,
                    }}
                  >
                    <span className="text-sm font-semibold" style={{ color: theme.primary }}>
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
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor:
                        hoveredService === service.serviceId
                          ? theme.primary
                          : theme.border,
                      width: hoveredService === service.serviceId ? "80px" : "48px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button with Animation */}
        <div className="text-center mt-12 animate-fade-in-up animation-delay-1000">
          <button
            onClick={() => router.push('/services/all')}
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: `${theme.primary}10`,
              color: theme.primary,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <span>View All Services</span>
            <svg
              className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1"
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
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-20 pt-8 border-t animate-fade-in-up animation-delay-1200" style={{ borderColor: theme.border }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group">
              <div className="text-3xl font-bold mb-1 transition-all duration-300 group-hover:scale-110" style={{ color: theme.primary }}>
                500+
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Projects Delivered
              </div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold mb-1 transition-all duration-300 group-hover:scale-110" style={{ color: theme.primary }}>
                200+
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Happy Clients
              </div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold mb-1 transition-all duration-300 group-hover:scale-110" style={{ color: theme.primary }}>
                50+
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Expert Team
              </div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold mb-1 transition-all duration-300 group-hover:scale-110" style={{ color: theme.primary }}>
                24/7
              </div>
              <div className="text-sm" style={{ color: theme.textSecondary }}>
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
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

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
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

        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        .service-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
            className="h-12 w-64 mx-auto rounded-lg mb-4 animate-pulse"
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
                className="w-20 h-20 rounded-2xl mb-5"
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
                <div
                  className="h-4 w-10/12 rounded"
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
        <h3
          className="text-2xl font-semibold mb-2"
          style={{ color: theme.text }}
        >
          Unable to Load Services
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

export default OurService;