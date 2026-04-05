import PasswordResetPage from "@/pages/PasswordResetPage";
import { PASSWORD_RESET_PAGE_TITLE } from "@/utils/headerTitle";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PASSWORD_RESET_PAGE_TITLE,
};

const page = () => {
  return (
    <div>
      <PasswordResetPage />
    </div>
  );
};

export default page;
