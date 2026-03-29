"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
	EVENT_EDIT_ADDITIONAL_ROUTE,
	EVENT_EDIT_TICKETS_ROUTE,
} from "@/consts/routes";

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
		// path: (id) => `/profile/events/${id}/edit/additional`,
		path: (id) => EVENT_EDIT_ADDITIONAL_ROUTE(id),
	},
	{
		number: 3,
		labelKey: "tickets",
		description: "Ticket configuration",
		path: (id) => EVENT_EDIT_TICKETS_ROUTE(id),
	},
];

type Props = {
	currentStep: 1 | 2 | 3;
	maxStep?: number;
	eventId?: string;
	onStepClick?: (step: number) => void;
};

export function EventWizardProgress({
	currentStep,
	maxStep,
	eventId,
	onStepClick,
}: Props) {
	const t = useTranslations("EventWizard");
	const locale = useLocale();
	const reachedMax = maxStep ?? currentStep;

	return (
		<div className="flex gap-10 border-b border-border">
			{STEPS.map((step) => {
				const isDone = step.number < currentStep;
				const isActive = step.number === currentStep;
				const isLocked = step.number > reachedMax;
				const isReachable = !isActive && step.number <= reachedMax;
				const href =
					step.number === 1
						? `/${locale}/profile/events/new${eventId ? `?eventId=${eventId}` : ""}`
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
						{label}
						{description}
					</div>
				);

				return (
					<div
						key={step.number}
						className="flex flex-col items-center"
					>
						{isReachable && onStepClick ? (
							<button
								type="button"
								onClick={() => onStepClick(step.number)}
								className="flex flex-col items-center text-left"
							>
								{inner}
							</button>
						) : isDone && href ? (
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
