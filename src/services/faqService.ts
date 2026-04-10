// faqService.ts
import { FAQ, FAQApiResponse } from "@/types/faq-types";
import {
  GET_FAQ_PRICING_DATA_FE,
  GET_FAQ_ALL_DATA_FE,
} from "@/utils/frontEndConstant";

export class FAQService {
  static async fetchPricingFAQData(): Promise<{
    data: FAQ[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_FAQ_PRICING_DATA_FE);
      const data: FAQApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const sortedData = (data.data || [])
          .sort((a, b) => a.displayOrder - b.displayOrder);
        
        return {
          data: sortedData,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch pricing FAQ data",
        };
      }
    } catch (err) {
      console.error("Error fetching pricing FAQ data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching pricing FAQ data",
      };
    }
  }

  static async fetchAllFAQData(): Promise<{
    data: FAQ[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_FAQ_ALL_DATA_FE);
      const data: FAQApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const sortedData = (data.data || [])
          .sort((a, b) => a.displayOrder - b.displayOrder);
        
        return {
          data: sortedData,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch all FAQ data",
        };
      }
    } catch (err) {
      console.error("Error fetching all FAQ data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching all FAQ data",
      };
    }
  }

  // Optional: Filter FAQs by category
  static async fetchFAQByCategory(categoryName: string): Promise<{
    data: FAQ[];
    error: string | null;
  }> {
    const result = await this.fetchAllFAQData();
    
    if (result.error) {
      return result;
    }
    
    const filteredByCategory = result.data.filter(
      faq => faq.categoryName.toLowerCase() === categoryName.toLowerCase()
    );
    
    return {
      data: filteredByCategory,
      error: null,
    };
  }
}