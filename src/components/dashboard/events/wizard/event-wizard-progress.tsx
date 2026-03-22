"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";

type Step = {
	number: number;
	labelKey: string;
	description: string;
	path: (eventId: string) => string;
};

const STEPS: Step[] = [
	{
		number: 1,
		labelKey: "basicInfo",
		description: "Basic event information",
		path: () => "",
	},
	{
		number: 2,
		labelKey: "additional",
		description: "Additional event information",
		path: (id) => `/profile/events/${id}/edit/additional`,
	},
	{
		number: 3,
		labelKey: "tickets",
		description: "Ticket configuration",
		path: (id) => `/profile/events/${id}/edit/tickets`,
	},
];

type Props = {
	currentStep: 1 | 2 | 3;
	eventId?: string;
};

export function EventWizardProgress({ currentStep, eventId }: Props) {
	const t = useTranslations("EventWizard");
	const locale = useLocale();
	const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

	return (
		<div className="flex gap-10 border-b border-border">
			{STEPS.map((step) => {
				const isDone = step.number < currentStep;
				const isActive = step.number === currentStep;
				const isLocked = step.number > currentStep;
				const href =
					step.number === 1
						? `/${locale}/profile/events/new`
						: eventId
							? `/${locale}${step.path(eventId)}`
							: null;

				const label = (
					<h5
						className={cn(
							"font-medium text-start leading-tight",
							isActive && "text-foreground",
							isDone && "text-primary",
							isLocked && "text-muted-foreground/70",
						)}
					>
						{t(`steps.${step.labelKey}.title`)}
					</h5>
				);

				const description = (
					<p
						className={cn(
							"text-start text-sm",
							isActive && "text-muted-foreground",
							isDone && "text-primary",
							isLocked && "text-muted-foreground/70",
						)}
					>
						{t(`steps.${step.labelKey}.description`)}
					</p>
				);

				const inner = (
					<div
						className={cn(
							"flex flex-col justify-start items-start gap-0.5 pb-3",
							{
								"border-b-3 border-primary": isActive,
							},
						)}
					>
						{/* {indicator} */}
						{label}
						{description}
					</div>
				);

				return (
					<div
						key={step.number}
						className="flex flex-col items-center"
					>
						{/* Кликабелен только если шаг пройден и есть href */}
						{isDone && href ? (
							<Link
								href={href}
								className="flex flex-col items-center"
							>
								{inner}
							</Link>
						) : (
							inner
						)}
					</div>
				);
			})}
		</div>
	);
}
