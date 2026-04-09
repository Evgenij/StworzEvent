import { DateTimeFormatter } from "@/helpers/date-formatter";
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
	return (
		<div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-10">
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
