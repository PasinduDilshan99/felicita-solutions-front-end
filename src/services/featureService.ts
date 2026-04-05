// services/featureService.ts
import { FeatureApiResponse, FeatureCard } from "@/types/feature-types";
import { GET_FEATURE_DETAILS_HOME_PAGE_DATA_FE } from "@/utils/frontEndConstant";

export class FeatureService {
  static async fetchAllFeatures(): Promise<{
    data: FeatureCard[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_FEATURE_DETAILS_HOME_PAGE_DATA_FE);
      const data: FeatureApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeFeatures = (data.data || [])
          .filter((feature) => feature.status === "ACTIVE")
          .sort((a, b) => a.order - b.order);

        return {
          data: activeFeatures,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch features data",
        };
      }
    } catch (err) {
      console.error("Error fetching features:", err);
      return {
        data: [],
        error: "Something went wrong while fetching features data",
      };
    }
  }
}
