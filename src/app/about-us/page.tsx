import AboutUsOverview from "@/components/about-us-page-components/AboutUsOverview";
import OurStack from "@/components/about-us-page-components/OurStack";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <AboutUsOverview />
      </div>
      <div>
        <OurStack />
      </div>
    </div>
  );
};

export default page;
