import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import { EventWithCategories } from "@/types/event";
import {
	IconDots,
	IconEdit,
	IconMapPin,
	IconShare,
	IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import EventStatusBadge from "./event-status-badge";
import { Button } from "@/components/ui/button";
import EventDateLabel from "./event-date-label";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/routing";
import { EVENT_ROUTE, MAIN_PAGE_EVENT_ROUTE } from "@/config/routes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EventsTableRowType = {
	data: EventWithCategories;
	className?: string;
};

const EventsTableRow = ({ className, data }: EventsTableRowType) => {
	return (
		<TableRow className={cn("events-table-row group", className)}>
			{/* nazwa */}
			<TableCell className="font-medium max-w-[300px] overflow-hidden group">
				<div className="name flex gap-3 items-center min-w-0 relative">
					<Image
						src={data.coverImage || "/placeholder.jpg"}
						alt={data.coverImage || "Event cover"}
						className="w-auto h-18 aspect-video object-cover rounded-md border border-border shrink-0"
						width={0}
						height={0}
					/>
					<div className="flex flex-col gap-1 min-w-0 overflow-hidden">
						{data.categories.length > 0 && (
							<span className="text-xs text-muted-foreground line-clamp-1 font-normal">
								{data.categories
									.map((c) => c.category.name)
									.join(", ")}
							</span>
						)}
						<Link
							href={MAIN_PAGE_EVENT_ROUTE(data.slug)}
							className="no-underline"
						>
							<Typography
								variant="h4"
								className="text-sm font-medium line-clamp-1 hover:underline"
							>
								{data.title}
							</Typography>
						</Link>

						<div className="flex text-xs">
							<div className="flex items-center text-muted-foreground line-clamp-1">
								<IconMapPin className="size-4" />
								{data.location}, {data.street}{" "}
								{data.streetNumber}
							</div>
						</div>
					</div>
					<div className="absolute hidding-block h-full right-0 t-0 w-16 bg-linear-to-r from-white/0 to-white group-hover:from-slate/0 group-hover:to-slate-50"></div>
				</div>
			</TableCell>

			{/* status */}
			<TableCell>
				<EventStatusBadge status={data.status} />
			</TableCell>

			{/* termin */}
			<TableCell>
				<EventDateLabel date={data.startsAt} />
			</TableCell>

			{/* sprzedaz */}
			<TableCell>
				<div className="count-participants">
					<div className="flex justify-between mb-1">
						<div className="counts text-muted-foreground gap-0.5 flex items-baseline items-baseaseline">
							<span className="font-medium text-black">{12}</span>
							<span className="text-xs">/</span>
							<span className="text-xs">{100}</span>
						</div>
						<div className="future-event-item__stats__percent font-medium">
							30%
						</div>
					</div>

					<Progress value={30} />
				</div>
			</TableCell>

			{/* akcje */}
			<TableCell className="text-right">
				<div className="flex justify-end">
					<Button variant="ghost" size="icon-sm">
						<IconEdit />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon-sm">
								<IconDots />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<IconEdit />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem>
									<IconShare />
									Share
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem variant="destructive">
									<IconTrash />
									Delete
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</TableCell>
		</TableRow>
	);
};

export default EventsTableRow;
