// hero-types.ts

export interface HeroSection {
  heroSectionId: number;
  imageName: string;
  imageUrl: string;
  personImageUrl: string;
  title: string;
  subTitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  status: string;
  order: number;
  imageCreatedAt: string;
  imageCreatedBy: number | null;
  imageUpdatedAt: string;
  imageUpdatedBy: number | null;
  imageTerminatedAt: string | null;
  imageTerminatedBy: number | null;
}

export interface HeroApiResponse {
  code: number;
  status: string;
  message: string;
  data: HeroSection[];
  timestamp: string;
}