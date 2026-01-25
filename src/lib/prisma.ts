// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

// Принудительно загружаем .env, если DATABASE_URL не виден
if (!process.env.DATABASE_URL) {
	dotenv.config();
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient =
	globalForPrisma.prisma || new PrismaClient();
// export const prisma: PrismaClient =
// 	globalForPrisma.prisma || new PrismaClient({accelerateUrl: process.env.DATABASE_URL});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;