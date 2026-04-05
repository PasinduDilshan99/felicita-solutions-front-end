// components/home-page-components/TeamMembers.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { TeamMembersService } from "@/services/teamMembersService";
import { TeamMember } from "@/types/team-members-types";
import Image from "next/image";

const TeamMembers = () => {
  const { theme } = useTheme();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await TeamMembersService.fetchTeamMembersData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setTeamMembers(data);
        } else {
          setTeamMembers([
            {
              id: 1,
              fullName: "Frank De Vinci",
              designation: "Marketing",
              bio: "Creative strategist with a passion for brand storytelling and audience engagement across digital platforms.",
              email: "frank@example.com",
              phoneNumber: "+1 234 567 8900",
              experienceYears: 10,
              profileImageUrl: null,
              statusId: 1,
              roles: [{ name: "Marketing" }],
              skills: [
                { skillName: "Brand Strategy", proficiencyLevel: "Expert" },
                { skillName: "Content Creation", proficiencyLevel: "Expert" },
                { skillName: "Analytics", proficiencyLevel: "Advanced" },
              ],
              socialLinks: [
                { platform: "Facebook", url: "#", iconUrl: null },
                { platform: "Twitter", url: "#", iconUrl: null },
                { platform: "Instagram", url: "#", iconUrl: null },
              ],
              experiences: [
                { companyName: "Brand Co", role: "Marketing Lead", startDate: "2018", endDate: "Present", description: "Leading brand campaigns" },
              ],
            },
            {
              id: 2,
              fullName: "Donald Cort",
              designation: "Social Media",
              bio: "Social media expert who crafts compelling narratives and builds communities that truly resonate.",
              email: "donald@example.com",
              phoneNumber: "+1 234 567 8901",
              experienceYears: 7,
              profileImageUrl: null,
              statusId: 1,
              roles: [{ name: "Social Media" }],
              skills: [
                { skillName: "Instagram", proficiencyLevel: "Expert" },
                { skillName: "Content Strategy", proficiencyLevel: "Advanced" },
                { skillName: "Community Management", proficiencyLevel: "Expert" },
              ],
              socialLinks: [
                { platform: "LinkedIn", url: "#", iconUrl: null },
                { platform: "Twitter", url: "#", iconUrl: null },
              ],
              experiences: [
                { companyName: "Social Agency", role: "Social Media Manager", startDate: "2019", endDate: "Present", description: "Managing social presence" },
              ],
            },
            {
              id: 3,
              fullName: "Alicia Sandre",
              designation: "Engineer",
              bio: "Full-stack engineer building elegant, performant systems that scale gracefully under pressure.",
              email: "alicia@example.com",
              phoneNumber: "+1 234 567 8902",
              experienceYears: 9,
              profileImageUrl: null,
              statusId: 1,
              roles: [{ name: "Engineering" }],
              skills: [
                { skillName: "React", proficiencyLevel: "Expert" },
                { skillName: "System Design", proficiencyLevel: "Advanced" },
                { skillName: "TypeScript", proficiencyLevel: "Expert" },
              ],
              socialLinks: [
                { platform: "LinkedIn", url: "#", iconUrl: null },
                { platform: "GitHub", url: "#", iconUrl: null },
              ],
              experiences: [
                { companyName: "Tech Solutions", role: "Senior Engineer", startDate: "2017", endDate: "Present", description: "Leading engineering projects" },
              ],
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  // Staggered scroll reveal
  useEffect(() => {
    if (teamMembers.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number((entry.target as HTMLElement).dataset.memberId);
            setTimeout(() => {
              setVisibleCards((prev) => new Set([...prev, id]));
            }, Number((entry.target as HTMLElement).dataset.delay || 0));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("[data-member-id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [teamMembers]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "github":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
    }
  };

  if (loading) return <TeamMembersSkeleton />;
  if (error) return <TeamMembersError />;

  return (
    <section ref={sectionRef} className="team-section w-full py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="team-layout">
          {/* Left: Text block */}
          <div className="team-intro">
            <span className="team-eyebrow" style={{ color: theme.primary }}>
              OUR TEAM
            </span>
            <h2 className="team-heading" style={{ color: theme.text }}>
              The big family
            </h2>
            <p className="team-description" style={{ color: theme.textSecondary }}>
              Lorem ipsum dolor sit amet consectetur adipiscing elitsed do eiusmod tempor incididu.
            </p>
            <button
              className="team-cta-btn"
              style={{ color: theme.primary, borderColor: `${theme.primary}30` }}
            >
              View the team
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right: Staggered member cards */}
          <div className="team-cards-grid">
            {teamMembers.map((member, index) => {
              const isVisible = visibleCards.has(member.id);
              const isFirst = index === 0;
              return (
                <div
                  key={member.id}
                  data-member-id={member.id}
                  data-delay={index * 120}
                  className={`team-card-wrapper ${isFirst ? "card-featured" : "card-secondary"} ${isVisible ? "card-visible" : "card-hidden"}`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="team-card" style={{ backgroundColor: theme.background }}>
                    {/* Avatar area */}
                    <div className="card-avatar-area">
                      {member.profileImageUrl ? (
                        <Image
                          src={member.profileImageUrl}
                          alt={member.fullName}
                          fill
                          className="avatar-img"
                        />
                      ) : (
                        <div
                          className="avatar-initials"
                          style={{
                            backgroundColor: `${theme.primary}15`,
                            color: theme.primary,
                          }}
                        >
                          {getInitials(member.fullName)}
                        </div>
                      )}

                      {/* Hover social overlay */}
                      <div className="social-overlay">
                        <div className="social-overlay-inner">
                          {member.socialLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="overlay-social-btn"
                              style={{
                                transitionDelay: `${idx * 55}ms`,
                              }}
                              onClick={(e) => e.stopPropagation()}
                              title={link.platform}
                            >
                              {link.iconUrl ? (
                                <Image src={link.iconUrl} alt={link.platform} width={16} height={16} />
                              ) : (
                                getSocialIcon(link.platform)
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="card-divider" style={{ backgroundColor: `${theme.primary}30` }} />

                    {/* Name & role */}
                    <div className="card-info">
                      <h3 className="card-name" style={{ color: theme.text }}>
                        {member.fullName.toUpperCase()}
                      </h3>
                      <p className="card-role" style={{ color: theme.primary }}>
                        {member.designation}
                      </p>

    
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="modal-content"
            style={{ backgroundColor: theme.background }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="modal-close"
              style={{ color: theme.textSecondary }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="modal-grid">
              {/* Image */}
              <div className="modal-avatar-area" style={{ backgroundColor: `${theme.primary}08` }}>
                {selectedMember.profileImageUrl ? (
                  <Image src={selectedMember.profileImageUrl} alt={selectedMember.fullName} fill className="object-cover" />
                ) : (
                  <div className="modal-initials" style={{ color: theme.primary }}>
                    {getInitials(selectedMember.fullName)}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="modal-details">
                <h2 style={{ color: theme.text }} className="modal-name">
                  {selectedMember.fullName}
                </h2>
                <p style={{ color: theme.primary }} className="modal-role">
                  {selectedMember.designation}
                </p>
                <p style={{ color: theme.textSecondary }} className="modal-bio">
                  {selectedMember.bio}
                </p>

                {/* Skills */}
                <div className="modal-skills">
                  {selectedMember.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="skill-badge"
                      style={{
                        backgroundColor: `${theme.primary}10`,
                        color: theme.primary,
                        border: `1px solid ${theme.primary}25`,
                      }}
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>

                {/* Social */}
                <div className="modal-socials">
                  {selectedMember.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-social-btn"
                      style={{ backgroundColor: `${theme.primary}10`, color: theme.primary }}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Layout */
        .team-section {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }
        .team-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .team-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Intro / Left column */
        .team-intro {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .team-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .team-heading {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          line-height: 1.15;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .team-description {
          font-size: 14px;
          line-height: 1.7;
          margin: 0;
        }
        .team-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 0;
          border-bottom: 1px solid;
          width: fit-content;
          transition: gap 0.25s ease, opacity 0.2s ease;
          letter-spacing: 0.02em;
        }
        .team-cta-btn:hover {
          gap: 8px;
          opacity: 0.75;
        }

        /* Cards grid: staggered heights */
        .team-cards-grid {
          display: flex;
          align-items: flex-end;
          gap: 28px;
          overflow: visible;
        }
        @media (max-width: 680px) {
          .team-cards-grid {
            flex-wrap: wrap;
          }
        }

        .team-card-wrapper {
          flex: 1;
          cursor: pointer;
        }
        .card-featured {
          /* tallest card, slightly raised */
          margin-bottom: 0px;
        }
        .card-secondary:nth-child(2) {
          margin-bottom: 32px;
        }
        .card-secondary:nth-child(3) {
          margin-bottom: 64px;
        }

        /* Entrance animations */
        .card-hidden {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .card-visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Card itself */
        .team-card {
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          transition: box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .team-card-wrapper:hover .team-card {
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          transform: translateY(-4px);
        }

        /* Avatar */
        .card-avatar-area {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .avatar-img {
          object-fit: cover;
          object-position: top center;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .team-card-wrapper:hover .avatar-img {
          transform: scale(1.04);
        }
        .avatar-initials {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          transition: transform 0.5s ease;
        }
        .team-card-wrapper:hover .avatar-initials {
          transform: scale(1.05);
        }

        /* Divider */
        .card-divider {
          height: 1px;
          margin: 0 16px;
          transition: width 0.3s ease;
        }

        /* Card info */
        .card-info {
          padding: 14px 16px 18px;
          text-align: center;
        }
        .card-name {
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin: 0 0 4px;
        }
        .card-role {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          margin: 0;
        }
        /* Social overlay on image */
        .social-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 18px;
          pointer-events: none;
        }
        .social-overlay-inner {
          display: flex;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .team-card-wrapper:hover .social-overlay-inner {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        .overlay-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: #fff;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          opacity: 0;
          transform: translateY(10px) scale(0.85);
          transition: opacity 0.28s ease,
                      transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.2s ease;
        }
        .team-card-wrapper:hover .overlay-social-btn {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .overlay-social-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateY(-3px) scale(1.12) !important;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          position: relative;
          max-width: 820px;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 10;
          background: rgba(0,0,0,0.08);
          border: none;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }
        .modal-close:hover { background: rgba(0,0,0,0.15); }
        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
        }
        @media (max-width: 600px) {
          .modal-grid { grid-template-columns: 1fr; }
        }
        .modal-avatar-area {
          position: relative;
          min-height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-initials {
          font-size: 80px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }
        .modal-details {
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .modal-name {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .modal-role {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin: 0;
        }
        .modal-bio {
          font-size: 13.5px;
          line-height: 1.7;
          margin: 6px 0 4px;
        }
        .modal-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 4px;
        }
        .skill-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.03em;
        }
        .modal-socials {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
        .modal-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
        }
        .modal-social-btn:hover {
          transform: scale(1.18);
        }
      `}</style>
    </section>
  );
};

// Skeleton
const TeamMembersSkeleton = () => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex gap-16 items-end">
        <div className="flex flex-col gap-4 w-64 shrink-0">
          <div className="h-4 w-20 rounded animate-pulse" style={{ backgroundColor: `${theme.primary}25` }} />
          <div className="h-8 w-44 rounded animate-pulse" style={{ backgroundColor: `${theme.text}20` }} />
          <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: `${theme.textSecondary}15` }} />
          <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: `${theme.textSecondary}15` }} />
        </div>
        <div className="flex gap-7 items-end flex-1">
          {[0, 32, 64].map((mb, i) => (
            <div key={i} className="flex-1 rounded animate-pulse" style={{ marginBottom: mb, backgroundColor: `${theme.primary}10`, aspectRatio: "3/4" }} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Error
const TeamMembersError = () => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${theme.error}10` }}>
          <svg className="w-7 h-7" fill="none" stroke={theme.error} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>Unable to Load Team Members</h3>
        <p className="text-sm" style={{ color: theme.textSecondary }}>Please try again later</p>
      </div>
    </section>
  );
};

export default TeamMembers;