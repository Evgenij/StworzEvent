import { cn } from "@/lib/utils";
import EventsStatisticsBlock from "./events-statistics-block";
import { IconCalendar, IconCarTurbine } from "@tabler/icons-react";

const EventsStatistics = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"events-statistics grid grid-cols-4 gap-3",
				className,
			)}
		>
			<EventsStatisticsBlock
				title="Wydarzeń"
				value={14}
				unit=""
				icon={<IconCalendar />}
			/>
			<EventsStatisticsBlock
				title="W sprzedaży"
				value={5}
				unit=""
				icon={<IconCarTurbine />}
			/>
		</div>
	);
};

export default EventsStatistics;
