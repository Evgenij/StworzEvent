"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconLoader2 } from "@tabler/icons-react";
import {
	EVENT_EDIT_ROUTE,
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
		path: (id) => EVENT_EDIT_ROUTE(id),
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
	eventId?: string;
	onStepClick?: (step: number) => void;
	loadingStep?: number | null;
	onNavigate?: (step: number) => void;
};

export function EventWizardProgress({
	currentStep,
	eventId,
	onStepClick,
	loadingStep,
	onNavigate,
}: Props) {
	const t = useTranslations("EventWizard");
	const locale = useLocale();

	return (
		<div className="flex border-b border-border">
			{STEPS.map((step) => {
				const isDone = step.number < currentStep;
				const isActive = step.number === currentStep;
				const isLocked = !eventId && step.number > 1;
				const isReachable = !isActive && !isLocked;

				const href = eventId
					? `/${locale}${step.path(eventId)}`
					: step.number === 1
						? `/${locale}/profile/events/new`
						: null;

				const label = (
					<h5
						className={cn(
							"font-medium text-start leading-tight",
							isActive && "text-foreground",
							isLocked && "text-muted-foreground/70",
						)}
					>
						{t(`steps.${step.labelKey}.title`)}
					</h5>
				);

				const isLoading = loadingStep === step.number;

				const description = (
					<p
						className={cn(
							"text-start text-sm text-muted-foreground",
							isLocked && "text-muted-foreground/70",
						)}
					>
						{isLoading ? (
							<div className="flex gap-1 items-center">
								<IconLoader2 className="animate-spin size-4"></IconLoader2>{" "}
								{t(`loading`)}
							</div>
						) : (
							t(`steps.${step.labelKey}.description`)
						)}
					</p>
				);

				const inner = (
					<div
						className={cn(
							"cursor-pointer flex flex-1 border-b-3 border-transparent flex-col justify-start items-start gap-0.5 p-3 rounded-t-xl w-full",
							{
								"border-b-3 border-primary": isActive,
								"hover:border-muted-foreground/10":
									!isActive && !isLocked,
								"hover:bg-muted": !isLocked,
							},
						)}
					>
						<div className="flex items-center gap-2">{label}</div>
						{description}
					</div>
				);

				return (
					<div
						key={step.number}
						className="flex flex-col items-center w-full"
					>
						{isReachable && onStepClick ? (
							<button
								type="button"
								onClick={() => {
									onStepClick(step.number);
								}}
								className="flex flex-col items-center text-left"
							>
								{inner}
							</button>
						) : isReachable && href ? (
							<Link
								href={href}
								onClick={() => onNavigate?.(step.number)}
								className="flex flex-col items-center w-full"
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
