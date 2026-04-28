// src/components/shared/event-date-range.tsx

import { DateTimeFormatter } from "@/helpers/date-formatter";
import EventMetaItem from "@/components/events/page/event-meta-item";

type EventDateRangeProps = {
	startsAt: Date;
	endsAt: Date | null;
	locale: string;
};

export const EventDateRange = ({
	startsAt,
	endsAt,
	locale,
}: EventDateRangeProps) => {
	const isSameDay = endsAt
		? DateTimeFormatter.isSameDay(startsAt, endsAt)
		: true;

	const startMonth = DateTimeFormatter.month(startsAt, locale);
	const startDay = DateTimeFormatter.day(startsAt);
	const startWeekday = DateTimeFormatter.weekday(startsAt, locale);
	const startDate = DateTimeFormatter.date(startsAt, locale);
	const startTime = DateTimeFormatter.time(startsAt, locale);
	const endTime = endsAt ? DateTimeFormatter.time(endsAt, locale) : null;

	if (isSameDay) {
		// Одна дата — показываем время начала и конца
		return (
			<EventMetaItem
				label={{ title: startMonth, value: startDay.toString() }}
				header={`${startWeekday}, ${startDate}`}
				subheader={startTime + (endTime ? ` - ${endTime}` : "")}
			/>
		);
	}

	// Разные даты — показываем две даты
	const endMonth = DateTimeFormatter.month(endsAt!, locale);
	const endDay = DateTimeFormatter.day(endsAt!);
	const endWeekday = DateTimeFormatter.weekday(endsAt!, locale);
	const endDate = DateTimeFormatter.date(endsAt!, locale);

	return (
		<div className="flex flex-col justify-start">
			<EventMetaItem
				label={{ title: startMonth, value: startDay.toString() }}
				header={`${startWeekday}, ${startDate}`}
				subheader={startTime}
			/>
			<div className="flex pl-8 w-full justify-start items-center">
				<div className="w-0.5 h-3 bg-gray-200"></div>
			</div>
			<EventMetaItem
				label={{ title: endMonth, value: endDay.toString() }}
				header={`${endWeekday}, ${endDate}`}
				subheader={endTime ?? ""}
			/>
		</div>
	);
};
