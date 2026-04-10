import PricingAllDetails from "@/components/pricing-page-components/PricingAllDetails";
import PricingBasicDetails from "@/components/pricing-page-components/PricingBasicDetails";
import PricingFaqDetails from "@/components/pricing-page-components/PricingFaqDetails";
import PricingHeroSection from "@/components/pricing-page-components/PricingHeroSection";
import PricingOurFeatures from "@/components/pricing-page-components/PricingOurFeatures";
import PricingPlanComparison from "@/components/pricing-page-components/PricingPlanComparison";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <PricingHeroSection />
      </div>
      <div>
        <PricingBasicDetails />
      </div>
      <div>
        <PricingOurFeatures />
      </div>
      <div>
        <PricingAllDetails />
      </div>
      <div>
        <PricingFaqDetails />
      </div>
      <div>
        <PricingPlanComparison />
      </div>
    </div>
  );
};

export default page;
