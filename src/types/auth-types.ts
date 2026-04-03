// types/auth.ts
import { ApiResponse } from "./common-types";

// Request Types
export type ResetPasswordRequest = {
  username: string;
  secretQuestion1: number;
  secretQuestion1Answer: string;
  secretQuestion2: number;
  secretQuestion2Answer: string;
  secretQuestion3: number;
  secretQuestion3Answer: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordRequest = {
  username: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type UpdateSecretQuestionsRequest = {
  addQuestions: { question: number; answer: string }[];
  updateQuestions: { question: number; answer: string }[];
  removeQuestionsIds: number[];
};

// Response Types
export type SecretQuestion = {
  questionId: number;
  question: string;
};

export type UserSecretQuestion = {
  secretQuestionId: number;
  secretQuestion: string;
  answer: string;
};

export type MessageResponse = {
  message: string;
};

// User type for auth context
export type User = {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type SignupRequest = {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export type { ApiResponse };