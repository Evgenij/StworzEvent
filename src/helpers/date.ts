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

	// toISOString() конвертирует в UTC и смещает дату в часовых поясах UTC+N.
	// Этот метод использует локальные компоненты даты.
	static toLocalDateString(date: Date) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, "0");
		const d = String(date.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}

	// new Date("2026-07-05") парсит как UTC-полночь и смещает дату.
	// Конструктор с числами создаёт локальную дату без смещения.
	static parseLocalDate(dateStr: string): Date {
		const [y, m, d] = dateStr.split("-").map(Number);
		return new Date(y, m - 1, d);
	}

	static isSameDay(date1: Date, date2: Date): boolean {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}
}
