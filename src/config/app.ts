export const APP_CONFIG = {
	name: "StworzEvent.pl",
	version: "0.0.1",
	description: "Platforma do tworzenia i zarządzania wydarzeniami",
	url: "https://stworzevent.pl",
	email: "contact@stworzevent.pl",
} as const;

export type AppConfig = typeof APP_CONFIG;
