// src/components/dashboard/events/new-event-page-client.tsx
"use client";

import {
	CreateEventProvider,
	useCreateEventPreview,
} from "./create-event-context";
import { CreateEventForm } from "./create-event-form";
import { EventWizardProgress } from "./wizard/event-wizard-progress";
import { Separator } from "@/components/shadcn/ui/separator";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

function EventPreview() {
	const { preview } = useCreateEventPreview();

	if (!preview.title && !preview.location) {
		return (
			<p className="text-muted-foreground text-sm">
				Podgląd pojawi się tutaj
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{preview.coverImage && (
				<img
					src={preview.coverImage}
					alt=""
					className="aspect-video w-full rounded-lg object-cover"
				/>
			)}
			{preview.title && (
				<p className="text-lg font-semibold">{preview.title}</p>
			)}
			{preview.startsAt && (
				<p className="text-sm text-muted-foreground">
					{format(new Date(preview.startsAt), "d MMMM yyyy, HH:mm", {
						locale: pl,
					})}
				</p>
			)}
			{preview.location && (
				<p className="text-sm text-muted-foreground">
					📍 {preview.location}
					{preview.address ? `, ${preview.address}` : ""}
				</p>
			)}
		</div>
	);
}

export function NewEventPageClient() {
	return (
		<CreateEventProvider>
			<section className="flex gap-6 w-full">
				<main className="w-full flex flex-col gap-5">
					<EventWizardProgress currentStep={1} />
					<CreateEventForm />
				</main>
				<Separator orientation="vertical" className="self-stretch" />
				<aside className="w-1/3 max-w-100 sticky top-6 self-start">
					<EventPreview />
				</aside>
			</section>
		</CreateEventProvider>
	);
}
