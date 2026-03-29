// src/components/dashboard/events/new-event-page-client.tsx
"use client";

import { useState } from "react";
import { CreateEventProvider } from "./create-event-context";
import { CreateEventForm } from "./create-event-form";
import { EventWizardProgress } from "./wizard/event-wizard-progress";
import { Separator } from "@/components/shadcn/ui/separator";
import EventPreview from "./event-preview";
import { Typography } from "@/components/shared";
import { StepAdditional } from "./wizard/step-additional";
import { StepTickets } from "./wizard/step-tickets";
import { useSearchParams } from "next/navigation";

const emptyAdditionalData = { sections: [], agenda: [], faq: [], map: null };

const NewEventPage = () => {
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
	const [maxStep, setMaxStep] = useState<number>(1);

	const searchParams = useSearchParams();
	const [eventId, setEventId] = useState<string | null>(
		searchParams.get("eventId") ?? null,
	);

	const goToStep = (step: 1 | 2 | 3) => {
		setCurrentStep(step);
		if (step > maxStep) setMaxStep(step);
	};

	const stepTitles: Record<1 | 2 | 3, string> = {
		1: "Nowe wydarzenie",
		2: "Dodaj media i agendę",
		3: "Konfiguracja biletów",
	};

	return (
		<CreateEventProvider>
			<div className="flex flex-col gap-4">
				<Typography variant="h2">{stepTitles[currentStep]}</Typography>
				<Separator />
				<section className="flex gap-6 w-full">
					<main className="flex-1 flex flex-col gap-5 min-w-0">
						<EventWizardProgress
							currentStep={currentStep}
							maxStep={maxStep}
							onStepClick={(step) => goToStep(step as 1 | 2 | 3)}
						/>
						{currentStep === 1 && (
							<CreateEventForm
								key={eventId ?? "new"}
								eventId={eventId ?? undefined}
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
					<Separator
						orientation="vertical"
						className="self-stretch"
					/>
					<aside className="w-90 shrink-0 flex flex-col gap-3 self-start sticky top-18">
						<Typography variant="h4" className="text-base">
							Jak bedzie wygladac Twoj wydarzenie?
						</Typography>
						<EventPreview />
					</aside>
				</section>
			</div>
		</CreateEventProvider>
	);
};

export default NewEventPage;
