"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EventWizardProgress } from "./event-wizard-progress";

type Props = {
	eventId: string;
};

function getStepFromPathname(pathname: string): 1 | 2 | 3 {
	if (pathname.includes("/edit/tickets")) return 3;
	if (pathname.includes("/edit/additional")) return 2;
	return 1;
}

export function EventWizardProgressWrapper({ eventId }: Props) {
	const pathname = usePathname();
	const currentStep = getStepFromPathname(pathname);
	const [loadingStep, setLoadingStep] = useState<number | null>(null);

	useEffect(() => {
		setLoadingStep(null);
	}, [pathname]);

	return (
		<EventWizardProgress
			currentStep={currentStep}
			eventId={eventId}
			loadingStep={loadingStep}
			onNavigate={setLoadingStep}
		/>
	);
}
