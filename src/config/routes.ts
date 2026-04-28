const AUTH_ROUTE = "/auth";
const ADMIN_ROUTE = "/admin";
const PROFILE_ROUTE = "/profile";

export const CONDITIONALS_ROUTE = "/conditionals";
export const POLITICS_ROUTE = "/politics";

export const SIGNIN_ROUTE = `${AUTH_ROUTE}/signin`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const SIGNUP_INVITE_ROUTE = `${SIGNUP_ROUTE}/invite`;

export const FORGET_PASSWORD_ROUTE = `${AUTH_ROUTE}/forget-password`;
export const FORGOT_PASSWORD_SUCCESS_ROUTE = `${AUTH_ROUTE}/forget-password/success`;
export const RESET_PASSWORD_ROUTE = `${AUTH_ROUTE}/reset-password`;

export const AUTH_ERROR_ROUTE = `${AUTH_ROUTE}/error`;
export const AUTH_VERIFY_ROUTE = `${AUTH_ROUTE}/verify`;
export const AUTH_VERIFY_SUCCESS_ROUTE = `${AUTH_ROUTE}/verify/success`;

export const HOME_ROUTE = "/";
export const DASHBOARD_ROUTE = `${PROFILE_ROUTE}/dashboard`;
export const EVENTS_ROUTE = `${PROFILE_ROUTE}/events`;
export const NOTIFICATIONS_ROUTE = `${PROFILE_ROUTE}/notifications`;
export const SETTINGS_ROUTE = `${PROFILE_ROUTE}/settings`;

export const NEW_EVENT_ROUTE = `${EVENTS_ROUTE}/new`;

export const ORGANIZATIONS_ROUTE = `${PROFILE_ROUTE}/organizations`;
export const NEW_ORGANIZATION_ROUTE = `${ORGANIZATIONS_ROUTE}/new`;

export const MAIN_PAGE_ROUTE = `/`;
export const MAIN_PAGE_EVENTS_ROUTE = `/events`;
export const EVENT_PAGE_ROUTE = `/events/`;

export const EVENT_EDIT_ROUTE = (id: string) =>
	`${PROFILE_ROUTE}${EVENT_PAGE_ROUTE}${id}/edit`;
// /profile/events/${id}/edit

export const EVENT_EDIT_ADDITIONAL_ROUTE = (id: string) =>
	`${PROFILE_ROUTE}${EVENT_PAGE_ROUTE}${id}/edit/additional`;
// /profile/events/${id}/edit/additional

export const EVENT_EDIT_TICKETS_ROUTE = (id: string) =>
	`${PROFILE_ROUTE}${EVENT_PAGE_ROUTE}${id}/edit/tickets`;
// /profile/events/${id}/edit/tickets

export const UI_ROUTE = "/ui";
export const ADMIN_DASHBOARD_ROUTE = `${ADMIN_ROUTE}/dashboard`;
// export { AUTH_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE, DASHBOARD_ROUTE, HOME_ROUTE, UI_ROUTE};
