// contact-us-types.ts
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

export interface ContactMethod {
  id: number;
  type: string; // PHONE, EMAIL, WHATSAPP, ADDRESS
  label: string;
  value: string;
  link: string | null;
  iconUrl: string;
  displayOrder: number;
}

export interface SocialMedia {
  id: number;
  platform: string; // FACEBOOK, INSTAGRAM, LINKEDIN, TWITTER
  url: string;
  iconUrl: string;
  displayOrder: number;
}

export type ContactUsApiResponse = ApiResponse<ContactUsResponse>;
export type ContactMethodApiResponse = ApiResponse<ContactMethod[]>;
export type SocialMediaApiResponse = ApiResponse<SocialMedia[]>;