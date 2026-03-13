// helpers/build-flat-list.ts
import { Ticket } from "@prisma/client";
import { SelectedTicket } from "@/components/events/tickets/tickets-drawer";

export type FlatParticipant = {
	ticket: Ticket;
	idxInTicket: number;
	globalIdx: number;
	groupIdx: number;
	participantIdx: number;
};

export const buildFlatList = (items: SelectedTicket[]): FlatParticipant[] => {
	const flat: FlatParticipant[] = [];
	let globalIdx = 1;
	items.forEach((item, groupIdx) => {
		for (let pi = 0; pi < item.quantity; pi++) {
			flat.push({
				ticket: item.ticket,
				idxInTicket: pi + 1,
				globalIdx: globalIdx++,
				groupIdx,
				participantIdx: pi,
			});
		}
	});
	return flat;
};
