import { CeoSpeech, CeoSpeechApiResponse } from "@/types/user-types";
import { GET_CEO_SPEECH_DETAILS_DATA_FE } from "@/utils/frontEndConstant";

export class UserService {
  static async fetchCeoSpeechData(): Promise<{
    data: CeoSpeech | null;
    error: string | null;
  }> {
    try {
      const response = await fetch(GET_CEO_SPEECH_DETAILS_DATA_FE);
      const data: CeoSpeechApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data,
          error: null,
        };
      } else {
        return {
          data: null,
          error: data.message || "Failed to fetch CEO speech data",
        };
      }
    } catch (err) {
      console.error("Error fetching CEO speech data:", err);
      return {
        data: null,
        error: "Something went wrong while fetching CEO speech data",
      };
    }
  }
}
