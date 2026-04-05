const API = "/api";
const AUTH = "/auth";
const NAV_BAR = "/nav-bar";
const HERO_SECTION = "/hero";
const USER = "/user";
const FEATURES = "/feature";
const SERVICES = "/services";
const CONTACT_US = "/contact-us";
const PROJECTS = "/projects";
const BENEFITS = "/benefits";
const COMMON = "/common";
const TEAM_MEMBERS = "/team-members";

// Auth
export const LOGIN_FE = `${API}${AUTH}/login`;
export const LOGOUT_FE = `${API}${AUTH}/logout`;
export const SIGNUP_FE = `${API}${AUTH}/signup`;
export const GET_USER_DETAILS_FOR_LOGIN_DATA_FE = `${API}${AUTH}/me`;
export const UPDATE_PASSWORD_DATA_FE = `${API}${AUTH}/change-password`;
export const RESET_PASSWORD_DATA_FE = `${API}${AUTH}/reset-password`;
export const UPDATE_SECRET_QUESTIONS_DATA_FE = `${API}${AUTH}/update-secret-questions`;
export const USERNAME_PASSWORD_VALIDATION_DATA_FE = `${API}${AUTH}/username-password-validation`;
export const GET_ACTIVE_SECRET_QUESTIONS_DATA_FE = `${API}${AUTH}/secret-questions`;
export const GET_SECRET_QUESTIONS_BY_USER_DATA_FE = `${API}${AUTH}/secret-questions-by-user`;

// Nav Bar
export const GET_ALL_NAV_BAR_DATA = `${API}${NAV_BAR}`;

// Hero Section
export const GET_HOME_PAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/home-hero`;

// Hero Section
export const GET_CEO_SPEECH_DETAILS_DATA_FE = `${API}${USER}/ceo-details`;

// Features
export const GET_FEATURE_DETAILS_HOME_PAGE_DATA_FE = `${API}${FEATURES}/home-page`;

// Services
export const GET_SERVICES_BASIC_DETAILS_DATA_FE = `${API}${SERVICES}/basic-details`;
export const GET_SERVICE_DETAILS_BY_ID_DATA_FE = `${API}${SERVICES}/details-by-id`;

// Contact Us
export const ADD_CONTACT_REQUEST_DATA_FE = `${API}${CONTACT_US}/request`;

// Projects
export const GET_PROJECTS_CLIENTS_DATA_FE = `${API}${PROJECTS}/clients`;
export const GET_PROJECTS_REVIEWS_BASIC_DETAILS_DATA_FE = `${API}${PROJECTS}/reviews-basic-details`;

// Benefits
export const GET_ACTIVE_BENEFITS_DATA_FE = `${API}${BENEFITS}/active`;

// Common
export const GET_STATISTICS_DATA_FE = `${API}${COMMON}/statistics`;

// Team Members
export const GET_TEAM_MEMBERS_DETAILS_DATA_FE = `${API}${TEAM_MEMBERS}/details`;
