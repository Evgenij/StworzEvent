import { cn } from "@/lib/utils";

type EventsStatisticsBlockProps = {
	title: string;
	value: number;
	unit: string;
	icon: React.ReactNode;
	className?: string;
};

const EventsStatisticsBlock = ({
	title,
	value,
	unit,
	icon,
	className,
}: EventsStatisticsBlockProps) => {
	return (
		<div
			className={cn(
				"events-statistics-block border border-border p-3 px-4",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				<span className="text-2xl font-bold">{value}</span>
				<span className="text-sm text-muted-foreground">{unit}</span>
			</div>
			<span className="text-sm text-muted-foreground">{title}</span>
			<div className="flex items-center gap-2">{icon}</div>
		</div>
	);
};

export default EventsStatisticsBlock;
