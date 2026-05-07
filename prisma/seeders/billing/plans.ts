import { Currency, FeatureKey, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// Цены add-on в грошах (подписочная цена/мес как base price в Feature)
const featuresData: {
	featureKey: FeatureKey;
	name: string;
	description: string;
	price: number; // grosz/mies — cena à la carte (subscription)
}[] = [
	{
		featureKey: FeatureKey.QR_TICKETS,
		name: "Bilety QR",
		description: "Automatyczne generowanie biletów QR po opłaceniu zamówienia",
		price: 1900,
	},
	{
		featureKey: FeatureKey.TICKET_SCANNER,
		name: "Skaner biletów",
		description: "Mobilny interfejs do skanowania i weryfikacji biletów QR",
		price: 1900,
	},
	{
		featureKey: FeatureKey.SELF_CHECK_IN,
		name: "Self Check-in",
		description: "Wspólny kod QR do samodzielnego check-inu uczestników",
		price: 1400,
	},
	{
		featureKey: FeatureKey.RECEIPT_COLLECTION,
		name: "Zbieranie potwierdzeń",
		description: "Weryfikacja płatności przez przesłanie potwierdzenia przelewu",
		price: 1000,
	},
	{
		featureKey: FeatureKey.CUSTOM_FIELDS,
		name: "Własne pola formularza",
		description: "Dodatkowe pytania i pola w formularzu rejestracji uczestnika",
		price: 1200,
	},
	{
		featureKey: FeatureKey.PROMO_CODES,
		name: "Kody promocyjne",
		description: "Tworzenie i zarządzanie kodami zniżkowymi dla uczestników",
		price: 1500,
	},
	{
		featureKey: FeatureKey.EXPORT_DATA,
		name: "Eksport Excel / CSV",
		description: "Pobieranie listy uczestników i zamówień w formacie Excel lub CSV",
		price: 1000,
	},
	{
		featureKey: FeatureKey.WAITLIST,
		name: "Lista oczekujących",
		description: "Automatyczna lista rezerwowa gdy bilety się wyprzedają",
		price: 1000,
	},
	{
		featureKey: FeatureKey.RECURRING_EVENTS,
		name: "Powtarzające się wydarzenia",
		description: "Cykliczne wydarzenie z jedną konfiguracją (cotygodniowe, miesięczne)",
		price: 0,
	},
	{
		featureKey: FeatureKey.EMAIL_CAMPAIGNS,
		name: "Email do uczestników",
		description: "Wysyłka wiadomości e-mail do uczestników bezpośrednio z platformy",
		price: 1800,
	},
	{
		featureKey: FeatureKey.ANALYTICS,
		name: "Statystyki i wykresy",
		description: "Szczegółowa analityka sprzedaży, źródeł ruchu i zachowań uczestników",
		price: 2500,
	},
	{
		featureKey: FeatureKey.TEAM_MEMBERS,
		name: "Dostęp zespołu",
		description: "Dodatkowe konto członka zespołu z rolą i uprawnieniami",
		price: 2000,
	},
	{
		featureKey: FeatureKey.WHITE_LABEL,
		name: "White-label",
		description: "Strony wydarzeń bez brandingu platformy — tylko logo organizacji",
		price: 4900,
	},
	{
		featureKey: FeatureKey.API_ACCESS,
		name: "Dostęp do API",
		description: "Integracja z systemami zewnętrznymi przez REST API",
		price: 0,
	},
	{
		featureKey: FeatureKey.EMBED_WIDGET,
		name: "Widget osadzania",
		description: "Osadzenie formularza zakupu biletów na własnej stronie www",
		price: 0,
	},
	{
		featureKey: FeatureKey.PRIORITY_SUPPORT,
		name: "Priorytetowe wsparcie",
		description: "Dedykowana kolejka wsparcia z gwarantowanym czasem odpowiedzi",
		price: 0,
	},
	{
		featureKey: FeatureKey.DEDICATED_MANAGER,
		name: "Dedykowany opiekun",
		description: "Przydzielony opiekun konta do onboardingu i wsparcia operacyjnego",
		price: 0,
	},
];

const plansData = [
	{
		name: "Free",
		slug: "free",
		description: "Dla organizatorów stawiających pierwsze kroki — bez opłat",
		priceMonthly: 0,
		priceYearly: 0,
		maxEvents: 1,
		maxTeamMembers: 1,
		maxParticipantsPerEvent: 50,
		featureKeys: [] as FeatureKey[],
	},
	{
		name: "Starter",
		slug: "starter",
		description: "Dla regularnych organizatorów z rosnącą publicznością",
		priceMonthly: 7900,
		priceYearly: 71000,
		maxEvents: 5,
		maxTeamMembers: 1,
		maxParticipantsPerEvent: 300,
		featureKeys: [
			FeatureKey.QR_TICKETS,
			FeatureKey.TICKET_SCANNER,
			FeatureKey.RECEIPT_COLLECTION,
			FeatureKey.EXPORT_DATA,
		],
	},
	{
		name: "Pro",
		slug: "pro",
		description: "Dla aktywnych organizatorów i małych firm eventowych",
		priceMonthly: 17900,
		priceYearly: 161000,
		maxEvents: 20,
		maxTeamMembers: 2,
		maxParticipantsPerEvent: 1000,
		featureKeys: [
			FeatureKey.QR_TICKETS,
			FeatureKey.TICKET_SCANNER,
			FeatureKey.RECEIPT_COLLECTION,
			FeatureKey.EXPORT_DATA,
			FeatureKey.SELF_CHECK_IN,
			FeatureKey.CUSTOM_FIELDS,
			FeatureKey.PROMO_CODES,
			FeatureKey.WAITLIST,
			FeatureKey.RECURRING_EVENTS,
			FeatureKey.EMAIL_CAMPAIGNS,
			FeatureKey.ANALYTICS,
			FeatureKey.TEAM_MEMBERS,
		],
	},
	{
		name: "Business",
		slug: "business",
		description: "Pełna platforma dla profesjonalnych agencji eventowych",
		priceMonthly: 39900,
		priceYearly: 359000,
		maxEvents: null,
		maxTeamMembers: null,
		maxParticipantsPerEvent: null,
		featureKeys: Object.values(FeatureKey),
	},
];

export const createPlans = async (prisma: PrismaClient) => {
	console.log("🔥 Creating billing plans & features ---------------------");

	const featureMap = new Map<FeatureKey, string>();

	for (const featureData of featuresData) {
		console.log(`➕ create feature: ${featureData.featureKey}`);
		const feature = await prisma.feature.upsert({
			where: { featureKey: featureData.featureKey },
			update: {},
			create: {
				id: uuidv4(),
				...featureData,
				currency: Currency.PLN,
			},
		});
		featureMap.set(feature.featureKey as FeatureKey, feature.id);
	}

	for (const planData of plansData) {
		const { featureKeys, ...planFields } = planData;

		console.log(`➕ create plan: ${planFields.slug}`);
		const plan = await prisma.plan.upsert({
			where: { slug: planFields.slug },
			update: {},
			create: {
				id: uuidv4(),
				...planFields,
				currency: Currency.PLN,
			},
		});

		for (const featureKey of featureKeys) {
			const featureId = featureMap.get(featureKey);
			if (!featureId) continue;

			await prisma.planFeature.upsert({
				where: { planId_featureId: { planId: plan.id, featureId } },
				update: {},
				create: { planId: plan.id, featureId },
			});
		}
	}
};
