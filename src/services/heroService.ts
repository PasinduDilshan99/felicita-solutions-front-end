// heroService.ts
import { 
  HeroApiResponse, 
  HeroSection, 
  PageHeroApiResponse, 
  PageHeroSection 
} from "@/types/hero-types";
import { 
  GET_HOME_PAGE_HERO_SECTION_DATA_FE,
  GET_SERVICE_PAGE_HERO_SECTION_DATA_FE,
  GET_ABOUT_US_PAGE_HERO_SECTION_DATA_FE,
  GET_PROJECTS_PAGE_HERO_SECTION_DATA_FE,
  GET_BLOGS_PAGE_HERO_SECTION_DATA_FE,
  GET_PRICING_PAGE_HERO_SECTION_DATA_FE,
  GET_CONTACT_US_PAGE_HERO_SECTION_DATA_FE
} from "@/utils/frontEndConstant";

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

  static async fetchServiceHeroData(): Promise<{
    data: PageHeroSection[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_SERVICE_PAGE_HERO_SECTION_DATA_FE);
      const data: PageHeroApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeServiceHeroSections = (data.data || [])
          .filter((hero) => hero.statusName === "ACTIVE")
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeServiceHeroSections,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch service hero section data",
        };
      }
    } catch (err) {
      console.error("Error fetching service hero section items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching service hero section data",
      };
    }
  }

  static async fetchAboutUsHeroData(): Promise<{
    data: PageHeroSection[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_ABOUT_US_PAGE_HERO_SECTION_DATA_FE);
      const data: PageHeroApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeHeroSections = (data.data || [])
          .filter((hero) => hero.statusName === "ACTIVE")
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeHeroSections,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch about us hero section data",
        };
      }
    } catch (err) {
      console.error("Error fetching about us hero section items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching about us hero section data",
      };
    }
  }

  static async fetchProjectsHeroData(): Promise<{
    data: PageHeroSection[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PROJECTS_PAGE_HERO_SECTION_DATA_FE);
      const data: PageHeroApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeHeroSections = (data.data || [])
          .filter((hero) => hero.statusName === "ACTIVE")
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeHeroSections,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch projects hero section data",
        };
      }
    } catch (err) {
      console.error("Error fetching projects hero section items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching projects hero section data",
      };
    }
  }

  static async fetchBlogsHeroData(): Promise<{
    data: PageHeroSection[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_BLOGS_PAGE_HERO_SECTION_DATA_FE);
      const data: PageHeroApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeHeroSections = (data.data || [])
          .filter((hero) => hero.statusName === "ACTIVE")
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeHeroSections,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch blogs hero section data",
        };
      }
    } catch (err) {
      console.error("Error fetching blogs hero section items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching blogs hero section data",
      };
    }
  }

  static async fetchPricingHeroData(): Promise<{
    data: PageHeroSection[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_PRICING_PAGE_HERO_SECTION_DATA_FE);
      const data: PageHeroApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeHeroSections = (data.data || [])
          .filter((hero) => hero.statusName === "ACTIVE")
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeHeroSections,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch pricing hero section data",
        };
      }
    } catch (err) {
      console.error("Error fetching pricing hero section items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching pricing hero section data",
      };
    }
  }

  static async fetchContactUsHeroData(): Promise<{
    data: PageHeroSection[];
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_CONTACT_US_PAGE_HERO_SECTION_DATA_FE);
      const data: PageHeroApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        const activeHeroSections = (data.data || [])
          .filter((hero) => hero.statusName === "ACTIVE")
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          data: activeHeroSections,
          error: null,
        };
      } else {
        return {
          data: [],
          error: data.message || "Failed to fetch contact us hero section data",
        };
      }
    } catch (err) {
      console.error("Error fetching contact us hero section items:", err);
      return {
        data: [],
        error: "Something went wrong while fetching contact us hero section data",
      };
    }
  }
}