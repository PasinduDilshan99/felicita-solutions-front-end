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
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await ServiceService.fetchBasicServicesData();
        if (error) {
          setError(error);
        } else {
          setServices(data.filter(service => service.status === "ACTIVE" || service.status === "VISIBLE"));
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
    if (isAutoPlaying && services.length > 0) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, services.length, currentIndex]);

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

  if (loading) {
    return (
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg" style={{ color: theme.error }}>{error}</p>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg" style={{ color: theme.textSecondary }}>No services available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span 
            className="text-sm font-semibold uppercase tracking-wider mb-2 inline-block"
            style={{ color: theme.primary }}
          >
            Our Services
          </span>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            What We Offer
          </h2>
          <p 
            className="text-base md:text-lg max-w-2xl mx-auto"
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
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
                style={{
                  backgroundColor: theme.surface,
                  color: theme.primary,
                  border: `1px solid ${theme.border}`,
                }}
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
                style={{
                  backgroundColor: theme.surface,
                  color: theme.primary,
                  border: `1px solid ${theme.border}`,
                }}
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` }}
            >
              {services.map((service, idx) => (
                <div
                  key={service.serviceId}
                  className="flex-shrink-0 group"
                  style={{ width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 24 / cardsPerView}px)` }}
                >
                  <div 
                    className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full"
                    style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
                  >
                    {/* Service Image */}
                    <div className="relative h-64 overflow-hidden">
                      {service.imageUrl ? (
                        <Image
                          src={service.imageUrl}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${theme.primary}10` }}
                        >
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.primary }}>
                            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z"/>
                          </svg>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      {service.categoryName && (
                        <div className="absolute top-4 right-4">
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
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
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

                      {/* Title */}
                      <h3 
                        className="text-xl font-bold mb-3 transition-colors duration-300 group-hover"
                        style={{ color: theme.text }}
                      >
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p 
                        className="text-sm mb-4 line-clamp-3"
                        style={{ color: theme.textSecondary }}
                      >
                        {service.shortDescription}
                      </p>

                      {/* Learn More Link */}
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                        style={{ color: theme.primary }}
                      >
                        Learn More
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
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
                  className="transition-all duration-300 rounded-full"
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
    </section>
  );
};

export default OurServiceComponent;