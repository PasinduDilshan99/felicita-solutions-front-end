// Development
const PROTOCOL = "http";
const DOMAIN = "localhost";
const PORT = "8080";
const CONTEXT_ROOT = "felicita-solutions";
const VERSION = "/v0";
const API = "/api";
export const BASE_PATH = `${PROTOCOL}://${DOMAIN}:${PORT}/${CONTEXT_ROOT}`;

// Staging (commented out)
// const PROTOCOL = "http";
// const DOMAIN = "staging-api.felicitasolutions.com";
// const PORT = "443";
// const CONTEXT_ROOT = "felicita-solutions";
// const VERSION = "/v0";
// const API = "/api";
// export const BASE_PATH = `${PROTOCOL}://${DOMAIN}/${CONTEXT_ROOT}`;

// Production (commented out)
// const PROTOCOL = "https";
// const DOMAIN = "api.felicitasolutions.com";
// const PORT = "443";
// const CONTEXT_ROOT = "felicita-solutions";
// const VERSION = "/v0";
// const API = "/api";
// export const BASE_PATH = `${PROTOCOL}://${DOMAIN}/${CONTEXT_ROOT}`;

const AUTH = "/auth";
const NAV_BAR = "/nav-bar";
const HERO_SECTION = "/hero-section";
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

// Auth endpoints
export const LOGIN = `${BASE_PATH}${API}${VERSION}${AUTH}/login`;
export const LOGOUT = `${BASE_PATH}${API}${VERSION}${AUTH}/logout`;
export const SIGNUP = `${BASE_PATH}${API}${VERSION}${AUTH}/signup`;
export const GET_USER_DETAILS_FOR_LOGIN_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/me`;
export const UPDATE_PASSWORD_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/change-password`;
export const RESET_PASSWORD_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/reset-password`;
export const UPDATE_SECRET_QUESTIONS_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/update-secret-questions`;
export const USERNAME_PASSWORD_VALIDATION_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/username-password-validation`;
export const GET_ACTIVE_SECRET_QUESTIONS_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/secret-questions`;
export const GET_SECRET_QUESTIONS_BY_USER_DATA = `${BASE_PATH}${API}${VERSION}${AUTH}/secret-questions-by-user`;

// Nav Bar
export const GET_ACTIVE_NAV_BAR_DATA = `${BASE_PATH}${API}${VERSION}${NAV_BAR}/active`;

// Hero Section
export const GET_HOME_PAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/home`;
export const GET_SERVICE_PAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/service`;
export const GET_ABOUT_US_PAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/about-us`;
export const GET_PROJECTS_PAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/projects`;
export const GET_BLOGS_PAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/blogs`;
export const GET_PRICING_PAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/pricing`;
export const GET_CONTACT_US_PAGE_HERO_SECTION_DATA = `${BASE_PATH}${API}${VERSION}${HERO_SECTION}/contact-us`;

// User
export const GET_CEO_SPEECH_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${USER}/ceo-speech`;

// Features
export const GET_FEATURE_DETAILS_HOME_PAGE_DATA = `${BASE_PATH}${API}${VERSION}${FEATURES}/home-page`;

// Services
export const GET_SERVICES_BASIC_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${SERVICES}/basic-details`;
export const GET_SERVICE_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${SERVICES}/details-by-id`;

// Contact Us
export const ADD_CONTACT_REQUEST_DATA = `${BASE_PATH}${API}${VERSION}${CONTACT_US}/request`;

// Projects
export const GET_PROJECTS_CLIENTS_DATA = `${BASE_PATH}${API}${VERSION}${PROJECTS}/clients`;
export const GET_PROJECTS_REVIEWS_BASIC_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PROJECTS}/reviews-basic-details`;
export const GET_PROJECTS_BASIC_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PROJECTS}/projects-basic-details`;
export const GET_PROJECTS_DETAILS_BY_ID_DATA = `${BASE_PATH}${API}${VERSION}${PROJECTS}/projects-details-by-id`;

// Benefits
export const GET_ACTIVE_BENEFITS_DATA = `${BASE_PATH}${API}${VERSION}${BENEFITS}/active`;

// Common
export const GET_STATISTICS_DATA = `${BASE_PATH}${API}${VERSION}${COMMON}/statistics`;

// Team Members
export const GET_TEAM_MEMBERS_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${TEAM_MEMBERS}/details`;

// Company Information
export const GET_COMPANY_MISSION_VISION_AND_VALUES_DATA = `${BASE_PATH}${API}${VERSION}${COMPANY_INFORMATION}/details`;

// Why Choose Us
export const GET_WHY_CHOOSE_US_DATA = `${BASE_PATH}${API}${VERSION}${WHY_CHOOSE_US}/details`;

// Pricing
export const GET_PRICING_BASIC_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PRICING}/basic-details`;
export const GET_PRICING_DETAILS_DATA = `${BASE_PATH}${API}${VERSION}${PRICING}/details`;

// Faq
export const GET_FAQ_PRICING_DATA = `${BASE_PATH}${API}${VERSION}${FAQ}/pricing`;
export const GET_FAQ_ALL_DATA = `${BASE_PATH}${API}${VERSION}${FAQ}/all`;
