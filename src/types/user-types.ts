// user-types.ts

import { ApiResponse } from "./common-types";

export interface CeoSpeech {
  id: number;
  fullName: string;
  nickName: string;
  designation: string;
  shortBio: string;
  speech: string;
  description: string;
  profileImageUrl: string;
  signatureImageUrl: string;
  videoUrl: string;
  email: string;
  contactNumber: string;
  whatsappNumber: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string | null;
  displayOrder: number;
  status: string;
  createdAt: string;
  createdBy: number | null;
  updatedAt: string;
  updatedBy: number | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
}

export type CeoSpeechApiResponse = ApiResponse<CeoSpeech>;
