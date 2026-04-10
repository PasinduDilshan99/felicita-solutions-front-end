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

// Common interface for all page hero sections
export interface PageHeroSection {
  id: number;
  name: string;
  imageUrl: string;
  iconUrl: string;
  title: string;
  subtitle: string;
  description: string;
  highlightText: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  displayOrder: number;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageHeroApiResponse {
  code: number;
  status: string;
  message: string;
  data: PageHeroSection[];
  timestamp: string;
}