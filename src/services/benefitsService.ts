// benefitsService.ts
import { Benefit, BenefitApiResponse } from "@/types/benefits-types";
import { GET_ACTIVE_BENEFITS_DATA_FE } from "@/utils/frontEndConstant";

export class BenefitsService {
  static async fetchActiveBenefitsData(): Promise<{
    data: Benefit[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_ACTIVE_BENEFITS_DATA_FE);
      const data: BenefitApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeBenefits = (data.data || [])
          .filter((benefit) => benefit.status === "ACTIVE")
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeBenefits,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch benefits data",
        };
      }
    } catch (err) {
      console.error("Error fetching benefits data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching benefits data",
      };
    }
  }
}
