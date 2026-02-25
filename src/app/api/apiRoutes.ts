export const API_ROUTES = {
	invites: "/invites",
	events: {
		list: "/events",
		create: "/events/create",
		listByOrg: (orgId: string) => `/events/${orgId}`,
	},
};
