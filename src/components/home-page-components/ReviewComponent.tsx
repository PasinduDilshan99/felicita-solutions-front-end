// components/home-page-components/ReviewComponent.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ProjectService } from "@/services/projectService";
import { ProjectReview } from "@/types/project-types";

// Add this interface for the component props
interface ReviewComponentProps {
  viewMode?: "grid" | "carousel";
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ viewMode = "carousel" }) => {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<ProjectReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [headerAnimation, setHeaderAnimation] = useState({
    badge: false,
    title: false,
    divider: false,
  });
  const [reviewAnimations, setReviewAnimations] = useState<{ [key: number]: boolean }>({});
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch reviews only when section becomes visible
  useEffect(() => {
    if (!sectionVisible || hasLoaded) return;

    const fetchReviews = async () => {
      try {
        const { data, error } = await ProjectService.fetchProjectReviewsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setReviews(data);
          setHasLoaded(true);
        } else {
          // Fallback data
          setReviews([
            {
              reviewId: 1,
              reviewText:
                "Have the courage to follow your heart and intuition. They somehow already know what you truly want.",
              rating: 5,
              userId: 1,
              username: "Steve Jobs",
              userImage: "",
              companyName: "Apple",
              productionUrl: "",
            },
            {
              reviewId: 2,
              reviewText:
                "Do not compare yourself with anyone in this world... if you do so, you are really insulting yourself.",
              rating: 5,
              userId: 2,
              username: "Melinda Gates",
              userImage: "",
              companyName: "Microsoft",
              productionUrl: "",
            },
            {
              reviewId: 3,
              reviewText:
                "The question I ask myself like almost every day is if am I doing the most important thing I could be doing.",
              rating: 5,
              userId: 3,
              username: "Mark Zuckerberg",
              userImage: "",
              companyName: "Facebook",
              productionUrl: "",
            },
            {
              reviewId: 4,
              reviewText:
                "Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish.",
              rating: 5,
              userId: 4,
              username: "Elon Musk",
              userImage: "",
              companyName: "Tesla",
              productionUrl: "",
            },
            {
              reviewId: 5,
              reviewText:
                "The only way to do great work is to love what you do. Never settle for less.",
              rating: 5,
              userId: 5,
              username: "Jeff Bezos",
              userImage: "",
              companyName: "Amazon",
              productionUrl: "",
            },
          ]);
          setHasLoaded(true);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
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

  // Trigger animations when reviews are loaded
  useEffect(() => {
    if (!loading && reviews.length > 0 && sectionVisible) {
      // Trigger header animations
      setTimeout(() => {
        setHeaderAnimation(prev => ({ ...prev, badge: true }));
      }, 100);
      
      setTimeout(() => {
        setHeaderAnimation(prev => ({ ...prev, title: true }));
      }, 300);
      
      setTimeout(() => {
        setHeaderAnimation(prev => ({ ...prev, divider: true }));
      }, 500);
      
      // Trigger review card animations with stagger effect
      reviews.forEach((_, index) => {
        setTimeout(() => {
          setReviewAnimations(prev => ({ ...prev, [index]: true }));
        }, 600 + index * 100);
      });
    }
  }, [loading, reviews, sectionVisible]);

  // Handle responsive slides to show
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesToShow(1);
      } else if (width < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotate reviews for carousel mode
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== "carousel" || reviews.length <= slidesToShow || !sectionVisible) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, reviews.length, slidesToShow, sectionVisible]);

  const nextSlide = () => {
    setIsAutoPlaying(true);
    setCurrentIndex((prev) => 
      prev + slidesToShow >= reviews.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setIsAutoPlaying(true);
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, reviews.length - slidesToShow) : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(true);
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    if (viewMode === "carousel") {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (viewMode === "carousel") {
      setIsAutoPlaying(true);
    }
  };

  // Don't render content until section is visible
  if (!sectionVisible) {
    return (
      <section 
        ref={sectionRef}
        className="w-full py-20 px-4 relative min-h-[600px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
        }}
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
        <ReviewSkeleton viewMode={viewMode} />
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return <ReviewError sectionRef={sectionRef} />;
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-4 h-4 transition-all duration-300 hover:scale-110"
            fill={star <= rating ? "#fbbf24" : `${theme.textSecondary}30`}
            stroke={star <= rating ? "#fbbf24" : "none"}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
          </svg>
        ))}
      </div>
    );
  };

  // Render Review Card
  const renderReviewCard = (review: ProjectReview, index: number) => (
    <div
      key={review.reviewId}
      className={`group h-full px-2 transform transition-all duration-700 ${
        reviewAnimations[index]
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
      style={{
        transitionDelay: `${600 + index * 100}ms`,
      }}
      onMouseEnter={() => setHoveredReview(review.reviewId)}
      onMouseLeave={() => setHoveredReview(null)}
    >
      <div
        className="relative p-6 rounded-2xl transition-all duration-500 h-full flex flex-col overflow-hidden"
        style={{
          backgroundColor:
            hoveredReview === review.reviewId
              ? `${theme.primary}05`
              : theme.background,
          border: `2px solid ${
            hoveredReview === review.reviewId ? theme.primary : theme.border
          }`,
          boxShadow:
            hoveredReview === review.reviewId
              ? `0 20px 40px -12px ${theme.primary}40`
              : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
          transform: hoveredReview === review.reviewId ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        {/* Shimmer effect on hover */}
        {hoveredReview === review.reviewId && (
          <div 
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.primary}10, transparent)`,
              animation: "shimmer 2s infinite",
            }}
          />
        )}

        {/* Quote Icon */}
        <div
          className="absolute top-4 right-4 opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110"
          style={{ color: theme.primary }}
        >
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Rating Stars */}
        <div className="mb-4">{renderStars(review.rating)}</div>

        {/* Review Text */}
        <p
          className="text-base leading-relaxed mb-6 flex-grow transition-all duration-300"
          style={{ 
            color: theme.textSecondary,
            transform: hoveredReview === review.reviewId ? "translateX(4px)" : "translateX(0)",
          }}
        >
          &ldquo;{review.reviewText}&rdquo;
        </p>

        {/* Separator Line */}
        <div
          className="w-full h-px my-4 transition-all duration-500"
          style={{
            backgroundColor:
              hoveredReview === review.reviewId
                ? `${theme.primary}40`
                : `${theme.border}`,
            transform: hoveredReview === review.reviewId ? "scaleX(1.1)" : "scaleX(1)",
          }}
        />

        {/* Author Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0 transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: theme.primary }}
          >
            {review.userImage ? (
              <img
                src={review.userImage}
                alt={review.username}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(review.username)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className="font-semibold text-base mb-0.5 truncate transition-all duration-300"
              style={{ 
                color: theme.text,
                transform: hoveredReview === review.reviewId ? "translateX(2px)" : "translateX(0)",
              }}
            >
              {review.username}
            </h4>
            <p
              className="text-xs truncate transition-all duration-300"
              style={{ 
                color: theme.primary,
                transform: hoveredReview === review.reviewId ? "translateX(2px)" : "translateX(0)",
              }}
            >
              {review.companyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Carousel Mode
  if (viewMode === "carousel") {
    const visibleReviews = reviews.slice(currentIndex, currentIndex + slidesToShow);
    // If we don't have enough reviews for the last slide, get remaining from start
    const finalVisibleReviews = visibleReviews.length < slidesToShow 
      ? [...visibleReviews, ...reviews.slice(0, slidesToShow - visibleReviews.length)]
      : visibleReviews;

    return (
      <section
        ref={sectionRef}
        className="w-full py-20 px-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative Background Elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse-slow"
          style={{ backgroundColor: theme.primary }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse-slow"
          style={{ backgroundColor: theme.secondary }}
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span
                className={`text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full transform transition-all duration-700 ${
                  headerAnimation.badge
                    ? "translate-y-0 opacity-100 scale-100"
                    : "-translate-y-full opacity-0 scale-95"
                }`}
                style={{
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}20`,
                }}
              >
                TESTIMONIALS FEEDBACK
              </span>
            </div>
            <h2
              className={`text-4xl md:text-5xl font-bold mb-4 transform transition-all duration-700 delay-200 ${
                headerAnimation.title
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
              style={{ color: theme.text }}
            >
              What our clients thinks
            </h2>
            <div
              className={`w-20 h-1 rounded-full mx-auto transform transition-all duration-700 delay-400 ${
                headerAnimation.divider
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0"
              }`}
              style={{ backgroundColor: theme.primary }}
            />
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            {reviews.length > slidesToShow && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110 group"
                  style={{
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}20`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primary;
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                    e.currentTarget.style.color = theme.primary;
                  }}
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110 group"
                  style={{
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}20`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primary;
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                    e.currentTarget.style.color = theme.primary;
                  }}
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Carousel Slides */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                }}
              >
                {reviews.map((review, idx) => (
                  <div
                    key={review.reviewId}
                    className="flex-shrink-0"
                    style={{ width: `${100 / slidesToShow}%` }}
                  >
                    {renderReviewCard(review, idx)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          {reviews.length > slidesToShow && (
            <div className="flex justify-center gap-3 mt-8">
              {Array.from({ length: Math.ceil(reviews.length / slidesToShow) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx * slidesToShow)}
                  className="transition-all duration-300 hover:scale-110"
                  style={{
                    width: Math.floor(currentIndex / slidesToShow) === idx ? "32px" : "8px",
                    height: "8px",
                    borderRadius: Math.floor(currentIndex / slidesToShow) === idx ? "4px" : "50%",
                    backgroundColor:
                      Math.floor(currentIndex / slidesToShow) === idx
                        ? theme.primary
                        : `${theme.textSecondary}40`,
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.1;
              transform: scale(1);
            }
            50% {
              opacity: 0.2;
              transform: scale(1.1);
            }
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
        `}</style>
      </section>
    );
  }

  // Grid Mode
  return (
    <section
      ref={sectionRef}
      className="w-full py-20 px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
      }}
    >
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse-slow"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse-slow"
        style={{ backgroundColor: theme.secondary }}
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span
              className={`text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full transform transition-all duration-700 ${
                headerAnimation.badge
                  ? "translate-y-0 opacity-100 scale-100"
                  : "-translate-y-full opacity-0 scale-95"
              }`}
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.primary,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              TESTIMONIALS FEEDBACK
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 transform transition-all duration-700 delay-200 ${
              headerAnimation.title
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
            style={{ color: theme.text }}
          >
            What our clients thinks
          </h2>
          <div
            className={`w-20 h-1 rounded-full mx-auto transform transition-all duration-700 delay-400 ${
              headerAnimation.divider
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0"
            }`}
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => renderReviewCard(review, index))}
        </div>

        {/* Bottom Navigation Hint */}
        <div className="text-center mt-12">
          <p
            className="text-sm transition-all duration-300 hover:translate-y-1"
            style={{ color: theme.textSecondary }}
          >
            Trusted by industry leaders worldwide
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader Component
const ReviewSkeleton = ({ viewMode }: { viewMode: string }) => {
  const { theme } = useTheme();
  const skeletonCount = viewMode === "carousel" ? 3 : 6;
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div 
          className="h-8 w-48 mx-auto rounded-lg mb-4 animate-shimmer"
          style={{ backgroundColor: `${theme.primary}20` }}
        />
        <div 
          className="h-12 w-96 mx-auto rounded-lg mb-4 animate-shimmer"
          style={{ backgroundColor: `${theme.text}20` }}
        />
        <div 
          className="w-20 h-1 rounded-full mx-auto animate-shimmer"
          style={{ backgroundColor: `${theme.primary}30` }}
        />
      </div>
      <div className={`grid ${viewMode === "carousel" ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="p-6 rounded-2xl animate-shimmer" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
            <div className="w-24 h-4 rounded mb-4" style={{ backgroundColor: `${theme.textSecondary}20` }} />
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full rounded" style={{ backgroundColor: `${theme.textSecondary}20` }} />
              <div className="h-4 w-11/12 rounded" style={{ backgroundColor: `${theme.textSecondary}20` }} />
              <div className="h-4 w-10/12 rounded" style={{ backgroundColor: `${theme.textSecondary}20` }} />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full" style={{ backgroundColor: `${theme.primary}30` }} />
              <div className="flex-1">
                <div className="h-4 w-24 rounded mb-1" style={{ backgroundColor: `${theme.text}20` }} />
                <div className="h-3 w-16 rounded" style={{ backgroundColor: `${theme.primary}20` }} />
              </div>
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

// Error Component
const ReviewError = ({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) => {
  const { theme } = useTheme();

  return (
    <section ref={sectionRef} className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center animate-fade-in">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-bounce-slow"
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
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01"
            />
          </svg>
        </div>
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: theme.text }}
        >
          Unable to Load Reviews
        </h3>
        <p style={{ color: theme.textSecondary }}>Please try again later</p>
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
};

export default ReviewComponent;