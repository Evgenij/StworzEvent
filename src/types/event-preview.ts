export type EventPreview = {
	coverImage?: string | null;
	title: string;
	description?: unknown;
	startsAt: Date | string;
	endsAt?: Date | string | null;
	location?: string;
	address?: string;
	slug?: string; // опционально для превью
};
