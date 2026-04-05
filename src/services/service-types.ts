// service-types.ts
import { ApiResponse } from "@/types/common-types";

export interface BasicService {
  serviceId: number;
  title: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  imageUrl: string;
  status: string;
  categoryName: string;
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  iconUrl: string;
}

export interface Feature {
  featureId: number;
  featureName: string;
  displayOrder: number;
}

export interface Gallery {
  galleryId: number;
  imageUrl: string;
  displayOrder: number;
}

export interface Pricing {
  pricingId: number;
  planName: string;
  price: number;
  billingCycle: string;
  features: string;
  displayOrder: number;
}

export interface Tag {
  tagId: number;
  tagName: string;
}

export interface Process {
  stepTitle: string;
  description: string;
  displayOrder: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceDetails {
  serviceId: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  iconUrl: string;
  imageUrl: string;
  status: string;
  displayOrder: number;
  category: Category;
  features: Feature[];
  gallery: Gallery[];
  pricing: Pricing[];
  tags: Tag[];
  process: Process[];
  faq: FAQ[];
}

export interface ServiceDetailsRequest {
  serviceId: number;
}

export type BasicServiceApiResponse = ApiResponse<BasicService[]>;
export type ServiceDetailsApiResponse = ApiResponse<ServiceDetails>;