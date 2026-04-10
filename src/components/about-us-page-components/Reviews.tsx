// components/home-page-components/ReviewComponent.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ProjectService } from "@/services/projectService";
import { ProjectReview } from "@/types/project-types";

interface ReviewsProps {
  viewMode?: "grid" | "carousel";
}

const Reviews: React.FC<ReviewsProps> = ({ viewMode = "carousel" }) => {
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
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch reviews when section becomes visible
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
          setReviews([
            {
              reviewId: 1,
              reviewText:
                "We have chosen to work extensively with this agency because of their quality services, including their On-the-Job Training design.",
              rating: 5,
              userId: 1,
              username: "Steve Jobs",
              userImage: "",
              companyName: "Years of Experience",
              productionUrl: "",
            },
            {
              reviewId: 2,
              reviewText:
                "We have chosen to work extensively with this agency because of their quality services, including their On-the-Job Training design.",
              rating: 5,
              userId: 2,
              username: "Melinda Gates",
              userImage: "",
              companyName: "Performance Delivered",
              productionUrl: "",
            },
            {
              reviewId: 3,
              reviewText:
                "We have chosen to work extensively with this agency because of their quality services, including their On-the-Job Training design.",
              rating: 5,
              userId: 3,
              username: "Mark Zuckerberg",
              userImage: "",
              companyName: "Satisfied Clients",
              productionUrl: "",
            },
            {
              reviewId: 4,
              reviewText:
                "We have chosen to work extensively with this agency because of their quality services, including their On-the-Job Training design.",
              rating: 5,
              userId: 4,
              username: "Elon Musk",
              userImage: "",
              companyName: "Committed to Excellence",
              productionUrl: "",
            },
            {
              reviewId: 5,
              reviewText:
                "We have chosen to work extensively with this agency because of their quality services, including their On-the-Job Training design.",
              rating: 5,
              userId: 5,
              username: "Jeff Bezos",
              userImage: "",
              companyName: "Innovation Leader",
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

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !sectionVisible) {
            setSectionVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    const currentSection = sectionRef.current;
    if (currentSection) observer.observe(currentSection);
    return () => {
      if (currentSection) observer.unobserve(currentSection);
    };
  }, [sectionVisible]);

  // Trigger entry animations
  useEffect(() => {
    if (!loading && reviews.length > 0 && sectionVisible) {
      setTimeout(() => setHeaderVisible(true), 100);
      setTimeout(() => setCardsVisible(true), 400);
    }
  }, [loading, reviews, sectionVisible]);

  // Responsive slides
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== "carousel" || reviews.length <= slidesToShow || !sectionVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + slidesToShow >= reviews.length ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, reviews.length, slidesToShow, sectionVisible]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + slidesToShow >= reviews.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - slidesToShow) : prev - 1));
  };

  const goToSlide = (index: number) => setCurrentIndex(index);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // Placeholder loading state
  if (!sectionVisible) {
    return (
      <section
        ref={sectionRef}
        className="w-full py-24 px-4"
        style={{ background: theme.background, minHeight: "500px" }}
      />
    );
  }

  if (loading) {
    return (
      <section ref={sectionRef} className="w-full py-24 px-4" style={{ background: theme.background }}>
        <ReviewSkeleton viewMode={viewMode} />
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return <ReviewError sectionRef={sectionRef} />;
  }

  // ── Review Card ──────────────────────────────────────────────────────────────
  const renderReviewCard = (review: ProjectReview, index: number) => {
    const isHovered = hoveredReview === review.reviewId;

    return (
      <div
        key={review.reviewId}
        className="h-full px-3"
        style={{
          transform: cardsVisible ? "translateY(0)" : "translateY(40px)",
          opacity: cardsVisible ? 1 : 0,
          transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, opacity 0.6s ease ${index * 80}ms`,
        }}
        onMouseEnter={() => {
          setHoveredReview(review.reviewId);
          if (viewMode === "carousel") setIsAutoPlaying(false);
        }}
        onMouseLeave={() => {
          setHoveredReview(null);
          if (viewMode === "carousel") setIsAutoPlaying(true);
        }}
      >
        <div
          style={{
            background: theme.background,
            border: `1px solid ${isHovered ? theme.primary : theme.border}`,
            borderRadius: "16px",
            padding: "28px 24px 24px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
            transform: isHovered ? "translateY(-6px)" : "translateY(0)",
            boxShadow: isHovered
              ? `0 20px 48px -12px ${theme.primary}25`
              : "0 2px 12px rgba(0,0,0,0.06)",
            transition:
              "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.25s ease",
          }}
        >
          {/* Category / Company Title */}
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: theme.primary,
              margin: "0 0 14px 0",
              letterSpacing: "0.01em",
              transform: isHovered ? "translateX(3px)" : "translateX(0)",
              transition: "transform 0.3s ease",
            }}
          >
            {review.companyName}
          </h3>

          {/* Star Ratings */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "14px",
              transform: isHovered ? "translateX(2px)" : "translateX(0)",
              transition: "transform 0.3s ease 0.02s",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                style={{
                  fill: star <= review.rating ? "#FBBF24" : `${theme.textSecondary}25`,
                  transition: `fill 0.2s ease ${star * 40}ms, transform 0.3s ease ${star * 40}ms`,
                  transform: isHovered && star <= review.rating ? "scale(1.15)" : "scale(1)",
                }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {/* Review Text */}
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: theme.textSecondary,
              margin: "0 0 24px 0",
              flex: 1,
              transform: isHovered ? "translateX(2px)" : "translateX(0)",
              transition: "transform 0.3s ease 0.03s",
            }}
          >
            {review.reviewText}
          </p>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: isHovered ? `${theme.primary}30` : theme.border,
              marginBottom: "20px",
              transition: "background 0.3s ease",
            }}
          />

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Avatar */}
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                border: `2px solid ${isHovered ? theme.primary : theme.border}`,
                transition: "border-color 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${theme.primary}15`,
              }}
            >
              {review.userImage ? (
                <img
                  src={review.userImage}
                  alt={review.username}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: theme.primary,
                  }}
                >
                  {getInitials(review.username)}
                </span>
              )}
            </div>

            {/* Name + Role */}
            <div
              style={{
                transform: isHovered ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.3s ease 0.05s",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: theme.text,
                  lineHeight: 1.3,
                }}
              >
                {review.username}
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: theme.textSecondary,
                }}
              >
                Designer
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Section Header ───────────────────────────────────────────────────────────
  const renderHeader = () => (
    <div style={{ textAlign: "center", marginBottom: "52px" }}>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: theme.primary,
          margin: "0 0 14px",
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        Latest News
      </p>
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          color: theme.text,
          margin: "0 0 16px",
          lineHeight: 1.2,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        }}
      >
        Featured clients success stories
      </h2>
      <p
        style={{
          fontSize: "15px",
          color: theme.textSecondary,
          maxWidth: "520px",
          margin: "0 auto",
          lineHeight: 1.7,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}
      >
        We craft beautiful and unique digital experiences. With more than 8 years of knowledge
        and expertise we design and code clean websites and apps!
      </p>
    </div>
  );

  // ── Carousel Nav Button ──────────────────────────────────────────────────────
  const NavButton = ({
    onClick,
    direction,
  }: {
    onClick: () => void;
    direction: "prev" | "next";
  }) => {
    const [hov, setHov] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "absolute",
          top: "50%",
          [direction === "prev" ? "left" : "right"]: "-20px",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: `1.5px solid ${hov ? theme.primary : theme.border}`,
          background: hov ? theme.primary : theme.background,
          color: hov ? "#ffffff" : theme.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: hov ? `0 6px 20px ${theme.primary}35` : "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.25s ease",
        }}
        aria-label={direction === "prev" ? "Previous" : "Next"}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>
    );
  };

  // ── Dots ─────────────────────────────────────────────────────────────────────
  const renderDots = () => {
    const total = Math.ceil(reviews.length / slidesToShow);
    const active = Math.floor(currentIndex / slidesToShow);
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "36px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i * slidesToShow)}
            style={{
              width: active === i ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: active === i ? theme.primary : `${theme.textSecondary}40`,
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.35s ease, background 0.25s ease",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    );
  };

  // ── Carousel Mode ────────────────────────────────────────────────────────────
  if (viewMode === "carousel") {
    return (
      <section
        ref={sectionRef}
        style={{
          width: "100%",
          padding: "80px 24px",
          background: theme.surface || theme.background,
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {renderHeader()}

          <div style={{ position: "relative" }}>
            {reviews.length > slidesToShow && (
              <>
                <NavButton onClick={prevSlide} direction="prev" />
                <NavButton onClick={nextSlide} direction="next" />
              </>
            )}

            {/* Track */}
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                  transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                }}
              >
                {reviews.map((review, idx) => (
                  <div
                    key={review.reviewId}
                    style={{
                      flexShrink: 0,
                      width: `${100 / slidesToShow}%`,
                      boxSizing: "border-box",
                    }}
                  >
                    {renderReviewCard(review, idx)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {reviews.length > slidesToShow && renderDots()}
        </div>
      </section>
    );
  }

  // ── Grid Mode ────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        padding: "80px 24px",
        background: theme.surface || theme.background,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {renderHeader()}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {reviews.map((review, idx) => renderReviewCard(review, idx))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "48px",
            fontSize: "13px",
            color: theme.textSecondary,
            opacity: cardsVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.8s",
          }}
        >
          Trusted by industry leaders worldwide
        </p>
      </div>
    </section>
  );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const ReviewSkeleton = ({ viewMode }: { viewMode: string }) => {
  const { theme } = useTheme();
  const count = viewMode === "carousel" ? 3 : 6;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <div
          style={{
            height: "13px",
            width: "100px",
            borderRadius: "6px",
            background: `${theme.primary}20`,
            margin: "0 auto 16px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "36px",
            width: "340px",
            maxWidth: "80%",
            borderRadius: "8px",
            background: `${theme.text}15`,
            margin: "0 auto 16px",
            animation: "pulse 1.5s ease-in-out infinite 0.1s",
          }}
        />
        <div
          style={{
            height: "14px",
            width: "480px",
            maxWidth: "90%",
            borderRadius: "6px",
            background: `${theme.text}10`,
            margin: "0 auto",
            animation: "pulse 1.5s ease-in-out infinite 0.2s",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${count === 3 ? 3 : 3}, 1fr)`,
          gap: "20px",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              background: theme.background,
              border: `1px solid ${theme.border}`,
              borderRadius: "16px",
              padding: "28px 24px 24px",
              animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`,
            }}
          >
            <div
              style={{
                height: "15px",
                width: "120px",
                borderRadius: "6px",
                background: `${theme.primary}20`,
                marginBottom: "16px",
              }}
            />
            {[1, 0.9, 0.75].map((w, j) => (
              <div
                key={j}
                style={{
                  height: "13px",
                  width: `${w * 100}%`,
                  borderRadius: "4px",
                  background: `${theme.textSecondary}15`,
                  marginBottom: "8px",
                }}
              />
            ))}
            <div
              style={{
                height: "1px",
                background: theme.border,
                margin: "20px 0",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: `${theme.primary}15`,
                }}
              />
              <div>
                <div
                  style={{
                    height: "13px",
                    width: "80px",
                    borderRadius: "4px",
                    background: `${theme.text}15`,
                    marginBottom: "6px",
                  }}
                />
                <div
                  style={{
                    height: "11px",
                    width: "50px",
                    borderRadius: "4px",
                    background: `${theme.text}10`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

// ── Error ─────────────────────────────────────────────────────────────────────
const ReviewError = ({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement>;
}) => {
  const { theme } = useTheme();
  return (
    <section
      ref={sectionRef}
      style={{ width: "100%", padding: "80px 24px", textAlign: "center" }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: `${theme.primary}10`,
          marginBottom: "16px",
        }}
      >
        <svg width="24" height="24" fill="none" stroke={theme.primary} strokeWidth="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
        </svg>
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: 600, color: theme.text, margin: "0 0 8px" }}>
        Unable to load reviews
      </h3>
      <p style={{ fontSize: "14px", color: theme.textSecondary, margin: 0 }}>
        Please try again later.
      </p>
    </section>
  );
};

export default Reviews;