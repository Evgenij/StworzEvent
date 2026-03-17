"use client";

import { usePathname } from "next/navigation";
import { EventWizardProgress } from "./event-wizard-progress";

type Props = {
	eventId: string;
};

function getStepFromPathname(pathname: string): 1 | 2 | 3 {
	if (pathname.includes("/edit/tickets")) return 3;
	if (pathname.includes("/edit/details")) return 2;
	return 1;
}

export function EventWizardProgressWrapper({ eventId }: Props) {
	const pathname = usePathname();
	const currentStep = getStepFromPathname(pathname);

	return <EventWizardProgress currentStep={currentStep} eventId={eventId} />;
}
