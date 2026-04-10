// pricingService.ts
import {
  PricingBasicDetails,
  PricingBasicDetailsApiResponse,
  PricingDetails,
  PricingDetailsApiResponse,
} from "@/types/pricing-types";
import {
  GET_PRICING_BASIC_DETAILS_DATA_FE,
  GET_PRICING_DETAILS_DATA_FE,
} from "@/utils/frontEndConstant";

export class PricingService {
  static async fetchPricingBasicDetailsData(): Promise<{
    data: PricingBasicDetails[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PRICING_BASIC_DETAILS_DATA_FE);
      const data: PricingBasicDetailsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch pricing basic details data",
        };
      }
    } catch (err) {
      console.error("Error fetching pricing basic details data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching pricing basic details data",
      };
    }
  }

  static async fetchPricingDetailsData(): Promise<{
    data: PricingDetails[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PRICING_DETAILS_DATA_FE);
      const data: PricingDetailsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch pricing details data",
        };
      }
    } catch (err) {
      console.error("Error fetching pricing details data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching pricing details data",
      };
    }
  }
}