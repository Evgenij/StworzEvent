import { EVENT_DATA_ROUTE, EVENT_PAGE_ROUTE } from "@/config/routes";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import { IconMapPin } from "@tabler/icons-react";
import Image from "next/image";

const EventName = ({
	className,
	data,
}: {
	className?: string;
	data: {
		id: string;
		coverImage: string;
		title: string;
		location: string;
		street: string;
		streetNumber: string;
		categories: { category: { name: string } }[];
	};
}) => {
	return (
		<div
			className={cn(
				"event-name flex gap-3 items-center min-w-0 relative font-medium",
				className,
			)}
		>
			<Image
				src={data.coverImage || "/placeholder.jpg"}
				alt={data.coverImage || "Event cover"}
				className="w-auto h-14 aspect-video object-cover rounded-md border border-border shrink-0"
				width={0}
				height={0}
			/>
			<div className="flex flex-col gap-1 min-w-0 overflow-hidden">
				<Link href={EVENT_DATA_ROUTE(data.id)} className="no-underline">
					<Typography
						variant="h4"
						className="text-sm font-medium line-clamp-1 hover:underline"
					>
						{data.title}
					</Typography>
				</Link>

				<div className="flex gap-1 text-xs text-muted-foreground">
					<div className="flex items-center line-clamp-1">
						<IconMapPin className="size-4" />
						{data.location}, {data.street} {data.streetNumber}
					</div>
					-
					{data.categories.length > 0 && (
						<span className="line-clamp-1 font-medium text-primary">
							{data.categories
								.map((c) => c.category.name)
								.join(", ")}
						</span>
					)}
				</div>
			</div>
			<div className="absolute hidding-block h-full right-0 t-0 w-16 bg-linear-to-r from-white/0 to-white group-hover:from-slate/0 group-hover:to-slate-50"></div>
		</div>
	);
};

export default EventName;
