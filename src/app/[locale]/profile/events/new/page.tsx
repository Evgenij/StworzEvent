import { CreateEventForm } from "@/components/dashboard/events/create-event-form";
import { Typography } from "@/components/shared";

export default function NewEventPage() {
	return (
		<div className="new-event-page z-10 w-lg mx-auto flex flex-col gap-7 py-5">
			<header className="flex items-start gap-1">
				<div className="mt-1">✨</div>
				<div className="wrapp">
					<Typography variant="h2"> Nowe wydarzenie</Typography>
					<span className="text-sm text-muted-foreground">
						Tylko najważniejsze – resztę dodasz później
					</span>
				</div>
			</header>

			<CreateEventForm />
		</div>
	);
}
