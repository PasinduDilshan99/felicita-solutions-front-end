// benefits-types.ts
import { ApiResponse } from "@/types/common-types";

export interface Benefit {
  id: number;
  title: string;
  description: string;
  iconUrl: string;
  imageUrl: string | null;
  highlightText: string | null;
  displayOrder: number;
  status: string;
  createdAt: string;
  createdBy: number | null;
  updatedAt: string;
  updatedBy: number | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
}

export type BenefitApiResponse = ApiResponse<Benefit[]>;