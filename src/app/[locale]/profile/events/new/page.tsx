import { CreateEventForm } from "@/components/dashboard/events/create-event-form";
import { Typography } from "@/components/shared";

export default function NewEventPage() {
	return (
		<div className="new-event-page z-10 w-96 mx-auto flex flex-col gap-6">
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
