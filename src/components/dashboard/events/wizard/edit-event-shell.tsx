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
				<div className="flex-1 min-w-0">{children}</div>
				<Separator orientation="vertical" className="self-stretch" />
				<aside className="w-90 flex flex-col gap-3 sticky top-18 self-start">
					<Typography variant="h4" className="text-base">
						Jak bedzie wygladac Twoj wydarzenie?
					</Typography>
					<EventPreview />
				</aside>
			</div>
		</CreateEventProvider>
	);
}
