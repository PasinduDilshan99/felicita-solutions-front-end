// components/home-page-components/ReviewComponent.tsx
"use client";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await ProjectService.fetchProjectReviewsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setReviews(data);
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
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
    if (!isAutoPlaying || viewMode !== "carousel" || reviews.length <= slidesToShow) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, reviews.length, slidesToShow]);

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

  if (loading) {
    return ;
  }

  if (error || reviews.length === 0) {
    return <ReviewError />;
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
            className="w-4 h-4"
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
      className="group h-full px-2"
      onMouseEnter={() => setHoveredReview(review.reviewId)}
      onMouseLeave={() => setHoveredReview(null)}
    >
      <div
        className="relative p-6 rounded-2xl transition-all duration-500 h-full flex flex-col"
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
              ? `0 20px 40px -12px ${theme.primary}30`
              : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
          transform: hoveredReview === review.reviewId ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Quote Icon */}
        <div
          className="absolute top-4 right-4 opacity-10 transition-opacity group-hover:opacity-20"
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
          className="text-base leading-relaxed mb-6 flex-grow"
          style={{ color: theme.textSecondary }}
        >
          &ldquo;{review.reviewText}&rdquo;
        </p>

        {/* Separator Line */}
        <div
          className="w-full h-px my-4 transition-all duration-300"
          style={{
            backgroundColor:
              hoveredReview === review.reviewId
                ? `${theme.primary}30`
                : `${theme.border}`,
          }}
        />

        {/* Author Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0"
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
              className="font-semibold text-base mb-0.5 truncate"
              style={{ color: theme.text }}
            >
              {review.username}
            </h4>
            <p
              className="text-xs truncate"
              style={{ color: theme.primary }}
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
        className="w-full py-20 px-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative Background Elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.primary }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.secondary }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
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
                TESTIMONIALS FEEDBACK
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: theme.text }}
            >
              What our clients thinks
            </h2>
            <div
              className="w-20 h-1 rounded-full mx-auto"
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
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110"
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110"
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Carousel Slides */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
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
                  className="transition-all duration-300"
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
      </section>
    );
  }

  // Grid Mode
  return (
    <section
      className="w-full py-20 px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
      }}
    >
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
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
              TESTIMONIALS FEEDBACK
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            What our clients thinks
          </h2>
          <div
            className="w-20 h-1 rounded-full mx-auto"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Reviews Grid - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => renderReviewCard(review, index))}
        </div>

        {/* Bottom Navigation Hint */}
        <div className="text-center mt-12">
          <p
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            Trusted by industry leaders worldwide
          </p>
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

// Error Component
const ReviewError = () => {
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
    </section>
  );
};

export default ReviewComponent;