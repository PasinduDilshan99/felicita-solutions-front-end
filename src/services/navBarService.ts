import { NavBarApiResponse, NavBarItem } from "@/types/nav-bar-types";
import { GET_ALL_NAV_BAR_DATA } from "@/utils/frontEndConstant";

export class NavBarService {
  static async fetchAllNavBarData(): Promise<{
    data: NavBarItem[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_ALL_NAV_BAR_DATA);
      const data: NavBarApiResponse = await response.json();

      if (response.ok) {
        return {
          data: data.data || [],
          error: null,
        };
      } else {
        return {
          data: [],
          error: "Failed to fetch nav bar items",
        };
      }
    } catch (err) {
      console.error("Error fetching nav bar items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching nav bar items",
      };
    }
  }
}
