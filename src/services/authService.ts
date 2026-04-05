// services/authService.ts
import {
  LOGIN_FE,
  LOGOUT_FE,
  SIGNUP_FE,
  GET_USER_DETAILS_FOR_LOGIN_DATA_FE,
  RESET_PASSWORD_DATA_FE,
  UPDATE_PASSWORD_DATA_FE,
  UPDATE_SECRET_QUESTIONS_DATA_FE,
  USERNAME_PASSWORD_VALIDATION_DATA_FE,
  GET_ACTIVE_SECRET_QUESTIONS_DATA_FE,
  GET_SECRET_QUESTIONS_BY_USER_DATA_FE,
} from "@/utils/frontEndConstant";
import type {
  ApiResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SecretQuestion,
  UpdateSecretQuestionsRequest,
  UserSecretQuestion,
  MessageResponse,
  User,
  LoginRequest,
  SignupRequest,
} from "@/types/auth-types";

export class AuthService {
  // Login
  static async login(credentials: LoginRequest): Promise<User> {
    try {
      const res = await fetch(LOGIN_FE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<User> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred during login");
    }
  }

  // Signup
  static async signup(userData: SignupRequest): Promise<User> {
    try {
      const res = await fetch(SIGNUP_FE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<User> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred during signup");
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      const res = await fetch(LOGOUT_FE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred during logout");
    }
  }

  // Get current user details
  static async getCurrentUser(): Promise<User> {
    try {
      const res = await fetch(GET_USER_DETAILS_FOR_LOGIN_DATA_FE, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<User> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred while fetching user details");
    }
  }

  // Reset password
  static async resetPassword(request: ResetPasswordRequest): Promise<string> {
    try {
      const res = await fetch(RESET_PASSWORD_DATA_FE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: ApiResponse<MessageResponse> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      return data.data.message;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred during password reset");
    }
  }

  // Change password
  static async changePassword(request: ChangePasswordRequest): Promise<string> {
    try {
      const res = await fetch(UPDATE_PASSWORD_DATA_FE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: ApiResponse<MessageResponse> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return data.data.message;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred during password change");
    }
  }

  // Get secret questions
  static async getSecretQuestions(): Promise<SecretQuestion[]> {
    try {
      const res = await fetch(GET_ACTIVE_SECRET_QUESTIONS_DATA_FE, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<SecretQuestion[]> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch secret questions");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred while fetching secret questions");
    }
  }

  // Update secret questions
  static async updateSecretQuestions(
    request: UpdateSecretQuestionsRequest,
  ): Promise<string> {
    try {
      const res = await fetch(UPDATE_SECRET_QUESTIONS_DATA_FE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: ApiResponse<MessageResponse> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update secret questions");
      }

      return data.data.message;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred while updating secret questions");
    }
  }

  // Username password validation
  static async validateUsernamePassword(
    username: string,
    password: string,
  ): Promise<boolean> {
    try {
      const res = await fetch(USERNAME_PASSWORD_VALIDATION_DATA_FE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data: ApiResponse<boolean> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Validation failed");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred during validation");
    }
  }

  // Get secret questions by logged-in user
  static async getSecretQuestionsByUser(): Promise<UserSecretQuestion[]> {
    try {
      const res = await fetch(GET_SECRET_QUESTIONS_BY_USER_DATA_FE, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<UserSecretQuestion[]> = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user secret questions");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred while fetching user secret questions");
    }
  }
}