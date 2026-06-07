import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateTimeFormatter } from "@/helpers/date";
import { cn } from "@/lib/utils";

const monthAbbr: Record<string, string> = {
	styczeń: "sty",
	luty: "lut",
	marzec: "mar",
	kwiecień: "kwi",
	maj: "maj",
	czerwiec: "cze",
	lipiec: "lip",
	sierpień: "sie",
	wrzesień: "wrz",
	październik: "paź",
	listopad: "lis",
	grudzień: "gru",
};

const EventDateLabel = ({
	className,
	date,
}: {
	className?: string;
	date: Date | string;
}) => {
	const lastDate: boolean = new Date(date) < new Date();

	return (
		<div className="event-date-label flex gap-2 items-center">
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							" size-12 rounded-lg flex flex-col items-center justify-center font-medium text-primary border",
							lastDate
								? "bg-muted border-border text-muted-foreground"
								: "bg-primary/10 border-primary/30",
							className,
						)}
					>
						<p className="font-bold text-lg leading-none">
							{DateTimeFormatter.day(new Date(date))}
						</p>
						<span className="text-xs line-clamp-1 w-full text-center">
							{monthAbbr[
								DateTimeFormatter.month(new Date(date), "pl")
							] ?? DateTimeFormatter.month(new Date(date), "pl")}
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					{DateTimeFormatter.date(new Date(date), "pl")}{" "}
					{DateTimeFormatter.year(new Date(date), "pl")}
				</TooltipContent>
			</Tooltip>

			<div className="time flex flex-col gap-0.5 text-xs ">
				<p className="capitalize font-medium">
					{DateTimeFormatter.weekday(new Date(date), "pl")}
					{" · "}
					<span className="opacity-80">
						{DateTimeFormatter.time(new Date(date), "pl")}
					</span>
				</p>
				{!lastDate && (
					<span className="text-primary font-medium">za 3 dni</span>
				)}
			</div>
		</div>
	);
};

export default EventDateLabel;
