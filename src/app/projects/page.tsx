import ProjectHeroSection from "@/components/projects-page-components/ProjectHeroSection";
import ProjectsDetails from "@/components/projects-page-components/ProjectsDetails";
import ProjectsReviewsDetails from "@/components/projects-page-components/ProjectsReviewsDetails";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <ProjectHeroSection />
      </div>
      <div>
        <ProjectsDetails />
      </div>
      <div>
        <ProjectsReviewsDetails />
      </div>
    </div>
  );
};

export default page;
