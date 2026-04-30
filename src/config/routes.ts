// root routes
const AUTH_ROUTE = "/auth";
const ADMIN_ROUTE = "/admin";
const PROFILE_ROUTE = "/profile";
export const MAIN_PAGE_ROUTE = `/`;

// spec routes
export const CONDITIONALS_ROUTE = "/conditionals";
export const POLITICS_ROUTE = "/politics";

// auth routes
export const SIGNIN_ROUTE = `${AUTH_ROUTE}/signin`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const SIGNUP_INVITE_ROUTE = `${SIGNUP_ROUTE}/invite`;
export const FORGET_PASSWORD_ROUTE = `${AUTH_ROUTE}/forget-password`;
export const FORGOT_PASSWORD_SUCCESS_ROUTE = `${AUTH_ROUTE}/forget-password/success`;
export const RESET_PASSWORD_ROUTE = `${AUTH_ROUTE}/reset-password`;
export const AUTH_ERROR_ROUTE = `${AUTH_ROUTE}/error`;
export const AUTH_VERIFY_ROUTE = `${AUTH_ROUTE}/verify`;
export const AUTH_VERIFY_SUCCESS_ROUTE = `${AUTH_ROUTE}/verify/success`;

// profile routes
export const DASHBOARD_ROUTE = `${PROFILE_ROUTE}/dashboard`;
export const EVENTS_ROUTE = `${PROFILE_ROUTE}/events`;
export const NOTIFICATIONS_ROUTE = `${PROFILE_ROUTE}/notifications`;
export const SETTINGS_ROUTE = `${PROFILE_ROUTE}/settings`;
export const ORGANIZATIONS_ROUTE = `${PROFILE_ROUTE}/organizations`;

// events routes
export const NEW_EVENT_ROUTE = `${EVENTS_ROUTE}/new`;
export const EVENT_ROUTE = (id: string) => `${EVENTS_ROUTE}/${id}`;

// organizations routes
export const NEW_ORGANIZATION_ROUTE = `${ORGANIZATIONS_ROUTE}/new`;

export const EVENT_PAGE_ROUTE = (id: string) => `${EVENTS_ROUTE}/${id}`;
export const EVENT_EDIT_ROUTE = (id: string) => `${EVENTS_ROUTE}/${id}/edit`;

export const EVENT_EDIT_ADDITIONAL_ROUTE = (id: string) =>
	`${EVENTS_ROUTE}/${id}/edit/additional`;
export const EVENT_EDIT_TICKETS_ROUTE = (id: string) =>
	`${EVENTS_ROUTE}/${id}/edit/tickets`;
export const EVENT_EDIT_PAYMENT_ROUTE = (id: string) =>
	`${EVENTS_ROUTE}/${id}/edit/payment`;

// main page routes
export const MAIN_PAGE_EVENTS_ROUTE = `${MAIN_PAGE_ROUTE}events`;
export const MAIN_PAGE_EVENT_ROUTE = (id: string) =>
	`${MAIN_PAGE_ROUTE}events/${id}`;

export const UI_ROUTE = "/ui";
export const ADMIN_DASHBOARD_ROUTE = `${ADMIN_ROUTE}/dashboard`;
// export { AUTH_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE, DASHBOARD_ROUTE, HOME_ROUTE, UI_ROUTE};
