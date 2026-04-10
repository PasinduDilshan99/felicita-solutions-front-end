// components/projects-page/ProjectsDetails.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ProjectService } from "@/services/projectService";
import { ProjectBasicDetails } from "@/types/project-types";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProjectsDetails = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectBasicDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectBasicDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await ProjectService.fetchProjectsBasicDetailsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setProjects(data);
          setFilteredProjects(data);
          
          // Extract unique categories
          const uniqueCategories = ["all", ...new Set(data.map((p) => p.categoryName).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          // Fallback data
          const fallbackProjects = [
            {
              projectId: 1,
              title: "E-Commerce Platform",
              slug: "e-commerce-platform",
              shortDescription: "A modern e-commerce solution with real-time inventory management and payment integration.",
              fullDescription: "",
              categoryName: "E-Commerce",
              mainImageUrl: "",
              firstGalleryImageUrl: "",
              productionUrl: "https://example.com",
              stagingUrl: "",
              techStack: "React, Node.js, MongoDB, Stripe",
              companyName: "Tech Corp",
              companyLogo: "",
              minPlanPrice: 499,
              planNames: "Basic, Pro, Enterprise",
              averageRating: 4.8,
              totalReviews: 127,
              totalTeamMembers: 8,
              displayOrder: 1,
              createdAt: "",
            },
            {
              projectId: 2,
              title: "Healthcare Management System",
              slug: "healthcare-management",
              shortDescription: "Comprehensive healthcare platform for patient management, appointments, and telemedicine.",
              fullDescription: "",
              categoryName: "Healthcare",
              mainImageUrl: "",
              firstGalleryImageUrl: "",
              productionUrl: "https://example.com",
              stagingUrl: "",
              techStack: "Angular, .NET Core, SQL Server, Azure",
              companyName: "Health Solutions",
              companyLogo: "",
              minPlanPrice: 999,
              planNames: "Standard, Premium",
              averageRating: 4.9,
              totalReviews: 89,
              totalTeamMembers: 12,
              displayOrder: 2,
              createdAt: "",
            },
            {
              projectId: 3,
              title: "FinTech Dashboard",
              slug: "fintech-dashboard",
              shortDescription: "Real-time financial analytics dashboard with advanced reporting and forecasting.",
              fullDescription: "",
              categoryName: "FinTech",
              mainImageUrl: "",
              firstGalleryImageUrl: "",
              productionUrl: "https://example.com",
              stagingUrl: "",
              techStack: "Vue.js, Python, Django, PostgreSQL",
              companyName: "Finance Hub",
              companyLogo: "",
              minPlanPrice: 799,
              planNames: "Basic, Professional, Enterprise",
              averageRating: 4.7,
              totalReviews: 56,
              totalTeamMembers: 6,
              displayOrder: 3,
              createdAt: "",
            },
            {
              projectId: 4,
              title: "Learning Management System",
              slug: "learning-management",
              shortDescription: "Online learning platform with course management, quizzes, and certification.",
              fullDescription: "",
              categoryName: "Education",
              mainImageUrl: "",
              firstGalleryImageUrl: "",
              productionUrl: "https://example.com",
              stagingUrl: "",
              techStack: "Next.js, Express, MongoDB, AWS",
              companyName: "EduTech",
              companyLogo: "",
              minPlanPrice: 349,
              planNames: "Starter, Pro, Enterprise",
              averageRating: 4.6,
              totalReviews: 234,
              totalTeamMembers: 10,
              displayOrder: 4,
              createdAt: "",
            },
          ];
          setProjects(fallbackProjects);
          setFilteredProjects(fallbackProjects);
          const uniqueCategories = ["all", ...new Set(fallbackProjects.map((p) => p.categoryName))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on category and search term
  useEffect(() => {
    let filtered = projects;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((project) => project.categoryName === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.techStack.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProjects(filtered);
  }, [selectedCategory, searchTerm, projects]);

  const handleProjectClick = (projectId: number, projectName: string) => {
    router.push(`/projects/${projectId}?name=${encodeURIComponent(projectName)}`);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4"
            fill={i < fullStars ? "#fbbf24" : (i === fullStars && hasHalfStar ? "url(#half-star)" : "none")}
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
        ))}
      </div>
    );
  };

  // Get tech stack colors
  const getTechColor = (tech: string) => {
    const colors: { [key: string]: string } = {
      "React": "#61DAFB",
      "Next.js": "#000000",
      "Node.js": "#339933",
      "Angular": "#DD0031",
      "Vue.js": "#42B883",
      "Python": "#3776AB",
      "Django": "#092E20",
      ".NET": "#512BD4",
      "MongoDB": "#47A248",
      "PostgreSQL": "#4169E1",
      "AWS": "#FF9900",
      "Azure": "#0089D6",
    };
    return colors[tech] || theme.primary;
  };

  if (loading) {
    return <ProjectsSkeleton />;
  }

  if (error) {
    return <ProjectsError />;
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
              Our Portfolio
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            Featured <span style={{ color: theme.primary }}>Projects</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Explore our successful projects and see how we've helped businesses transform their digital presence
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-600">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search projects by title, company, or technology..."
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

          {/* View Mode Toggle */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: `${theme.surface}`, border: `1px solid ${theme.border}` }}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? "shadow-md" : ""}`}
              style={{
                backgroundColor: viewMode === "grid" ? theme.primary : "transparent",
                color: viewMode === "grid" ? "#ffffff" : theme.textSecondary,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? "shadow-md" : ""}`}
              style={{
                backgroundColor: viewMode === "list" ? theme.primary : "transparent",
                color: viewMode === "list" ? "#ffffff" : theme.textSecondary,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter */}
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

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: `${theme.primary}10` }}
            >
              <svg className="w-10 h-10" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>No projects found</h3>
            <p style={{ color: theme.textSecondary }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.projectId}
                className="group project-card cursor-pointer"
                onClick={() => handleProjectClick(project.projectId, project.title)}
                onMouseEnter={() => setHoveredProject(project.projectId)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="relative rounded-2xl transition-all duration-500 overflow-hidden h-full"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${
                      hoveredProject === project.projectId
                        ? theme.primary
                        : theme.border
                    }`,
                    transform:
                      hoveredProject === project.projectId
                        ? "translateY(-8px)"
                        : "translateY(0)",
                    boxShadow:
                      hoveredProject === project.projectId
                        ? `0 25px 50px -12px ${theme.primary}40`
                        : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {project.mainImageUrl ? (
                      <Image
                        src={project.mainImageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full backdrop-blur-md"
                        style={{
                          backgroundColor: `${theme.primary}CC`,
                          color: "#ffffff",
                        }}
                      >
                        {project.categoryName}
                      </span>
                    </div>
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-md bg-black/50">
                      {renderStars(project.averageRating)}
                      <span className="text-xs text-white ml-1">({project.totalReviews})</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Company Info */}
                    <div className="flex items-center gap-2 mb-3">
                      {project.companyLogo ? (
                        <div className="relative w-6 h-6">
                          <Image src={project.companyLogo} alt={project.companyName} fill className="object-contain" />
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
                        >
                          {project.companyName.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium" style={{ color: theme.primary }}>
                        {project.companyName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-bold mb-2 transition-all duration-300 line-clamp-1"
                      style={{
                        color:
                          hoveredProject === project.projectId
                            ? theme.primary
                            : theme.text,
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: theme.textSecondary }}>
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.techStack.split(',').slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${getTechColor(tech.trim())}15`,
                            color: getTechColor(tech.trim()),
                          }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                      {project.techStack.split(',').length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.textSecondary}15`, color: theme.textSecondary }}>
                          +{project.techStack.split(',').length - 3}
                        </span>
                      )}
                    </div>

                    {/* Price and Team Info */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.border }}>
                      <div>
                        <span className="text-xs" style={{ color: theme.textSecondary }}>Starting from</span>
                        <p className="text-lg font-bold" style={{ color: theme.primary }}>
                          ${project.minPlanPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs" style={{ color: theme.textSecondary }}>Team Size</span>
                        <p className="text-sm font-semibold" style={{ color: theme.text }}>
                          {project.totalTeamMembers} members
                        </p>
                      </div>
                    </div>

                    {/* Learn More Link */}
                    <div
                      className="flex items-center gap-2 mt-3 transition-all duration-500"
                      style={{
                        transform:
                          hoveredProject === project.projectId
                            ? "translateX(0)"
                            : "translateX(-5px)",
                        opacity: hoveredProject === project.projectId ? 1 : 0.7,
                      }}
                    >
                      <span className="text-sm font-semibold" style={{ color: theme.primary }}>
                        View Project
                      </span>
                      <svg
                        className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1"
                        style={{ color: theme.primary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <div
                key={project.projectId}
                className="group cursor-pointer"
                onClick={() => handleProjectClick(project.projectId, project.title)}
                onMouseEnter={() => setHoveredProject(project.projectId)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="rounded-2xl transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${
                      hoveredProject === project.projectId
                        ? theme.primary
                        : theme.border
                    }`,
                    transform:
                      hoveredProject === project.projectId
                        ? "translateX(8px)"
                        : "translateX(0)",
                  }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-64 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {project.mainImageUrl ? (
                        <Image
                          src={project.mainImageUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${theme.primary}10`,
                                color: theme.primary,
                              }}
                            >
                              {project.categoryName}
                            </span>
                            <span className="text-xs" style={{ color: theme.textSecondary }}>
                              {project.companyName}
                            </span>
                          </div>
                          <h3
                            className="text-xl font-bold transition-all duration-300"
                            style={{
                              color:
                                hoveredProject === project.projectId
                                  ? theme.primary
                                  : theme.text,
                            }}
                          >
                            {project.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(project.averageRating)}
                          <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                            ({project.totalReviews})
                          </span>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: theme.textSecondary }}>
                        {project.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.techStack.split(',').slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${getTechColor(tech.trim())}15`,
                              color: getTechColor(tech.trim()),
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs" style={{ color: theme.textSecondary }}>Starting at</span>
                          <p className="text-lg font-bold" style={{ color: theme.primary }}>
                            ${project.minPlanPrice.toLocaleString()}
                          </p>
                        </div>
                        <div
                          className="flex items-center gap-2 transition-all duration-500"
                          style={{
                            transform:
                              hoveredProject === project.projectId
                                ? "translateX(0)"
                                : "translateX(-5px)",
                          }}
                        >
                          <span className="text-sm font-semibold" style={{ color: theme.primary }}>
                            View Details
                          </span>
                          <svg
                            className="w-4 h-4"
                            style={{ color: theme.primary }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

        .project-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const ProjectsSkeleton = () => {
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
              className="rounded-2xl animate-pulse overflow-hidden"
              style={{ backgroundColor: theme.surface }}
            >
              <div
                className="h-48"
                style={{ backgroundColor: `${theme.textSecondary}10` }}
              />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  />
                  <div
                    className="h-3 w-20 rounded"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  />
                </div>
                <div
                  className="h-5 w-3/4 rounded"
                  style={{ backgroundColor: `${theme.text}20` }}
                />
                <div className="space-y-2">
                  <div
                    className="h-3 w-full rounded"
                    style={{ backgroundColor: `${theme.textSecondary}20` }}
                  />
                  <div
                    className="h-3 w-11/12 rounded"
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
const ProjectsError = () => {
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
          Unable to Load Projects
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

export default ProjectsDetails;