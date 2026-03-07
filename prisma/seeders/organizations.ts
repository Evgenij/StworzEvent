import { MemberRole, PrismaClient, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { createEvents } from "./events";

export const createOrganizations = async (
	organizer: User,
	prisma: PrismaClient,
) => {
	console.log("🔥 Creating organizations ---------------------");

	console.log("➕ create organization");
	const organization = await prisma.organization.upsert({
		where: { slug: "test-organization-1" },
		update: {}, // ничего не обновляем при нахождении
		create: {
			id: uuidv4(), // или можно оставить "evgeniu.ermolenko@gmail.com" если хотите
			name: "Test Organization #1", // ← ОБЯЗАТЕЛЬНОЕ уникальное поле
			slug: "test-organization-1", // ← ОБЯЗАТЕЛЬНОЕ уникальное поле
			email: "evgeniu.ermolenko@gmail.com", // официальный email организации
			nip: null,
			regon: null,
			krs: null,
			legalForm: "osoba fizyczna", // наиболее вероятный вариант для физлица-организатора
			vatStatus: "ACTIVE",
			ksefEnabled: false,
			website: null,
			phone: null,
		},
	});

	console.log("➕ create organization_members");
	await prisma.organizationMember.upsert({
		where: {
			user_organization_unique: {
				userId: organizer.id,
				organizationId: organization.id,
			},
		},
		update: {},
		create: {
			id: uuidv4(),
			userId: organizer.id,
			organizationId: organization.id,
			memberRole: MemberRole.OWNER,
		},
	});

	await createEvents(organization, prisma);
};
