import { Ticket } from "@prisma/client";

export type FlatParticipant = {
	ticket: Ticket;
	idxInTicket: number;
	totalInGroup: number;
	globalIdx: number;
	groupIdx: number;
	participantIdx: number;
};
