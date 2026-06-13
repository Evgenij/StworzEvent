/*
  Warnings:

  - The values [REVIEW,BLOCKED] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `default_payment_instructions` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('DRAFT', 'UNPUBLISHED', 'PUBLISHED', 'SALES_OPEN', 'SALES_PAUSED', 'SALES_CLOSED', 'LIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED');
ALTER TABLE "public"."events" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "events" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "public"."EventStatus_old";
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "default_payment_instructions";
