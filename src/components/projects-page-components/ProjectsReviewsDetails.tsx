// components/projects-page/ProjectsReviewsDetails.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ProjectService } from "@/services/projectService";
import { ProjectReview } from "@/types/project-types";
import Image from "next/image";

const ProjectsReviewsDetails = () => {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<ProjectReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ProjectReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const sectionRef = useRef<HTMLElement>(null);

  // Statistics
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {} as Record<number, number>,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await ProjectService.fetchProjectReviewsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setReviews(data);
          setFilteredReviews(data);
          calculateStatistics(data);
        } else {
          // Fallback data
          const fallbackReviews = [
            {
              reviewId: 1,
              reviewText: "Excellent service! The team delivered beyond our expectations. The platform is robust and user-friendly.",
              rating: 5,
              userId: 1,
              username: "John Smith",
              userImage: "",
              companyName: "Tech Solutions Inc",
              productionUrl: "https://example.com",
            },
            {
              reviewId: 2,
              reviewText: "Great experience working with them. Professional team and timely delivery.",
              rating: 5,
              userId: 2,
              username: "Sarah Johnson",
              userImage: "",
              companyName: "Creative Agency",
              productionUrl: "https://example.com",
            },
            {
              reviewId: 3,
              reviewText: "Very satisfied with the results. The support team is always responsive.",
              rating: 4,
              userId: 3,
              username: "Michael Brown",
              userImage: "",
              companyName: "Brown Enterprises",
              productionUrl: "https://example.com",
            },
            {
              reviewId: 4,
              reviewText: "Good quality work and excellent communication throughout the project.",
              rating: 5,
              userId: 4,
              username: "Emily Davis",
              userImage: "",
              companyName: "Davis Consulting",
              productionUrl: "https://example.com",
            },
            {
              reviewId: 5,
              reviewText: "The team understood our requirements perfectly and delivered a great product.",
              rating: 5,
              userId: 5,
              username: "David Wilson",
              userImage: "",
              companyName: "Wilson Group",
              productionUrl: "https://example.com",
            },
            {
              reviewId: 6,
              reviewText: "Professional and knowledgeable team. Would definitely recommend.",
              rating: 4,
              userId: 6,
              username: "Lisa Anderson",
              userImage: "",
              companyName: "Anderson Tech",
              productionUrl: "https://example.com",
            },
            {
              reviewId: 7,
              reviewText: "Outstanding work! The app has transformed our business operations.",
              rating: 5,
              userId: 7,
              username: "Robert Taylor",
              userImage: "",
              companyName: "Taylor Corp",
              productionUrl: "https://example.com",
            },
            {
              reviewId: 8,
              reviewText: "Very responsive and accommodating to our changing needs.",
              rating: 4,
              userId: 8,
              username: "Jennifer Martinez",
              userImage: "",
              companyName: "Martinez Solutions",
              productionUrl: "https://example.com",
            },
          ];
          setReviews(fallbackReviews);
          setFilteredReviews(fallbackReviews);
          calculateStatistics(fallbackReviews);
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

  // Calculate statistics
  const calculateStatistics = (reviewsData: ProjectReview[]) => {
    const total = reviewsData.length;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const avg = sum / total;
    
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    
    setStatistics({
      averageRating: avg,
      totalReviews: total,
      ratingDistribution: distribution,
    });
  };

  // Filter reviews based on search term and rating
  useEffect(() => {
    let filtered = reviews;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRating) {
      filtered = filtered.filter((review) => review.rating === selectedRating);
    }
    
    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedRating, reviews]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizes = { sm: 3, md: 4, lg: 5 };
    const sizeValue = sizes[size];
    
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-${sizeValue} h-${sizeValue}`}
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

  if (loading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return <ReviewsError />;
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
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse-slow"
          style={{ backgroundColor: `${theme.primary}15` }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slower"
          style={{ backgroundColor: `${theme.secondary}15` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
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
              Client Feedback
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            What Our <span style={{ color: theme.primary }}>Clients Say</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Real feedback from real clients who have trusted us with their projects
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 animate-fade-in-up animation-delay-600">
          {/* Average Rating Card */}
          <div
            className="p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: `${theme.primary}05`,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="text-5xl font-bold mb-2" style={{ color: theme.primary }}>
              {statistics.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(statistics.averageRating), "lg")}
            </div>
            <div className="text-sm" style={{ color: theme.textSecondary }}>
              Based on {statistics.totalReviews} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div
            className="p-6 rounded-2xl lg:col-span-2"
            style={{
              backgroundColor: `${theme.primary}05`,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
              Rating Distribution
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = statistics.ratingDistribution[rating] || 0;
                const percentage = statistics.totalReviews > 0 ? (count / statistics.totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="w-12 text-sm font-medium" style={{ color: theme.textSecondary }}>
                      {rating} ★
                    </div>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.textSecondary}20` }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: "#fbbf24",
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm" style={{ color: theme.textSecondary }}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-800">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, company, or review..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl outline-none transition-all duration-300 focus:ring-2"
              style={{
                backgroundColor: `${theme.surface}`,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
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

          {/* Rating Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedRating(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedRating === null ? "shadow-md" : ""
              }`}
              style={{
                backgroundColor: selectedRating === null ? theme.primary : `${theme.primary}10`,
                color: selectedRating === null ? "#ffffff" : theme.primary,
              }}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                  selectedRating === rating ? "shadow-md" : ""
                }`}
                style={{
                  backgroundColor: selectedRating === rating ? theme.primary : `${theme.primary}10`,
                  color: selectedRating === rating ? "#ffffff" : theme.primary,
                }}
              >
                {rating} ★
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        {currentReviews.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: `${theme.primary}10` }}
            >
              <svg className="w-10 h-10" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>No reviews found</h3>
            <p style={{ color: theme.textSecondary }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {currentReviews.map((review, index) => (
                <div
                  key={review.reviewId}
                  className="group review-card cursor-pointer"
                  onMouseEnter={() => setHoveredReview(review.reviewId)}
                  onMouseLeave={() => setHoveredReview(null)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className="relative p-6 rounded-2xl transition-all duration-500 h-full"
                    style={{
                      backgroundColor:
                        hoveredReview === review.reviewId
                          ? `${theme.primary}05`
                          : theme.background,
                      border: `1px solid ${
                        hoveredReview === review.reviewId
                          ? theme.primary
                          : theme.border
                      }`,
                      transform:
                        hoveredReview === review.reviewId
                          ? "translateY(-8px)"
                          : "translateY(0)",
                      boxShadow:
                        hoveredReview === review.reviewId
                          ? `0 25px 50px -12px ${theme.primary}40`
                          : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Quote Icon */}
                    <div
                      className="absolute top-4 right-4 opacity-10 transition-opacity group-hover:opacity-20"
                      style={{ color: theme.primary }}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">{renderStars(review.rating)}</div>

                    {/* Review Text */}
                    <p
                      className="text-sm leading-relaxed mb-6 line-clamp-4"
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

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base overflow-hidden flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: theme.primary }}
                      >
                        {review.userImage ? (
                          <Image
                            src={review.userImage}
                            alt={review.username}
                            width={48}
                            height={48}
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
                            color:
                              hoveredReview === review.reviewId
                                ? theme.primary
                                : theme.text,
                          }}
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
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12 animate-fade-in-up">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}20`,
                  }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      currentPage === number ? "shadow-md" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === number
                          ? theme.primary
                          : `${theme.primary}10`,
                      color:
                        currentPage === number ? "#ffffff" : theme.primary,
                      border: `1px solid ${
                        currentPage === number
                          ? theme.primary
                          : `${theme.primary}20`
                      }`,
                    }}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}20`,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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

        .review-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const ReviewsSkeleton = () => {
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
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  />
                ))}
              </div>
              <div className="space-y-2 mb-6">
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
              <div
                className="w-full h-px my-4"
                style={{ backgroundColor: `${theme.border}` }}
              />
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: `${theme.primary}20` }}
                />
                <div className="flex-1">
                  <div
                    className="h-4 w-24 rounded mb-1"
                    style={{ backgroundColor: `${theme.text}20` }}
                  />
                  <div
                    className="h-3 w-16 rounded"
                    style={{ backgroundColor: `${theme.textSecondary}20` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Error Component
const ReviewsError = () => {
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
          Unable to Load Reviews
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

export default ProjectsReviewsDetails;