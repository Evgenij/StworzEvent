import { AddressType, Country, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const addressTemplates = [
	{
		type: AddressType.REGISTERED,
		street: "Marszałkowska",
		buildingNumber: "10A",
		zipCode: "00-001",
		city: "Warszawa",
		voivodeship: "Mazowieckie",
		country: Country.COUNTRY_PL,
	},
	{
		type: AddressType.BILLING,
		street: "Floriańska",
		buildingNumber: "3",
		zipCode: "31-019",
		city: "Kraków",
		voivodeship: "Małopolskie",
		country: Country.COUNTRY_PL,
	},
];

export const createOrganizationAddresses = async (prisma: PrismaClient) => {
	console.log("🔥 Creating organization addresses ---------------------");

	const organizations = await prisma.organization.findMany();

	for (const org of organizations) {
		for (const addressTemplate of addressTemplates) {
			const existing = await prisma.organizationAddress.findFirst({
				where: { organizationId: org.id, type: addressTemplate.type },
			});

			if (existing) continue;

			console.log(`➕ create address (${addressTemplate.type}) for org: ${org.slug}`);
			await prisma.organizationAddress.create({
				data: {
					id: uuidv4(),
					organizationId: org.id,
					...addressTemplate,
				},
			});
		}
	}
};
