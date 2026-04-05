// projectService.ts

import {
  ClientProject,
  ClientProjectApiResponse,
  ProjectReview,
  ProjectReviewApiResponse,
} from "@/types/project-types";
import {
  GET_PROJECTS_CLIENTS_DATA_FE,
  GET_PROJECTS_REVIEWS_BASIC_DETAILS_DATA_FE,
} from "@/utils/frontEndConstant";

export class ProjectService {
  static async fetchClientProjectsData(): Promise<{
    data: ClientProject[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PROJECTS_CLIENTS_DATA_FE);
      const data: ClientProjectApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch client projects data",
        };
      }
    } catch (err) {
      console.error("Error fetching client projects data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching client projects data",
      };
    }
  }

  static async fetchProjectReviewsData(): Promise<{
    data: ProjectReview[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PROJECTS_REVIEWS_BASIC_DETAILS_DATA_FE);
      const data: ProjectReviewApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch project reviews data",
        };
      }
    } catch (err) {
      console.error("Error fetching project reviews data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching project reviews data",
      };
    }
  }
}
