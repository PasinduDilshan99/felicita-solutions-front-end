// types/common_types.ts
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: number;
  code?: number;
  timestamp?: string;
};

export interface Statistics {
  totalYearsOfExperience: number;
  totalUsers: number;
  totalClients: number;
  totalProjects: number;
  totalTeamMembers: number;
}

export type StatisticsApiResponse = ApiResponse<Statistics>;