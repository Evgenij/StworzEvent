import { DateFormatter } from "@/helpers/date-formatter";
import EventMetaItem from "./event-meta-item";
import { EventDateRange } from "./event-date-range";

type EventMetaSectionProps = {
	startsAt: Date;
	endsAt: Date | null;
	location: string | null;
	address: string | null;
	locale: string; // ← добавь
};

const EventMetaSection = ({
	startsAt,
	endsAt,
	location,
	address,
	locale,
}: EventMetaSectionProps) => {
	const month = DateFormatter.month(startsAt, locale);
	const day = DateFormatter.day(startsAt);
	const weekday = DateFormatter.weekday(startsAt, locale);
	const date = DateFormatter.date(startsAt, locale);
	const startTime = DateFormatter.time(startsAt, locale);
	const endTime = DateFormatter.time(endsAt, locale);

	return (
		<div className="flex items-start gap-10">
			{/* Дата */}
			{/* <div className="dates-range">
				<EventMetaItem
					label={{
						title: month,
						value: day.toString(),
					}}
					header={weekday + ", " + date}
					subheader={startTime + (endTime ? " - " + endTime : "")}
				/>
			</div> */}
			<EventDateRange
				startsAt={startsAt}
				endsAt={endsAt}
				locale={locale}
			/>

			{/* Место */}
			{(location || address) && (
				<EventMetaItem
					label={{
						title: "miasto",
						value: location,
					}}
					header={location || "Online wydarzenie"}
					subheader={address || "link dostępny po zapisaniu"}
				/>
			)}
		</div>
	);
};

export default EventMetaSection;
