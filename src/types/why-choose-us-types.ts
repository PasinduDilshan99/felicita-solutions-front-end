// why-choose-us-types.ts
import { ApiResponse } from "@/types/common-types";

export interface WhyChooseUsTypes {
  id: number;
  title: string;
  description: string;
  iconUrl: string;
  imageUrl: string | null;
  highlightText: string;
  displayOrder: number;
}

export type WhyChooseUsApiResponse = ApiResponse<WhyChooseUsTypes[]>;
