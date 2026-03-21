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

type Props = {
	eventId: string;
	data: EventAdditionalData;
};

export function StepAdditional({ eventId, data }: Props) {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("EventWizard");

	return (
		<div className="flex flex-col gap-8">
			{/* Агенда */}
			<section className="flex flex-col gap-3">
				<h3 className="text-base font-semibold">{t("agenda.title")}</h3>
				<AgendaEditor eventId={eventId} initialItems={data.agenda} />
			</section>

			<Separator />

			{/* Секции */}
			<section className="flex flex-col gap-3">
				<h3 className="text-base font-semibold">
					{t("sections.addSection")}
				</h3>
				<SectionsEditor
					eventId={eventId}
					initialSections={data.sections}
				/>
			</section>

			<Separator />

			{/* FAQ */}
			<section className="flex flex-col gap-3">
				<h3 className="text-base font-semibold">{t("faq.title")}</h3>
				<FaqEditor eventId={eventId} initialItems={data.faq} />
			</section>

			<Separator />

			{/* Карта */}
			<section className="flex flex-col gap-3">
				<h3 className="text-base font-semibold">{t("map.showMap")}</h3>
				<EventMapEditor eventId={eventId} initialData={data.map} />
			</section>

			<Separator />

			{/* Навигация */}
			<div className="flex justify-between">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(`/${locale}/profile/events/new`)}
				>
					<IconArrowLeft className="mr-2 size-4" />
					{t("tickets.back")}
				</Button>
				<Button
					type="button"
					onClick={() =>
						router.push(
							`/${locale}/profile/events/${eventId}/edit/tickets`,
						)
					}
				>
					{t("tickets.next")}
					<IconArrowRight className="ml-2 size-4" />
				</Button>
			</div>
		</div>
	);
}
