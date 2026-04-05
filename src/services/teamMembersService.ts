// teamMembersService.ts
import { TeamMember, TeamMemberApiResponse } from "@/types/team-members-types";
import { GET_TEAM_MEMBERS_DETAILS_DATA_FE } from "@/utils/frontEndConstant";

export class TeamMembersService {
  static async fetchTeamMembersData(): Promise<{
    data: TeamMember[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_TEAM_MEMBERS_DETAILS_DATA_FE);
      const data: TeamMemberApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch team members data",
        };
      }
    } catch (err) {
      console.error("Error fetching team members data:", err);
      return {
        data: [],
        error: "Something went wrong while fetching team members data",
      };
    }
  }
}