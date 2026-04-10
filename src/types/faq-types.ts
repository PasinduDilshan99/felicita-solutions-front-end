// faq-types.ts
import { ApiResponse } from "@/types/common-types";

export interface FAQ {
  faqId: number;
  question: string;
  answer: string;
  displayOrder: number;
  categoryId: number;
  categoryName: string;
}

export type FAQApiResponse = ApiResponse<FAQ[]>;