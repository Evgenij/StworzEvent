/*
  Warnings:

  - You are about to drop the column `banExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `banReason` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE', 'UNPAID');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF', 'FINANCE', 'VIEWER', 'SUPPORT', 'MARKETING', 'API_CLIENT');

-- CreateEnum
CREATE TYPE "FeatureKey" AS ENUM ('CREATE_EVENTS', 'SELL_TICKETS', 'ANALYTICS', 'CUSTOM_BRANDING', 'TEAM_MEMBERS', 'API_ACCESS', 'NO_PLATFORM_FEE', 'IMPORT_DB_USERS');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'SALES_OPEN', 'SALES_PAUSED', 'SALES_CLOSED', 'LIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED', 'BLOCKED', 'UNPUBLISHED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PENDING', 'REQUIRES_ACTION', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('PLN', 'USD', 'EUR', 'UAH');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "banExpires",
DROP COLUMN "banReason",
DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "role",
DROP COLUMN "updatedAt",
ADD COLUMN     "ban_expires" TIMESTAMP(3),
ADD COLUMN     "ban_reason" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_role" "UserRole" NOT NULL DEFAULT 'USER';
