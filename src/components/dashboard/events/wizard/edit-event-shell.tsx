"use client";

import { CreateEventProvider } from "@/components/dashboard/events/create-event-context";
import EventPreview from "@/components/dashboard/events/event-preview";
import { Typography } from "@/components/shared";
import { Separator } from "@/components/shadcn/ui/separator";
import type { CreateEventInput } from "@/schemas/create-event.schema";

type Props = {
	children: React.ReactNode;
	initialPreview: Partial<CreateEventInput>;
};

export function EditEventShell({ children, initialPreview }: Props) {
	return (
		<CreateEventProvider initialPreview={initialPreview}>
			<div className="flex gap-6 w-full">
				<div className="flex-1 w-3/5 min-w-0">{children}</div>
				<Separator
					orientation="vertical"
					className="self-stretch hidden xl:block w-90"
				/>
				<aside className="hidden xl:flex w-2/5 h-full flex-col gap-3 sticky top-18">
					<Typography variant="h4" className="text-base">
						Jak bedzie wygladac Twoj wydarzenie?
					</Typography>
					<div className="grid grid-cols-1 2xl:grid-cols-2 2xl:grid-rows-2 gap-3">
						<EventPreview />
						<div className="event-item rounded-xl bg-secondary/50"></div>
						<div className="event-item rounded-xl bg-secondary/50"></div>
						<div className="event-item rounded-xl bg-secondary/50"></div>
					</div>
				</aside>
			</div>
		</CreateEventProvider>
	);
}
