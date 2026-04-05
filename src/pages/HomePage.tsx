import BenefitsComponent from "@/components/home-page-components/BenefitsComponent";
import CeoSpeechComponent from "@/components/home-page-components/CeoSpeechComponent";
import ContactUsComponent from "@/components/home-page-components/ContactUsComponent";
import FeatureCardsSection from "@/components/home-page-components/FeatureCardsSection";
import HomeHeroSectionComponents from "@/components/home-page-components/HomeHeroSectionComponents";
import OurServiceComponent from "@/components/home-page-components/OurServiceComponent";
import ProjectClientsSection from "@/components/home-page-components/ProjectClientsSection";
import ReviewComponent from "@/components/home-page-components/ReviewComponent";
import StatisticsComponent from "@/components/home-page-components/StatisticsComponent";
import TeamMembers from "@/components/home-page-components/TeamMembers";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <div>
        <HomeHeroSectionComponents />
      </div>
      <div>
        <FeatureCardsSection />
      </div>
      <div>
        <CeoSpeechComponent />
      </div>
      <div>
        <OurServiceComponent />
      </div>
      <div>
        <ContactUsComponent />
      </div>
      <div>
        <ProjectClientsSection />
      </div>
      <div>
        <ReviewComponent />
      </div>
      <div>
        <BenefitsComponent />
      </div>
      <div>
        <StatisticsComponent />
      </div>
      <div>
        <TeamMembers />
      </div>
    </div>
  );
};

export default HomePage;
