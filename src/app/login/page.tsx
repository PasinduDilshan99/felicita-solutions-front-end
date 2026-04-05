import LoginPage from "@/pages/LoginPage";
import { LOGIN_PAGE_TITLE } from "@/utils/headerTitle";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: LOGIN_PAGE_TITLE,
};

const page = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default page;
