import ContactForm from "@/components/contact-us-page-components/ContactForm";
import ContactLocation from "@/components/contact-us-page-components/ContactLocation";
import ContactUsHeroSection from "@/components/contact-us-page-components/ContactUsHeroSection";
import ContactUsMethods from "@/components/contact-us-page-components/ContactUsMethods";
import SocialMediaLinks from "@/components/contact-us-page-components/SocialMediaLinks";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <ContactUsHeroSection />
      </div>
      <div>
        <ContactUsMethods />
      </div>
      <div>
        <SocialMediaLinks />
      </div>
      <div>
        <ContactLocation />
      </div>
      <div>
        <ContactForm />
      </div>
    </div>
  );
};

export default page;
