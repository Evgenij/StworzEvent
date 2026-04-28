import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = global as unknown as {
	prisma: ReturnType<typeof createPrismaClient>;
};

// Models that support soft delete (have deletedAt field)
type SoftDeleteModel = "user" | "order";

function addSoftDeleteFilter(args: Record<string, unknown>) {
	args.where = { deletedAt: null, ...(args.where as object) };
	return args;
}

function createPrismaClient() {
	const client = new PrismaClient({ adapter });

	return client.$extends({
		query: {
			user: {
				findMany({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				findFirst({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				findFirstOrThrow({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				count({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				aggregate({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
			},
			order: {
				findMany({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				findFirst({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				findFirstOrThrow({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				count({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
				aggregate({ args, query }) {
					return query(addSoftDeleteFilter(args) as typeof args);
				},
			},
		},
	});
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// Helper: soft delete instead of hard delete
export async function softDelete(
	model: SoftDeleteModel,
	where: Record<string, unknown>,
) {
	// @ts-expect-error — dynamic model access
	return prisma[model].update({
		where,
		data: { deletedAt: new Date() },
	});
}

// Helper: bulk soft delete
export async function softDeleteMany(
	model: SoftDeleteModel,
	where: Record<string, unknown>,
) {
	// @ts-expect-error — dynamic model access
	return prisma[model].updateMany({
		where,
		data: { deletedAt: new Date() },
	});
}

// Helper: restore soft-deleted record
export async function softRestore(
	model: SoftDeleteModel,
	where: Record<string, unknown>,
) {
	// @ts-expect-error — dynamic model access
	return prisma[model].update({
		where,
		data: { deletedAt: null },
	});
}

// Helper: query including soft-deleted records (e.g. for admin panel)
export function withDeleted<T extends object>(args: T): T & { where: { deletedAt?: unknown } } {
	return args as T & { where: { deletedAt?: unknown } };
}
