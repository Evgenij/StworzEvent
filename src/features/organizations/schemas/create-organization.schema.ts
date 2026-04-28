import { LegalForm, VatStatus } from "@prisma/client";
import { z } from "zod";

export const createOrganizationSchema = (t: (key: string) => string) =>
	z.object({
		name: z.string().min(1, t("required")),
		nip: z.string().regex(/^\d{10}$/, t("nipInvalid")),
		email: z.string().min(1, t("required")).email(t("emailInvalid")),
		phone: z.string().min(11, t("phoneInvalid")),
		legalForm: z.enum(
			[
				LegalForm.OSOBA_FIZYCZNA,
				LegalForm.JEDNOOSOBOWA_DG,
				LegalForm.SP_ZOO,
				LegalForm.SA,
				LegalForm.SP_JAWNA,
				LegalForm.SP_PARTNERSKA,
				LegalForm.SP_KOMANDYTOWA,
				LegalForm.SP_KOMANDYTOWO_AKCYJNA,
				LegalForm.STOWARZYSZENIE,
				LegalForm.FUNDACJA,
				LegalForm.SPOLDZIELNIA,
				LegalForm.INNE,
			],
			t("required"),
		),
		vatStatus: z.enum(
			[VatStatus.ACTIVE, VatStatus.EXEMPT, VatStatus.UNREGISTERED],
			t("required"),
		),
		address: z.object({
			street: z.string().min(1, t("required")),
			buildingNumber: z.string().min(1, t("required")),
			zipCode: z.string().regex(/^\d{2}-\d{3}$/, t("zipInvalid")),
			city: z.string().min(1, t("required")),
		}),
	});

export type CreateOrganizationInput = z.infer<
	ReturnType<typeof createOrganizationSchema>
>;

export const createOrganizationServerSchema = createOrganizationSchema(
	(key) => key,
);
