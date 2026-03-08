// src/components/shared/event-date-range.tsx

import { DateFormatter } from "@/helpers/date-formatter";
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
	const isSameDay = endsAt ? DateFormatter.isSameDay(startsAt, endsAt) : true;

	const startMonth = DateFormatter.month(startsAt, locale);
	const startDay = DateFormatter.day(startsAt);
	const startWeekday = DateFormatter.weekday(startsAt, locale);
	const startDate = DateFormatter.date(startsAt, locale);
	const startTime = DateFormatter.time(startsAt, locale);
	const endTime = endsAt ? DateFormatter.time(endsAt, locale) : null;

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
	const endMonth = DateFormatter.month(endsAt!, locale);
	const endDay = DateFormatter.day(endsAt!);
	const endWeekday = DateFormatter.weekday(endsAt!, locale);
	const endDate = DateFormatter.date(endsAt!, locale);

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
