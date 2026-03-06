export const API_ROUTES = {
	invites: "/invites",
	events: {
		list: "/events",
		create: "/events/create",
		listById: (id: string) => `/events/${id}`,
	},
};
