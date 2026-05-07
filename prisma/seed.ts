import prisma from "@/lib/prisma";
import { createUsers } from "./seeders/users";
import { listOrganizers } from "@/mocks";
import { PrismaClient } from "@prisma/client";
import { createExtraUsers } from "./seeders/extra-users";
import { createPlans } from "./seeders/billing/plans";
import { createSubscriptions } from "./seeders/billing/subscriptions";
import { createOrganizationAddresses } from "./seeders/organization-addresses";

async function main() {
	console.info("🚀 Start seeding...");

	await prisma.$executeRawUnsafe(`
		ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "cancel_reason" TEXT
	`);

	// Очистка базы — TRUNCATE CASCADE обходит порядок FK автоматически
	await prisma.$executeRawUnsafe(`
		TRUNCATE TABLE
			refunds,
			payments,
			participants,
			order_items,
			orders,
			ticket_reservation_items,
			ticket_reservations,
			tickets,
			event_sections,
			event_agenda_items,
			event_faqs,
			event_categories_on_events,
			events,
			event_categories,
			organization_subscriptions,
			organization_features,
			organization_members,
			addresses,
			organizations,
			plan_features,
			features,
			plans,
			sessions,
			accounts,
			verifications,
			users,
			invitations
		RESTART IDENTITY CASCADE
	`);

	// INVITATIONS
	for (const invitation of listOrganizers) {
		await prisma.invitation.upsert({
			where: { email: invitation.email },
			update: {},
			create: invitation,
		});
	}

	// Regular USER accounts — создаются до событий, чтобы заказы на них ссылались
	await createExtraUsers(prisma as unknown as PrismaClient);

	// Admin + Organizer + Organizations + Events + Orders (+ всё связанное)
	await createUsers(prisma as unknown as PrismaClient);

	// Billing: Plans, Features, PlanFeatures
	await createPlans(prisma as unknown as PrismaClient);

	// Subscriptions и à-la-carte features для организаций
	await createSubscriptions(prisma as unknown as PrismaClient);

	// Адреса организаций
	await createOrganizationAddresses(prisma as unknown as PrismaClient);

	console.info("✅ Seeding finished");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
