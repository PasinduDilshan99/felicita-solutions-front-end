import PasswordChangePage from "@/pages/PasswordChangePage";
import { PASSWORD_CHANGE_PAGE_TITLE } from "@/utils/headerTitle";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PASSWORD_CHANGE_PAGE_TITLE,
};

const page = () => {
  return (
    <div>
      <PasswordChangePage />
    </div>
  );
};

export default page;
