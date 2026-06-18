export const APP_CONFIG = {
	name: "StworzEvent.pl",
	version: "0.0.4",
	description: "Platforma do tworzenia i zarządzania wydarzeniami",
	url: "https://stworzevent.pl",
	email: {
		sender: {
			name: "StwórzEvent.pl",
			address: "no-reply@stworzevent.pl",
		},
		replyTo: "contact@stworzevent.pl",
		get fullSender() {
			return `${this.sender.name} <${this.sender.address}>`;
		},
	},
} as const;

export type AppConfig = typeof APP_CONFIG;
