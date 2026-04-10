// pricing-types.ts
import { ApiResponse } from "@/types/common-types";

export interface PricingFeature {
  title: string;
  value: string;
  isAvailable: boolean;
}

export interface PricingDetail {
  keyName: string;
  value: string;
}

export interface PricingLimit {
  name: string;
  value: string;
}

export interface PricingDiscount {
  type: string; // "percentage" or "fixed"
  value: number;
  couponCode: string;
  startDate: string;
  endDate: string;
}

export interface PricingBasicDetails {
  id: number;
  name: string;
  description: string | null;
  price: number;
  billingCycle: string;
  isPopular: boolean;
  categoryName: string;
  features: PricingFeature[];
}

export interface PricingDetails extends PricingBasicDetails {
  description: string;
  details: PricingDetail[];
  limits: PricingLimit[];
  discount: PricingDiscount | null;
}

export type PricingBasicDetailsApiResponse = ApiResponse<PricingBasicDetails[]>;
export type PricingDetailsApiResponse = ApiResponse<PricingDetails[]>;