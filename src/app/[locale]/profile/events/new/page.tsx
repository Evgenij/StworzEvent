import { CreateEventForm } from "@/components/dashboard/events/create-event-form";
import { EventWizardProgress } from "@/components/dashboard/events/wizard/event-wizard-progress";
import { Separator } from "@/components/shadcn/ui/separator";
import { PageHeader } from "@/features/layout";
import React from "react";

const NewEventPage = () => {
	return (
		<div className="flex w-full flex-col gap-6">
			<EventWizardProgress currentStep={1} />
			<section className="flex gap-6 w-full">
				<div className="w-2/3">
					<CreateEventForm />
				</div>
				<Separator orientation="vertical" className="self-stretch" />
				<div className="w-1/3 sticky top-6 self-start">
					<p className="text-muted-foreground text-sm">
						Podgląd pojawi się tutaj
					</p>
				</div>
			</section>
		</div>
	);
};

export default NewEventPage;
