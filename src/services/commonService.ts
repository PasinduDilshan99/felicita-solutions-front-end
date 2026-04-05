// commonService.ts
import { Statistics, StatisticsApiResponse } from "@/types/common-types";
import { GET_STATISTICS_DATA_FE } from "@/utils/frontEndConstant";

export class CommonService {
  static async fetchStatisticsData(): Promise<{
    data: Statistics | null;
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_STATISTICS_DATA_FE);
      const data: StatisticsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data,
          error: null,
        };
      } else {
        return {
          data: null,
          error: data.message || "Failed to fetch statistics data",
        };
      }
    } catch (err) {
      console.error("Error fetching statistics data:", err);
      return {
        data: null,
        error: "Something went wrong while fetching statistics data",
      };
    }
  }
}
