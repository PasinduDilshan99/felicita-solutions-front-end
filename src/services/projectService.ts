// projectService.ts

import {
  ClientProject,
  ClientProjectApiResponse,
  ProjectReview,
  ProjectReviewApiResponse,
  ProjectBasicDetails,
  ProjectBasicDetailsApiResponse,
  ProjectDetails,
  ProjectDetailsApiResponse,
  ProjectDetailsRequest,
} from "@/types/project-types";
import {
  GET_PROJECTS_CLIENTS_DATA_FE,
  GET_PROJECTS_REVIEWS_BASIC_DETAILS_DATA_FE,
  GET_PROJECTS_BASIC_DETAILS_DATA_FE,
  GET_PROJECTS_DETAILS_BY_ID_DATA_FE,
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

  static async fetchProjectsBasicDetailsData(): Promise<{
    data: ProjectBasicDetails[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PROJECTS_BASIC_DETAILS_DATA_FE);
      const data: ProjectBasicDetailsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch projects basic details data",
        };
      }
    } catch (err) {
      console.error("Error fetching projects basic details data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching projects basic details data",
      };
    }
  }

  static async fetchProjectDetailsById(request: ProjectDetailsRequest): Promise<{
    data: ProjectDetails | null;
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PROJECTS_DETAILS_BY_ID_DATA_FE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const data: ProjectDetailsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data,
          error: null,
        };
      } else {
        return {
          data: null,
          error: data.message || "Failed to fetch project details",
        };
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
      return {
        data: null,
        error: "Something went wrong while fetching project details",
      };
    }
  }
}