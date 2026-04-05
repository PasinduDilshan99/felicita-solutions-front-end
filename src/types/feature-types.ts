// types/feature-types.ts
export interface FeatureCard {
  id: number;
  title: string;
  description: string;
  iconUrl: string;
  status: string;
  order: number;
}

export interface FeatureApiResponse {
  code: number;
  status: string;
  message: string;
  data: FeatureCard[];
  timestamp: string;
}