import { DateTimeFormatter } from "@/helpers/date";
import { EventAgendaItem } from "@prisma/client";
import { IconChevronDown } from "@tabler/icons-react";

const EventAgendaListItem = ({
	data,
	locale,
}: {
	data: EventAgendaItem;
	locale: string;
}) => {
	return (
		<div className="flex gap-4 mb-6">
			<div className="times w-12 flex flex-col items-end text-sm">
				<span className="text-base font-medium">
					{DateTimeFormatter.time(data.startsAt, locale)}
				</span>
				<span className="text-muted-foreground">
					{data.endsAt
						? DateTimeFormatter.time(data.endsAt, locale)
						: "N/A"}
				</span>
			</div>
			<div className="dot-wrapper flex items-start pt-1.5">
				<div className="size-2 rounded-full bg-foreground"></div>
			</div>
			<div className="main-data flex flex-col">
				{data.location && (
					<span className="text-sm font-medium text-primary mb-3">
						{data.location}
					</span>
				)}
				<div className="text-lg font-semibold mb-2 leading-[1.2rem]">
					{data.title}
				</div>
				{data.speakerName && (
					<p className="text-sm mb-2 text-muted-foreground">
						Speaker:{" "}
						<span className="font-medium text-cyan-600">
							{data.speakerName}
						</span>
					</p>
				)}

				{data.description && (
					<details className="group mt-2">
						<summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							<IconChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" />
							<span>Więcej informacji</span>
						</summary>
						<div className="mt-2 ml-1 border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground">
							{data.description}
						</div>
					</details>
				)}
			</div>
		</div>
	);
};

export default EventAgendaListItem;
