// project-types.ts
import { ApiResponse } from "@/types/common-types";

export interface ClientProject {
  projectId: number;
  productionUrl: string;
  techStack: string;
  companyName: string;
  companyLogo: string;
}

export interface ProjectReview {
  reviewId: number;
  reviewText: string;
  rating: number;
  userId: number;
  username: string;
  userImage: string;
  companyName: string;
  productionUrl: string;
}

export type ClientProjectApiResponse = ApiResponse<ClientProject[]>;
export type ProjectReviewApiResponse = ApiResponse<ProjectReview[]>;
