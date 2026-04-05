import { ApiResponse } from "@/types/common-types";

export interface ContactUsRequest {
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
}

export interface ContactUsResponse {
  message: string;
  id: number;
}

export type ContactUsApiResponse = ApiResponse<ContactUsResponse>;
