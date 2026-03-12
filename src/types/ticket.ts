import { Ticket } from "@prisma/client";

export type TicketWithAvailability = Ticket & {
	available: number | null; // null = безлимитно
};
