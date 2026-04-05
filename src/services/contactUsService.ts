// contactUsService.ts

import {
  ContactUsApiResponse,
  ContactUsRequest,
  ContactUsResponse,
} from "@/types/contact-us-types";
import { ADD_CONTACT_REQUEST_DATA_FE } from "@/utils/frontEndConstant";

export class ContactUsService {
  static async submitContactRequest(request: ContactUsRequest): Promise<{
    data: ContactUsResponse | null;
    error: string | null;
  }> {
    try {
      const response = await fetch(ADD_CONTACT_REQUEST_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data: ContactUsApiResponse = await response.json();

      if (response.ok && data.code === 200) {
        return {
          data: data.data,
          error: null,
        };
      } else {
        return {
          data: null,
          error: data.message || "Failed to submit contact request",
        };
      }
    } catch (err) {
      console.error("Error submitting contact request:", err);
      return {
        data: null,
        error: "Something went wrong while submitting contact request",
      };
    }
  }
}
