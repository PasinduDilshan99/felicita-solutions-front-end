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
const COMPANY_INFORMATION = "/company-information";
const WHY_CHOOSE_US = "/why-choose-us";
const PRICING = "/pricing";
const FAQ = "/faq";

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
export const GET_SERVICE_PAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/service`;
export const GET_ABOUT_US_PAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/about-us`;
export const GET_PROJECTS_PAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/projects`;
export const GET_BLOGS_PAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/blogs`;
export const GET_PRICING_PAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/pricing`;
export const GET_CONTACT_US_PAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/contact-us`;

// User
export const GET_CEO_SPEECH_DETAILS_DATA_FE = `${API}${USER}/ceo-details`;

// Features
export const GET_FEATURE_DETAILS_HOME_PAGE_DATA_FE = `${API}${FEATURES}/home-page`;

// Services
export const GET_SERVICES_BASIC_DETAILS_DATA_FE = `${API}${SERVICES}/basic-details`;
export const GET_SERVICE_DETAILS_BY_ID_DATA_FE = `${API}${SERVICES}/details-by-id`;

// Contact Us
export const ADD_CONTACT_REQUEST_DATA_FE = `${API}${CONTACT_US}/request`;
export const GET_CONTACT_METHODS_DATA_FE = `${API}${CONTACT_US}/contact-methods`;
export const GET_SOCIAL_MEDIA_DATA_FE = `${API}${CONTACT_US}/social-media`;

// Projects
export const GET_PROJECTS_CLIENTS_DATA_FE = `${API}${PROJECTS}/clients`;
export const GET_PROJECTS_REVIEWS_BASIC_DETAILS_DATA_FE = `${API}${PROJECTS}/reviews-basic-details`;
export const GET_PROJECTS_BASIC_DETAILS_DATA_FE = `${API}${PROJECTS}/projects-basic-details`;
export const GET_PROJECTS_DETAILS_BY_ID_DATA_FE = `${API}${PROJECTS}/projects-details-by-id`;

// Benefits
export const GET_ACTIVE_BENEFITS_DATA_FE = `${API}${BENEFITS}/active`;

// Common
export const GET_STATISTICS_DATA_FE = `${API}${COMMON}/statistics`;

// Team Members
export const GET_TEAM_MEMBERS_DETAILS_DATA_FE = `${API}${TEAM_MEMBERS}/details`;

// Company Information
export const GET_COMPANY_MISSION_VISION_AND_VALUES_DATA_FE = `${API}${COMPANY_INFORMATION}/details`;

// Why Choose Us
export const GET_WHY_CHOOSE_US_DATA_FE = `${API}${WHY_CHOOSE_US}/details`;

// Pricing
export const GET_PRICING_BASIC_DETAILS_DATA_FE = `${API}${PRICING}/basic-details`;
export const GET_PRICING_DETAILS_DATA_FE = `${API}${PRICING}/details`;

// Faq
export const GET_FAQ_PRICING_DATA_FE = `${API}${FAQ}/pricing`;
export const GET_FAQ_ALL_DATA_FE = `${API}${FAQ}/all`;