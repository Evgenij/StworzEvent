import EventMetaItem from "./event-meta-item";

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
	const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(
		startsAt,
	);
	const day = startsAt.getDate();
	const weekday = new Intl.DateTimeFormat(locale, {
		weekday: "long",
	}).format(startsAt);
	const date = new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "long",
	}).format(startsAt);
	const startTime = new Intl.DateTimeFormat(locale, {
		hour: "2-digit",
		minute: "2-digit",
	}).format(startsAt);
	const endTime = endsAt
		? new Intl.DateTimeFormat(locale, {
				hour: "2-digit",
				minute: "2-digit",
			}).format(endsAt)
		: null;

	return (
		<div className="flex items-start gap-10">
			{/* Дата */}
			<EventMetaItem
				month={month}
				day={day.toString()}
				header={weekday + ", " + date}
				subheader={startTime + (endTime ? " - " + endTime : "")}
			/>

			{/* Место */}
			{(location || address) && (
				<EventMetaItem
					month="miasto"
					day={location}
					header={location}
					subheader={address}
				/>
			)}
		</div>
	);
};

export default EventMetaSection;
