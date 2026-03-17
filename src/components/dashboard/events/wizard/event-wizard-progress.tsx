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
	path: (eventId: string) => string;
};

const STEPS: Step[] = [
	{
		number: 1,
		labelKey: "basicInfo",
		path: () => "", // шаг 1 — /new, не имеет eventId пути
	},
	{
		number: 2,
		labelKey: "details",
		path: (eventId) => `/profile/events/${eventId}/edit/details`,
	},
	{
		number: 3,
		labelKey: "tickets",
		path: (eventId) => `/profile/events/${eventId}/edit/tickets`,
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
		<div className="flex flex-col gap-3 w-full">
			{/* Шаги */}
			<div className="flex items-center justify-between">
				{STEPS.map((step, idx) => {
					const isDone = step.number < currentStep;
					const isActive = step.number === currentStep;
					const isLocked = step.number > currentStep;
					const href =
						step.number === 1
							? `/${locale}/profile/events/new`
							: eventId
								? `/${locale}${step.path(eventId)}`
								: null;

					const indicator = (
						<div
							className={cn(
								"flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
								isDone &&
									"border-primary bg-primary text-primary-foreground",
								isActive &&
									"border-primary bg-background text-primary",
								isLocked &&
									"border-muted-foreground/30 bg-background text-muted-foreground/50",
							)}
						>
							{isDone ? (
								<IconCheck className="size-3.5" />
							) : (
								step.number
							)}
						</div>
					);

					const label = (
						<span
							className={cn(
								"mt-1.5 text-center text-xs font-medium leading-tight",
								isActive && "text-foreground",
								isDone && "text-primary",
								isLocked && "text-muted-foreground/50",
							)}
						>
							{t(`steps.${step.labelKey}`)}
						</span>
					);

					const inner = (
						<div className="flex flex-col items-center gap-0.5">
							{indicator}
							{label}
						</div>
					);

					return (
						<div
							key={step.number}
							className="flex flex-1 flex-col items-center"
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

							{/* Линия между шагами */}
							{idx < STEPS.length - 1 && (
								<div
									className={cn(
										"absolute mt-3.5 h-0.5 w-full translate-x-1/2",
										step.number < currentStep
											? "bg-primary"
											: "bg-muted-foreground/20",
									)}
									style={{ width: "calc(100% - 2rem)" }}
								/>
							)}
						</div>
					);
				})}
			</div>

			{/* Прогресс бар */}
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-primary transition-all duration-500"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>

			{/* Подпись активного шага */}
			<p className="text-center text-xs text-muted-foreground">
				{t("stepOf", { current: currentStep, total: STEPS.length })} —{" "}
				<span className="font-medium text-foreground">
					{t(`steps.${STEPS[currentStep - 1].labelKey}`)}
				</span>
			</p>
		</div>
	);
}
