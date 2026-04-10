import GetStarted from "@/components/services-page-components/GetStarted";
import OurService from "@/components/services-page-components/OurService";
import ServicePageHeroSection from "@/components/services-page-components/ServicePageHeroSection";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <ServicePageHeroSection />
      </div>
      <div>
        <OurService />
      </div>
      <div>
        <GetStarted />
      </div>
    </div>
  );
};

export default page;
