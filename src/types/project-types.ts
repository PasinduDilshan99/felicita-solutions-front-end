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

export interface ProjectBasicDetails {
  projectId: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryName: string;
  mainImageUrl: string | null;
  firstGalleryImageUrl: string | null;
  productionUrl: string;
  stagingUrl: string;
  techStack: string;
  companyName: string;
  companyLogo: string;
  minPlanPrice: number;
  planNames: string;
  averageRating: number;
  totalReviews: number;
  totalTeamMembers: number;
  displayOrder: number;
  createdAt: string;
}

export interface GalleryImage {
  imageUrl: string;
  displayOrder: number;
}

export interface PricingPlan {
  planName: string;
  price: number;
  billingCycle: string;
  features: string;
  displayOrder: number;
}

export interface TeamMember {
  memberName: string;
  role: string;
  photoUrl: string | null;
  displayOrder: number;
}

export interface Milestone {
  title: string;
  description: string;
  milestoneDate: string;
  displayOrder: number;
}

export interface Reaction {
  reviewReactionId: number;
  reactionTypeId: number;
  reactionTypeName: string;
  reactedBy: string;
}

export interface CommentReaction {
  commentReactionId: number;
  reactionTypeId: number;
  reactionTypeName: string;
  reactedBy: string;
}

export interface Reply {
  reviewCommentId: number;
  commenterName: string;
  commentText: string;
  userImage: string;
  commentReactions: CommentReaction[];
  replies: Reply[];
}

export interface Comment {
  reviewCommentId: number;
  commenterName: string;
  commentText: string;
  userImage: string;
  commentReactions: CommentReaction[];
  replies: Reply[];
}

export interface Review {
  reviewId: number;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  reviewText: string;
  userImage: string;
  reactions: Reaction[];
  comments: Comment[];
}

export interface ProjectDetails {
  projectId: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryName: string;
  mainImageUrl: string | null;
  productionUrl: string;
  stagingUrl: string;
  techStack: string;
  startDate: string;
  endDate: string;
  companyName: string;
  companyLogo: string;
  galleryImages: GalleryImage[];
  pricingPlans: PricingPlan[];
  teamMembers: TeamMember[];
  milestones: Milestone[];
  reviews: Review[];
}

export interface ProjectDetailsRequest {
  projectId: number;
}

export type ClientProjectApiResponse = ApiResponse<ClientProject[]>;
export type ProjectReviewApiResponse = ApiResponse<ProjectReview[]>;
export type ProjectBasicDetailsApiResponse = ApiResponse<ProjectBasicDetails[]>;
export type ProjectDetailsApiResponse = ApiResponse<ProjectDetails>;