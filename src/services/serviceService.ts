// serviceService.ts
import {
  GET_SERVICE_DETAILS_BY_ID_DATA_FE,
  GET_SERVICES_BASIC_DETAILS_DATA_FE,
} from "@/utils/frontEndConstant";
import {
  BasicService,
  BasicServiceApiResponse,
  ServiceDetails,
  ServiceDetailsApiResponse,
  ServiceDetailsRequest,
} from "./service-types";

export class ServiceService {
  static async fetchBasicServicesData(): Promise<{
    data: BasicService[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_SERVICES_BASIC_DETAILS_DATA_FE);
      const data: BasicServiceApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch basic services data",
        };
      }
    } catch (err) {
      console.error("Error fetching basic services data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching basic services data",
      };
    }
  }

  static async fetchServiceDetailsById(
    request: ServiceDetailsRequest,
  ): Promise<{
    data: ServiceDetails | null;
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_SERVICE_DETAILS_BY_ID_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data: ServiceDetailsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data,
          error: null,
        };
      } else {
        return {
          data: null,
          error: data.message || "Failed to fetch service details",
        };
      }
    } catch (err) {
      console.error("Error fetching service details:", err);
      return {
        data: null,
        error: "Something went wrong while fetching service details",
      };
    }
  }
}
