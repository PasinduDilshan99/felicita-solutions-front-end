// components/ProjectClientsSection.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectService } from "@/services/projectService";
import { ClientProject } from "@/types/project-types";
import { useTheme } from "@/context/ThemeContext";

const ProjectClientsSection = () => {
  const { theme } = useTheme();
  const [clients, setClients] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);

  // Background image URL
  const backgroundImageUrl = "https://res.cloudinary.com/dkfonkmwr/image/upload/v1773844362/cld-sample-2.jpg";

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await ProjectService.fetchClientProjectsData();
        if (error) {
          setError(error);
        } else {
          setClients(data);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients data");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientClick = (url: string) => {
    if (url && url !== "#") {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <section className="w-full py-20 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-900 animate-pulse"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-700 rounded mx-auto mb-4"></div>
              <div className="h-12 w-96 bg-gray-700 rounded mx-auto"></div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="w-32 h-12 bg-gray-700 rounded"></div>
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

  return (
    <section 
      className="w-full py-16 md:py-24 px-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight"
            style={{ color: "#ffffff" }}
          >
            Find a evolved and strong connection with
          </h2>
          <h3 
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: theme.primary }}
          >
            software and hardware communication
          </h3>
        </div>

        {/* Clients Logos with Separators */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
          {clients.map((client, index) => (
            <React.Fragment key={client.projectId}>
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredClient(client.projectId)}
                onMouseLeave={() => setHoveredClient(null)}
              >
                <div 
                  className="cursor-pointer transition-all duration-300 hover:scale-110 hover:brightness-110"
                  onClick={() => handleClientClick(client.productionUrl)}
                >
                  {client.companyLogo ? (
                    <div className="relative w-28 h-12 md:w-36 md:h-14">
                      <Image
                        src={client.companyLogo}
                        alt={client.companyName}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span 
                      className="text-base md:text-lg font-semibold whitespace-nowrap"
                      style={{ color: "#ffffff" }}
                    >
                      {client.companyName}
                    </span>
                  )}
                </div>
                
                {/* Tech Stack Tooltip */}
                {client.techStack && hoveredClient === client.projectId && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none animate-fadeIn whitespace-nowrap">
                    <div 
                      className="px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg"
                      style={{
                        backgroundColor: theme.surface,
                        color: theme.primary,
                        border: `1px solid ${theme.primary}`,
                      }}
                    >
                      {client.techStack.split(',').slice(0, 3).join(' • ')}
                      {client.techStack.split(',').length > 3 && ' • +more'}
                    </div>
                    {/* Tooltip arrow */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                      style={{ backgroundColor: theme.surface }}
                    />
                  </div>
                )}
              </div>
              
              {/* Separator - show for all except last item */}
              {index < clients.length - 1 && (
                <span 
                  className="text-2xl md:text-3xl font-light opacity-50 select-none"
                  style={{ color: theme.primary }}
                >
                  |
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Brand Names Row */}
        {/* {clients.length > 0 && (
          <div className="mt-16 pt-8 text-center border-t" style={{ borderColor: `${theme.primary}20` }}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {clients.slice(0, 6).map((client, idx) => (
                <span 
                  key={idx}
                  className="text-base md:text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-110 cursor-pointer inline-block"
                  style={{ color: `${theme.primary}CC` }}
                  onClick={() => handleClientClick(client.productionUrl)}
                >
                  {client.companyName.split(' ')[0].toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )} */}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 5px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ProjectClientsSection;