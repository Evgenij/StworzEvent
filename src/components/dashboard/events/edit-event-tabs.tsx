"use client";

import { useState } from "react";
import { StepAdditional } from "./wizard/step-additional";
import { StepTickets } from "./wizard/step-tickets";
import { EventWizardProgress } from "./wizard/event-wizard-progress";
import { CreateEventProvider } from "./create-event-context";
import EventPreview from "./event-preview";
import { Typography } from "@/components/shared";
import { Separator } from "@/components/shadcn/ui/separator";
import type { EventAdditionalData } from "@/actions/events/get-event-additional.action";
import type { EventTicket } from "@/actions/tickets/get-event-tickets.action";
import { StepBasicData } from "./wizard/step-basic-data";
import { CreateEventInput } from "@/schemas/create-event.schema";

type Props = {
	eventId: string;
	initialAdditionalData: EventAdditionalData;
	initialTickets: EventTicket[];
	initialPreview: Partial<CreateEventInput>;
	eventStartDate?: Date;
	eventEndDate?: Date;
};

export function EditEventTabs({
	eventId,
	initialAdditionalData,
	initialTickets,
	initialPreview,
	eventStartDate,
	eventEndDate,
}: Props) {
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

	const initialMinPrice =
		initialTickets.length > 0
			? Math.min(...initialTickets.map((t) => t.price)) * 100
			: null;

	return (
		<CreateEventProvider initialPreview={initialPreview} initialMinPrice={initialMinPrice}>
			<div className="flex gap-6 w-full">
				<div className="flex-1 min-w-0 flex flex-col gap-5">
					<EventWizardProgress
						currentStep={currentStep}
						eventId={eventId}
						onStepClick={(step) =>
							setCurrentStep(step as 1 | 2 | 3)
						}
					/>

					{currentStep === 1 && (
						<StepBasicData
							eventId={eventId}
							onSuccess={() => setCurrentStep(2)}
						/>
					)}

					{currentStep === 2 && (
						<StepAdditional
							eventId={eventId}
							data={initialAdditionalData}
							eventStartDate={eventStartDate}
							eventEndDate={eventEndDate}
						/>
					)}

					{currentStep === 3 && (
						<StepTickets
							eventId={eventId}
							initialTickets={initialTickets}
						/>
					)}
				</div>

				<Separator
					orientation="vertical"
					className="self-stretch hidden xl:block"
				/>

				<aside className="hidden xl:flex  2xl:w-2/5 xl:w-1/3 h-full flex-col gap-3 sticky top-18">
					<Typography
						variant="h4"
						className="text-sm text-muted-foreground"
					>
						Podglad wydarzenia
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
