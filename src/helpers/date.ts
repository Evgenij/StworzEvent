type locale = "pl" | "en";

export const formatDate = (date: string | Date) => {
	return new Date(date).toLocaleString("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export class DateTimeFormatter {
	static day(date: Date) {
		return date.getDate();
	}

	static weekday(date: Date, locale: locale) {
		return new Intl.DateTimeFormat(locale, {
			weekday: "long",
		}).format(date);
	}

	static month(date: Date, locale: locale) {
		return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
	}
	static year(date: Date, locale: locale) {
		return new Intl.DateTimeFormat(locale, { year: "numeric" }).format(
			date,
		);
	}

	static date(date: Date, locale: locale) {
		return new Intl.DateTimeFormat(locale, {
			day: "numeric",
			month: "long",
		}).format(date);
	}

	static time(date: Date | null, locale: locale) {
		return date
			? new Intl.DateTimeFormat(locale, {
					hour: "2-digit",
					minute: "2-digit",
				}).format(date)
			: null;
	}

	static timeISO(date: Date | null) {
		return date?.toISOString() ?? "";
	}

	static isSameDay(date1: Date, date2: Date): boolean {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}
}
