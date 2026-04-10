// components/projects-page/ProjectDetailsPage.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ProjectService } from "@/services/projectService";
import {
  ProjectDetails,
  PricingPlan,
  TeamMember,
  Milestone,
  Review,
  GalleryImage,
} from "@/types/project-types";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

const ProjectDetailsPage = () => {
  const { theme } = useTheme();
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "gallery" | "pricing" | "team" | "milestones" | "reviews"
  >("overview");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!projectId) {
      setError("Project ID not found");
      setLoading(false);
      return;
    }

    const fetchProjectDetails = async () => {
      try {
        const { data, error } = await ProjectService.fetchProjectDetailsById({
          projectId: parseInt("1"),
        });
        if (error) {
          setError(error);
        } else if (data) {
          setProject(data);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
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

  // Get tech stack color
  const getTechColor = (tech: string) => {
    const colors: { [key: string]: string } = {
      React: "#61DAFB",
      "Next.js": "#000000",
      "Node.js": "#339933",
      Angular: "#DD0031",
      "Vue.js": "#42B883",
      Python: "#3776AB",
      Django: "#092E20",
      ".NET": "#512BD4",
      MongoDB: "#47A248",
      PostgreSQL: "#4169E1",
      AWS: "#FF9900",
      Azure: "#0089D6",
    };
    return colors[tech] || theme.primary;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    // Here you would call an API to submit the review
    alert("Review submitted! Thank you for your feedback.");
    setReviewText("");
    setReviewRating(5);
  };

  // Handle comment submission
  const handleSubmitComment = (reviewId: number) => {
    if (!commentText[reviewId]?.trim()) return;
    // Here you would call an API to submit the comment
    alert("Comment submitted!");
    setCommentText((prev) => ({ ...prev, [reviewId]: "" }));
  };

  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  if (error || !project) {
    return <ProjectDetailsError error={error} />;
  }

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: (
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: (
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "pricing",
      label: "Pricing Plans",
      icon: (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "team",
      label: "Team",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "milestones",
      label: "Milestones",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${project.reviews?.length || 0})`,
      icon: (
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
  ];

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
        {/* Breadcrumb */}
        <div className="mb-6 animate-fade-in-up">
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: theme.textSecondary }}
          >
            <Link
              href="/"
              className="hover:underline"
              style={{ color: theme.primary }}
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/projects"
              className="hover:underline"
              style={{ color: theme.primary }}
            >
              Projects
            </Link>
            <span>/</span>
            <span style={{ color: theme.text }}>{project.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="relative rounded-2xl overflow-hidden h-80 md:h-96">
            {project.mainImageUrl ? (
              <Image
                src={project.mainImageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.primary}10` }}
              >
                <svg
                  className="w-20 h-20"
                  style={{ color: theme.primary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2">
                {project.companyLogo ? (
                  <div className="relative w-10 h-10 bg-white rounded-lg p-1">
                    <Image
                      src={project.companyLogo}
                      alt={project.companyName}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: theme.primary, color: "#ffffff" }}
                  >
                    {project.companyName.charAt(0)}
                  </div>
                )}
                <span className="text-white font-medium">
                  {project.companyName}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-white/80 text-sm">
                  {formatDate(project.startDate)} -{" "}
                  {formatDate(project.endDate)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {project.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap gap-2 mb-8 border-b animate-fade-in-up animation-delay-200"
          style={{ borderColor: theme.border }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id ? "border-b-2" : ""
              }`}
              style={{
                color:
                  activeTab === tab.id ? theme.primary : theme.textSecondary,
                borderBottomColor:
                  activeTab === tab.id ? theme.primary : "transparent",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up animation-delay-400">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Short Description */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: `${theme.primary}05`,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {project.shortDescription}
                </p>
              </div>

              {/* Full Description */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme.text }}
                >
                  Project Overview
                </h2>
                <div
                  className="prose prose-lg max-w-none"
                  style={{ color: theme.textSecondary }}
                  dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                />
              </div>

              {/* Tech Stack */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme.text }}
                >
                  Technology Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.split(",").map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: `${getTechColor(tech.trim())}15`,
                        color: getTechColor(tech.trim()),
                        border: `1px solid ${getTechColor(tech.trim())}30`,
                      }}
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {project.productionUrl && (
                  <a
                    href={project.productionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: theme.primary,
                      color: "#ffffff",
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Live Project
                  </a>
                )}
                {project.stagingUrl && (
                  <a
                    href={project.stagingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: `${theme.primary}10`,
                      color: theme.primary,
                      border: `1px solid ${theme.primary}20`,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Staging Site
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" &&
            project.galleryImages &&
            project.galleryImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.galleryImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setSelectedImage(image.imageUrl);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Pricing Plans Tab */}
          {activeTab === "pricing" &&
            project.pricingPlans &&
            project.pricingPlans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.pricingPlans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="relative p-6 rounded-2xl transition-all duration-500 hover:scale-105"
                    style={{
                      backgroundColor: `${theme.primary}05`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {idx === 1 && (
                      <div
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: theme.primary,
                          color: "#ffffff",
                        }}
                      >
                        Most Popular
                      </div>
                    )}
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: theme.text }}
                    >
                      {plan.planName}
                    </h3>
                    <div className="mb-4">
                      <span
                        className="text-3xl font-bold"
                        style={{ color: theme.primary }}
                      >
                        ${plan.price.toLocaleString()}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        /{plan.billingCycle}
                      </span>
                    </div>
                    <div className="space-y-2 mb-6">
                      {plan.features.split(",").map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature.trim()}
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: `${theme.primary}10`,
                        color: theme.primary,
                        border: `1px solid ${theme.primary}20`,
                      }}
                    >
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            )}

          {/* Team Members Tab */}
          {activeTab === "team" &&
            project.teamMembers &&
            project.teamMembers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl text-center transition-all duration-500 hover:scale-105"
                    style={{
                      backgroundColor: `${theme.primary}05`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div
                      className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden"
                      style={{ backgroundColor: `${theme.primary}20` }}
                    >
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.memberName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-2xl font-bold"
                          style={{ color: theme.primary }}
                        >
                          {getInitials(member.memberName)}
                        </div>
                      )}
                    </div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: theme.text }}
                    >
                      {member.memberName}
                    </h3>
                    <p className="text-sm" style={{ color: theme.primary }}>
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            )}

          {/* Milestones Tab */}
          {activeTab === "milestones" &&
            project.milestones &&
            project.milestones.length > 0 && (
              <div className="relative">
                <div
                  className="absolute left-6 top-0 bottom-0 w-0.5"
                  style={{ backgroundColor: `${theme.primary}30` }}
                />
                <div className="space-y-8">
                  {project.milestones.map((milestone, idx) => (
                    <div key={idx} className="relative flex gap-6">
                      <div
                        className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: theme.primary,
                          color: "#ffffff",
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div
                        className="flex-1 p-5 rounded-2xl transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: `${theme.primary}05`,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <div
                          className="text-sm mb-2"
                          style={{ color: theme.primary }}
                        >
                          {formatDate(milestone.milestoneDate)}
                        </div>
                        <h3
                          className="text-lg font-bold mb-2"
                          style={{ color: theme.text }}
                        >
                          {milestone.title}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Write a Review */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: `${theme.primary}05`,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: theme.text }}
                >
                  Write a Review
                </h3>
                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    style={{ color: theme.textSecondary }}
                  >
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <svg
                          className="w-8 h-8 transition-all duration-200 hover:scale-110"
                          fill={star <= reviewRating ? "#fbbf24" : "none"}
                          stroke="#fbbf24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all duration-300 focus:ring-2"
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
                </div>
                <button
                  onClick={handleSubmitReview}
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                  }}
                >
                  Submit Review
                </button>
              </div>

              {/* Reviews List */}
              {project.reviews && project.reviews.length > 0 ? (
                <div className="space-y-6">
                  {project.reviews.map((review) => (
                    <div
                      key={review.reviewId}
                      className="p-6 rounded-2xl transition-all duration-300"
                      style={{
                        backgroundColor: `${theme.primary}03`,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base overflow-hidden flex-shrink-0"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {review.userImage ? (
                            <Image
                              src={review.userImage}
                              alt={review.reviewerName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(review.reviewerName)
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <h4
                              className="font-semibold"
                              style={{ color: theme.text }}
                            >
                              {review.reviewerName}
                            </h4>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating, "sm")}
                              <span
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                {new Date().toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: theme.textSecondary }}
                          >
                            {review.reviewText}
                          </p>
                        </div>
                      </div>

                      {/* Comments Section */}
                      {review.comments && review.comments.length > 0 && (
                        <div className="ml-12 mt-4 space-y-3">
                          {review.comments.map((comment) => (
                            <div
                              key={comment.reviewCommentId}
                              className="p-3 rounded-lg"
                              style={{
                                backgroundColor: `${theme.surface}`,
                                border: `1px solid ${theme.border}`,
                              }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: theme.primary }}
                                >
                                  {getInitials(comment.commenterName)}
                                </div>
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: theme.text }}
                                >
                                  {comment.commenterName}
                                </span>
                              </div>
                              <p
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                              >
                                {comment.commentText}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="ml-12 mt-4 flex gap-2">
                        <input
                          type="text"
                          value={commentText[review.reviewId] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [review.reviewId]: e.target.value,
                            }))
                          }
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2"
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
                        <button
                          onClick={() => handleSubmitComment(review.reviewId)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: `${theme.primary}10`,
                            color: theme.primary,
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p style={{ color: theme.textSecondary }}>
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative aspect-video">
              <Image
                src={selectedImage}
                alt="Gallery image"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

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

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
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
      `}</style>
    </section>
  );
};

// Skeleton Loader
const ProjectDetailsSkeleton = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div
            className="h-4 w-48 rounded animate-pulse"
            style={{ backgroundColor: `${theme.textSecondary}20` }}
          />
        </div>
        <div
          className="h-80 rounded-2xl animate-pulse mb-8"
          style={{ backgroundColor: `${theme.surface}` }}
        />
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 w-24 rounded animate-pulse"
              style={{ backgroundColor: `${theme.surface}` }}
            />
          ))}
        </div>
        <div className="space-y-4">
          <div
            className="h-32 rounded-2xl animate-pulse"
            style={{ backgroundColor: `${theme.surface}` }}
          />
          <div
            className="h-64 rounded-2xl animate-pulse"
            style={{ backgroundColor: `${theme.surface}` }}
          />
        </div>
      </div>
    </section>
  );
};

// Error Component
const ProjectDetailsError = ({ error }: { error: string | null }) => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
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
          {error || "Project Not Found"}
        </h3>
        <p style={{ color: theme.textSecondary }}>
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/projects"
          className="inline-block mt-6 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: theme.primary,
            color: "#ffffff",
          }}
        >
          Back to Projects
        </Link>
      </div>
    </section>
  );
};

export default ProjectDetailsPage;
