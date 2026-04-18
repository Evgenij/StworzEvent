// src/components/dashboard/events/wizard/step-additional.tsx
"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { SectionsEditor } from "@/components/dashboard/events/sections/sections-editor";
import { AgendaEditor } from "@/components/dashboard/events/agenda/agenda-editor";
import { FaqEditor } from "@/components/dashboard/events/faq/faq-editor";
import { EventMapEditor } from "@/components/dashboard/events/map/event-map-editor";
import type { EventAdditionalData } from "@/actions/events/get-event-additional.action";
import EditSectionWrapper from "../sections/edit-section-wrapper";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog";
import { useState } from "react";
import { deleteAgendaItemAction } from "@/actions/events/agenda/delete-agenda-item.action";
import { cn } from "@/lib/utils";

type Props = {
	eventId: string;
	data: EventAdditionalData;
	eventStartDate?: Date | string;
	eventEndDate?: Date | string;
	onBack?: () => void;
	onNext?: () => void;
};

export function StepAdditional({
	eventId,
	data,
	eventStartDate,
	eventEndDate,
	onBack,
	onNext,
}: Props) {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("EventWizard");

	const [agendaIsActive, setAgendaIsActive] = useState(true);
	const [agendaIsDeliting, setAgendaIsDeliting] = useState(false);
	const [showAgendaAlert, setShowAgendaAlert] = useState(false);

	const [sectionsIsActive, setSectionsIsActive] = useState(true);
	const [showSectionsAlert, setShowSectionsAlert] = useState(false);

	const [faqIsActive, setFaqIsActive] = useState(true);
	const [showFaqAlert, setShowFaqAlert] = useState(false);

	const handleChangeAgendaActive = (val: boolean) => {
		// Отключают И есть элементы → показываем алерт
		if (!val && data.agenda.length > 0) {
			setShowAgendaAlert(true);
			return;
		}
		setAgendaIsActive(val);
	};

	const handleChangeSectionsActive = (val: boolean) => {
		// console.log(val);

		setSectionsIsActive(val);
	};

	const handleChangeFaqActive = (val: boolean) => {
		// console.log(val);

		setFaqIsActive(val);
	};

	const handleConfirmDisableAgenda = async () => {
		setAgendaIsActive(false);
		setAgendaIsDeliting(true);
		for (const item of data.agenda) {
			await deleteAgendaItemAction(item.id);
		}
		setAgendaIsDeliting(false);
		setShowAgendaAlert(false);
	};

	return (
		<div className="flex flex-col">
			{/* Агенда */}
			{eventId}
			<EditSectionWrapper
				countItems={data.agenda.length}
				active={agendaIsActive}
				title={
					agendaIsDeliting ? "Usuwanie agendy..." : t("agenda.title")
				}
				onCheckedChange={handleChangeAgendaActive}
				className={cn("", { "opacity-50": agendaIsDeliting })}
			>
				<AgendaEditor
					eventId={eventId}
					initialItems={data.agenda}
					startDate={eventStartDate}
					endDate={eventEndDate}
				/>
			</EditSectionWrapper>

			<EditSectionWrapper
				countItems={data.sections.length}
				active={sectionsIsActive}
				title={t("sections.addSections")}
				onCheckedChange={handleChangeSectionsActive}
			>
				<SectionsEditor
					eventId={eventId}
					initialSections={data.sections}
				/>
			</EditSectionWrapper>

			<EditSectionWrapper
				countItems={data.faq.length}
				active={faqIsActive}
				title={t("faq.title")}
				onCheckedChange={handleChangeFaqActive}
				className="border-none"
			>
				<FaqEditor eventId={eventId} initialItems={data.faq} />
			</EditSectionWrapper>

			{/* FAQ */}
			{/* <section className="flex flex-col gap-3">
				<h3 className="text-base font-semibold">{t("faq.title")}</h3>
				<FaqEditor eventId={eventId} initialItems={data.faq} />
			</section>

			<Separator /> */}

			{/* Алерт подтверждения — управляется через open/onOpenChange */}
			<AlertDialog
				open={showAgendaAlert}
				onOpenChange={setShowAgendaAlert}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("agenda.disableTitle")}
						</AlertDialogTitle>
						<AlertDialogDescription className="flex flex-col gap-2">
							{t("agenda.disableDescriptionMain")}
							<Separator />
							<p className="text-foreground">
								{t("agenda.disableDescriptionSecondary")}
							</p>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							{t("agenda.disableCancel")}
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmDisableAgenda}>
							{t("agenda.disableConfirm")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Навигация */}
			<div className="navigation flex gap-2 justify-end pt-4 border-t border-border">
				<Button
					type="button"
					variant="outline"
					onClick={() =>
						onBack
							? onBack()
							: router.push(
									`/${locale}/profile/events/new?eventId=${eventId}`,
								)
					}
				>
					<IconArrowLeft className="size-4" />
					{t("tickets.back")}
				</Button>
				<Button
					type="button"
					onClick={() =>
						onNext
							? onNext()
							: router.push(
									`/${locale}/profile/events/${eventId}/edit/tickets`,
								)
					}
				>
					{t("tickets.next")}
					<IconArrowRight className="size-4" />
				</Button>
			</div>
		</div>
	);
}
