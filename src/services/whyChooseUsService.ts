// whyChooseUsService.ts
import {
  WhyChooseUsTypes,
  WhyChooseUsApiResponse,
} from "@/types/why-choose-us-types";
import { GET_WHY_CHOOSE_US_DATA_FE } from "@/utils/frontEndConstant";

export class WhyChooseUsService {
  static async fetchWhyChooseUsData(): Promise<{
    data: WhyChooseUsTypes[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_WHY_CHOOSE_US_DATA_FE);
      const data: WhyChooseUsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        // Sort by displayOrder
        const sortedData = (data.data || []).sort(
          (a, b) => a.displayOrder - b.displayOrder,
        );

        return {
          data: sortedData,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch why choose us data",
        };
      }
    } catch (err) {
      console.error("Error fetching why choose us data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching why choose us data",
      };
    }
  }
}
