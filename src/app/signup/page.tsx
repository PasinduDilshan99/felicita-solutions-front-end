import SignupPage from "@/pages/SignupPage";
import { SIGN_UP_PAGE_TITLE } from "@/utils/headerTitle";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: SIGN_UP_PAGE_TITLE,
};

const page = () => {
  return (
    <div>
      <SignupPage />
    </div>
  );
};

export default page;
