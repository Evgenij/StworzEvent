import prisma from "@/lib/prisma";
import { createUsers } from "./seeders/users";
import { listOrganizers } from "@/mocks";
import { createOrganizations } from "./seeders/organizations";

async function main() {
	console.info("🚀 Start seeding...");

	// Очистка базы (опционально, но полезно при разработке)
	await prisma.event.deleteMany();
	await prisma.organizationMember.deleteMany();
	await prisma.user.deleteMany();
	await prisma.organization.deleteMany();
	await prisma.eventSection.deleteMany();
	await prisma.eventFaq.deleteMany();

	// INVITATIONS
	for (const invitation of listOrganizers) {
		await prisma.invitation.upsert({
			where: { email: invitation.email },
			update: {},
			create: invitation,
		});
	}

	await createUsers(prisma);

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
