// companyInformationService.ts
import {
  CompanyInformation,
  CompanyInformationApiResponse,
} from "@/types/company-information-types";
import { GET_COMPANY_MISSION_VISION_AND_VALUES_DATA_FE } from "@/utils/frontEndConstant";

export class CompanyInformationService {
  static async fetchCompanyInformationData(): Promise<{
    data: CompanyInformation[];
    error: string | null;
  }> {
    try {
      const response = await fetch(
        GET_COMPANY_MISSION_VISION_AND_VALUES_DATA_FE,
      );
      const data: CompanyInformationApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeInformation = (data.data || [])
          .filter((info) => info.statusId === 1)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeInformation,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch company information data",
        };
      }
    } catch (err) {
      console.error("Error fetching company information data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching company information data",
      };
    }
  }

  static async fetchCompanyInformationByType(type: string): Promise<{
    data: CompanyInformation[];
    error: string | null;
  }> {
    const result = await this.fetchCompanyInformationData();

    if (result.error) {
      return result;
    }

    const filteredByType = result.data.filter((info) => info.type === type);

    return {
      data: filteredByType,
      error: null,
    };
  }
}
