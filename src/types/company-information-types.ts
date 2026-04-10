// company-information-types.ts
import { ApiResponse } from "@/types/common-types";

export interface CompanyInformation {
  id: number;
  type: string; // MISSION, VISION, VALUE
  title: string;
  description: string;
  iconUrl: string;
  imageUrl: string | null;
  displayOrder: number;
  statusId: number;
}

export type CompanyInformationApiResponse = ApiResponse<CompanyInformation[]>;