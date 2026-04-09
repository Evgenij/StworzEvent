// src/actions/events/get-event-additional.action.ts
"use server";

import { getEventAgendaAction } from "./agenda/get-event-agenda.action";
import { getEventFaqAction } from "./faq/get-event-faq.action";
import { getEventMapAction } from "./map/get-event-map.action";
import { getEventSectionsAction } from "./sections/get-event-sections.action";

export async function getEventAdditionalAction(eventId: string) {
	const [sections, agenda, faq, map] = await Promise.all([
		getEventSectionsAction(eventId),
		getEventAgendaAction(eventId),
		getEventFaqAction(eventId),
		getEventMapAction(eventId),
	]);

	return { sections, agenda, faq, map };
}

export type EventAdditionalData = Awaited<
	ReturnType<typeof getEventAdditionalAction>
>;
