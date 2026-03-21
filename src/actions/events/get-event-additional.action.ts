// src/actions/events/get-event-additional.action.ts
"use server";

import { getEventAgenda } from "./agenda/get-event-agenda.action";
import { getEventFaq } from "./faq/get-event-faq.action";
import { getEventMap } from "./map/get-event-map.action";
import { getEventSections } from "./sections/get-event-sections.action";

export async function getEventAdditional(eventId: string) {
	const [sections, agenda, faq, map] = await Promise.all([
		getEventSections(eventId),
		getEventAgenda(eventId),
		getEventFaq(eventId),
		getEventMap(eventId),
	]);

	return { sections, agenda, faq, map };
}

export type EventAdditionalData = Awaited<
	ReturnType<typeof getEventAdditional>
>;
