// src/components/dashboard/events/new-event-page-client.tsx
"use client";

import { useState } from "react";
import {
	CreateEventProvider,
	useCreateEventPreview,
} from "./create-event-context";
import { CreateEventForm } from "./create-event-form";
import { EventWizardProgress } from "./wizard/event-wizard-progress";
import { Separator } from "@/components/shadcn/ui/separator";
import EventPreview from "./event-preview";
import { Typography } from "@/components/shared";
import { StepAdditional } from "./wizard/step-additional";
import { StepTickets } from "./wizard/step-tickets";

const emptyAdditionalData = { sections: [], agenda: [], faq: [], map: null };

function NewEventPageInner() {
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
	const [eventId, setEventId] = useState<string | null>(null);
	const { preview } = useCreateEventPreview();

	const goToStep = (step: 1 | 2 | 3) => setCurrentStep(step);

	return (
		<div className="new-event-page flex flex-col gap-4">
			<Typography variant="h2">Nowe wydarzenie</Typography>
			<Separator />
			<EventWizardProgress
				currentStep={currentStep}
				eventId={eventId ?? undefined}
				onStepClick={(step) => goToStep(step as 1 | 2 | 3)}
			/>
			<section className="content flex gap-6 w-full">
				<main className="flex-1 flex flex-col gap-5 min-w-0">
					{currentStep === 1 && (
						<CreateEventForm
							onSuccess={(id) => {
								setEventId(id);
								goToStep(2);
							}}
						/>
					)}
					{currentStep === 2 && eventId && (
						<StepAdditional
							eventId={eventId}
							data={emptyAdditionalData}
							eventStartDate={
								preview.startsAt
									? new Date(preview.startsAt)
									: undefined
							}
							eventEndDate={
								preview.endsAt
									? new Date(preview.endsAt)
									: undefined
							}
							onBack={() => goToStep(1)}
							onNext={() => goToStep(3)}
						/>
					)}
					{currentStep === 3 && eventId && (
						<StepTickets
							eventId={eventId}
							initialTickets={[]}
							onBack={() => goToStep(2)}
						/>
					)}
				</main>
				<Separator orientation="vertical" className="self-stretch" />
				<aside className="w-90">
					<div className="flex flex-col gap-3 sticky top-18">
						<Typography variant="h4" className="text-base">
							Jak bedzie wygladac Twoj wydarzenie?
						</Typography>
						<EventPreview />
					</div>
				</aside>
			</section>
		</div>
	);
}

const NewEventPage = () => (
	<CreateEventProvider>
		<NewEventPageInner />
	</CreateEventProvider>
);

export default NewEventPage;
