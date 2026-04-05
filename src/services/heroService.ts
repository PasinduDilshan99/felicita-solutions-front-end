import { HeroApiResponse, HeroSection } from "@/types/hero-types";
import { GET_HOME_PAGE_HERO_SECTION_DATA_FE } from "@/utils/frontEndConstant";

export class HeroService {
  static async fetchAllHeroData(): Promise<{
    data: HeroSection[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_HOME_PAGE_HERO_SECTION_DATA_FE);
      const data: HeroApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeHeroSections = (data.data || [])
          .filter((hero) => hero.status === "ACTIVE")
          .sort((a, b) => a.order - b.order);

        return {
          data: activeHeroSections,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch hero section data",
        };
      }
    } catch (err) {
      console.error("Error fetching hero section items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching hero section data",
      };
    }
  }
}
