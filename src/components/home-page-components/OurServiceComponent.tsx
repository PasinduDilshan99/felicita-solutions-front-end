// components/OurServiceComponent.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { ServiceService } from "@/services/serviceService";
import { BasicService } from "@/services/service-types";

const OurServiceComponent = () => {
  const { theme } = useTheme();
  const [services, setServices] = useState<BasicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [headerAnimation, setHeaderAnimation] = useState({
    badge: false,
    title: false,
    subtitle: false,
  });
  const [cardAnimations, setCardAnimations] = useState<{ [key: number]: boolean }>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch services only when section becomes visible
  useEffect(() => {
    if (!sectionVisible || hasLoaded) return;

    const fetchServices = async () => {
      try {
        const { data, error } = await ServiceService.fetchBasicServicesData();
        if (error) {
          setError(error);
        } else {
          setServices(data.filter(service => service.status === "ACTIVE" || service.status === "VISIBLE"));
          setHasLoaded(true);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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
        rootMargin: "0px 0px -100px 0px"
      }
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

  // Trigger animations when services are loaded
  useEffect(() => {
    if (!loading && services.length > 0 && sectionVisible) {
      // Trigger header animations sequentially
      setTimeout(() => {
        setHeaderAnimation(prev => ({ ...prev, badge: true }));
      }, 100);
      
      setTimeout(() => {
        setHeaderAnimation(prev => ({ ...prev, title: true }));
      }, 300);
      
      setTimeout(() => {
        setHeaderAnimation(prev => ({ ...prev, subtitle: true }));
      }, 500);
      
      // Trigger card animations
      services.forEach((_, index) => {
        setTimeout(() => {
          setCardAnimations(prev => ({ ...prev, [index]: true }));
        }, 700 + index * 100);
      });
    }
  }, [loading, services, sectionVisible]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerView(1);
      } else if (width < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAutoPlaying && services.length > 0 && sectionVisible) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, services.length, currentIndex, sectionVisible]);

  const nextSlide = () => {
    if (services.length > 0) {
      setCurrentIndex((prevIndex) => 
        prevIndex + cardsPerView >= services.length ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (services.length > 0) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? Math.max(0, services.length - cardsPerView) : prevIndex - 1
      );
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const visibleServices = services.slice(currentIndex, currentIndex + cardsPerView);

  // Don't render content until section is visible
  if (!sectionVisible) {
    return (
      <section 
        ref={sectionRef}
        className="w-full py-20 px-4 relative min-h-[600px]"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center h-full min-h-[500px]">
          <div className="text-center">
            <div className="inline-block">
              <div 
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${theme.primary} transparent ${theme.primary} transparent` }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section ref={sectionRef} className="w-full py-20 px-4 overflow-hidden">
        <ServicesSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section ref={sectionRef} className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-bounce-slow"
            style={{ backgroundColor: `${theme.error}10` }}
          >
            <svg className="w-8 h-8" fill="none" stroke={theme.error} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg" style={{ color: theme.error }}>{error}</p>
        </div>
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        `}</style>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section ref={sectionRef} className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg" style={{ color: theme.textSecondary }}>No services available</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="w-full py-20 px-4 overflow-hidden relative"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme.primary}05 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Animations */}
        <div className="text-center mb-12">
          <span 
            className={`text-sm font-semibold uppercase tracking-wider mb-2 inline-block transform transition-all duration-700 ${
              headerAnimation.badge
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
            style={{ color: theme.primary }}
          >
            Our Services
          </span>
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 transform transition-all duration-700 delay-200 ${
              headerAnimation.title
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
            style={{ color: theme.text }}
          >
            What We Offer
          </h2>
          <p 
            className={`text-base md:text-lg max-w-2xl mx-auto transform transition-all duration-700 delay-400 ${
              headerAnimation.subtitle
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
            style={{ color: theme.textSecondary }}
          >
            Discover our comprehensive range of professional services designed to help your business grow
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {services.length > cardsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center justify-center group"
                style={{
                  backgroundColor: theme.surface,
                  color: theme.primary,
                  border: `1px solid ${theme.border}`,
                }}
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center justify-center group"
                style={{
                  backgroundColor: theme.surface,
                  color: theme.primary,
                  border: `1px solid ${theme.border}`,
                }}
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Items */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div 
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` }}
            >
              {services.map((service, idx) => (
                <div
                  key={service.serviceId}
                  className="flex-shrink-0 group"
                  style={{ width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 24 / cardsPerView}px)` }}
                >
                  <div 
                    className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 h-full transform ${
                      cardAnimations[idx]
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                    }`}
                    style={{ 
                      backgroundColor: theme.surface, 
                      border: `1px solid ${theme.border}`,
                      transitionDelay: `${700 + idx * 100}ms`,
                      transitionProperty: "all",
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {/* Service Image */}
                    <div className="relative h-64 overflow-hidden">
                      {service.imageUrl ? (
                        <>
                          <Image
                            src={service.imageUrl}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* Overlay gradient on hover */}
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                              background: `linear-gradient(135deg, ${theme.primary}30 0%, transparent 100%)`,
                            }}
                          />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                          style={{ backgroundColor: `${theme.primary}10` }}
                        >
                          <svg className="w-16 h-16 animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.primary }}>
                            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z"/>
                          </svg>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      {service.categoryName && (
                        <div className="absolute top-4 right-4 transform transition-all duration-500 group-hover:scale-105">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
                            style={{
                              backgroundColor: `${theme.primary}CC`,
                              color: "#ffffff",
                            }}
                          >
                            {service.categoryName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Service Content */}
                    <div className="p-6">
                      {/* Icon */}
                      {service.iconUrl && (
                        <div className="mb-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                            style={{ backgroundColor: `${theme.primary}15` }}
                          >
                            <Image
                              src={service.iconUrl}
                              alt={service.title}
                              width={28}
                              height={28}
                              className="w-7 h-7 object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {/* Title with underline effect */}
                      <h3 
                        className="text-xl font-bold mb-3 transition-all duration-300 relative inline-block"
                        style={{ color: theme.text }}
                      >
                        {service.title}
                        <span 
                          className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                      </h3>

                      {/* Description */}
                      <p 
                        className="text-sm mb-4 line-clamp-3 transition-all duration-300 group-hover:translate-x-1"
                        style={{ color: theme.textSecondary }}
                      >
                        {service.shortDescription}
                      </p>

                      {/* Learn More Link */}
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 group/link"
                        style={{ color: theme.primary }}
                      >
                        Learn More
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {/* Shimmer effect border on hover */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${theme.primary}20, transparent)`,
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          {services.length > cardsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(services.length / cardsPerView) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx * cardsPerView)}
                  className="transition-all duration-300 rounded-full hover:scale-110"
                  style={{
                    width: currentIndex === idx * cardsPerView ? "32px" : "8px",
                    height: "8px",
                    backgroundColor: currentIndex === idx * cardsPerView ? theme.primary : `${theme.primary}40`,
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader Component
const ServicesSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div 
          className="h-6 w-32 mx-auto rounded mb-4 animate-shimmer"
          style={{ backgroundColor: `${theme.primary}20` }}
        />
        <div 
          className="h-10 w-64 mx-auto rounded mb-4 animate-shimmer"
          style={{ backgroundColor: `${theme.text}20` }}
        />
        <div 
          className="h-4 w-96 mx-auto rounded animate-shimmer"
          style={{ backgroundColor: `${theme.textSecondary}20` }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl overflow-hidden">
            <div 
              className="h-64 animate-shimmer"
              style={{ backgroundColor: `${theme.primary}10` }}
            />
            <div className="p-6 space-y-4">
              <div 
                className="h-12 w-12 rounded-lg animate-shimmer"
                style={{ backgroundColor: `${theme.primary}15` }}
              />
              <div 
                className="h-6 w-3/4 rounded animate-shimmer"
                style={{ backgroundColor: `${theme.text}20` }}
              />
              <div className="space-y-2">
                <div 
                  className="h-4 w-full rounded animate-shimmer"
                  style={{ backgroundColor: `${theme.textSecondary}20` }}
                />
                <div 
                  className="h-4 w-11/12 rounded animate-shimmer"
                  style={{ backgroundColor: `${theme.textSecondary}20` }}
                />
                <div 
                  className="h-4 w-10/12 rounded animate-shimmer"
                  style={{ backgroundColor: `${theme.textSecondary}20` }}
                />
              </div>
              <div 
                className="h-4 w-24 rounded animate-shimmer"
                style={{ backgroundColor: `${theme.primary}20` }}
              />
            </div>
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
            rgba(55, 65, 81, 0.2) 0%,
            rgba(75, 85, 99, 0.4) 50%,
            rgba(55, 65, 81, 0.2) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default OurServiceComponent;