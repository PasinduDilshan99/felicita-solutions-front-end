// team-members-types.ts
import { ApiResponse } from "@/types/common-types";

export interface Role {
  name: string;
}

export interface Skill {
  skillName: string;
  proficiencyLevel: string | null;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconUrl: string | null;
}

export interface Experience {
  companyName: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface TeamMember {
  id: number;
  fullName: string;
  designation: string;
  bio: string;
  email: string;
  phoneNumber: string;
  experienceYears: number;
  profileImageUrl: string | null;
  statusId: number;
  roles: Role[];
  skills: Skill[];
  socialLinks: SocialLink[];
  experiences: Experience[];
}

export type TeamMemberApiResponse = ApiResponse<TeamMember[]>;