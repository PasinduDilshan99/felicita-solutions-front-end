import AboutUsHeroSection from "@/components/about-us-page-components/AboutUsHeroSection";
import AboutUsOverview from "@/components/about-us-page-components/AboutUsOverview";
import MissionVisionAndValues from "@/components/about-us-page-components/MissionVisionAndValues";
import OurBenefits from "@/components/about-us-page-components/OurBenefits";
import OurFeatures from "@/components/about-us-page-components/OurFeatures";
import OurService from "@/components/about-us-page-components/OurService";
import OurStack from "@/components/about-us-page-components/OurStack";
import Reviews from "@/components/about-us-page-components/Reviews";
import WhyChooseUs from "@/components/about-us-page-components/WhyChooseUs";
import StatisticsComponent from "@/components/home-page-components/StatisticsComponent";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <AboutUsHeroSection />
      </div>
      <div>
        <AboutUsOverview />
      </div>
      <div>
        <OurStack />
      </div>
      <div>
        <MissionVisionAndValues />
      </div>
      <div>
        <StatisticsComponent />
      </div>
      <div>
        <OurService />
      </div>
      <div>
        <Reviews />
      </div>
      <div>
        <OurBenefits />
      </div>
      <div>
        <WhyChooseUs />
      </div>
      <div>
        <OurFeatures />
      </div>
    </div>
  );
};

export default page;
