import { EventStatus, Organization, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const createEvents = async (
	organization: Organization,
	prisma: PrismaClient,
) => {
	console.log("🔥 Creating events ---------------------");

	const allStatuses = Object.values(EventStatus) as EventStatus[];

	for (const [index, status] of allStatuses.entries()) {
		console.log(`➕ create event: event-id-${index + 1}`);
		await prisma.event.upsert({
			where: { id: `event-id-${index + 1}` },
			update: {}, // ничего не обновляем при нахождении
			create: {
				id: `event-id-${index + 1}`,
				organizationId: organization.id,
				title: `Test Event ${index + 1}`,
				startsAt: new Date(),
				status: status,
			},
		});
	}
};
