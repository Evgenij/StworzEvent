import { FeatureKey, PlanInterval, PrismaClient, SubscriptionStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const createSubscriptions = async (prisma: PrismaClient) => {
	console.log("🔥 Creating organization subscriptions & features ---------------------");

	const organizations = await prisma.organization.findMany();
	const proPlan = await prisma.plan.findUnique({ where: { slug: "pro" } });
	const freePlan = await prisma.plan.findUnique({ where: { slug: "free" } });

	if (!proPlan || !freePlan) {
		console.warn("⚠️  Plans not found — run createPlans first");
		return;
	}

	const apiFeature = await prisma.feature.findUnique({
		where: { featureKey: FeatureKey.API_ACCESS },
	});
	const whiteLabelFeature = await prisma.feature.findUnique({
		where: { featureKey: FeatureKey.WHITE_LABEL },
	});

	const now = new Date();
	const periodEnd = new Date(now);
	periodEnd.setMonth(periodEnd.getMonth() + 1);

	for (const [index, org] of organizations.entries()) {
		const plan = index === 0 ? proPlan : freePlan;

		console.log(`➕ create subscription for org: ${org.slug} → ${plan.slug}`);
		await prisma.organizationSubscription.upsert({
			where: { lsSubscriptionId: `seed-sub-${org.id}` },
			update: {},
			create: {
				id: uuidv4(),
				organizationId: org.id,
				planId: plan.id,
				status: SubscriptionStatus.ACTIVE,
				interval: PlanInterval.MONTHLY,
				currentPeriodStart: now,
				currentPeriodEnd: periodEnd,
				lsSubscriptionId: `seed-sub-${org.id}`,
				lsCustomerId: `seed-customer-${org.id}`,
			},
		});

		// Первая орг дополнительно покупает API_ACCESS à la carte
		if (index === 0 && apiFeature) {
			console.log(`➕ create org feature: API_ACCESS for ${org.slug}`);
			await prisma.organizationFeature.upsert({
				where: {
					org_feature_unique: { organizationId: org.id, featureId: apiFeature.id },
				},
				update: {},
				create: {
					id: uuidv4(),
					organizationId: org.id,
					featureId: apiFeature.id,
					lsOrderId: `seed-order-api-${org.id}`,
					lsOrderItemId: `seed-item-api-${org.id}`,
				},
			});
		}

		// Вторая орг (если есть) покупает WHITE_LABEL à la carte
		if (index === 1 && whiteLabelFeature) {
			console.log(`➕ create org feature: WHITE_LABEL for ${org.slug}`);
			await prisma.organizationFeature.upsert({
				where: {
					org_feature_unique: { organizationId: org.id, featureId: whiteLabelFeature.id },
				},
				update: {},
				create: {
					id: uuidv4(),
					organizationId: org.id,
					featureId: whiteLabelFeature.id,
					lsOrderId: `seed-order-wl-${org.id}`,
					lsOrderItemId: `seed-item-wl-${org.id}`,
				},
			});
		}
	}
};
