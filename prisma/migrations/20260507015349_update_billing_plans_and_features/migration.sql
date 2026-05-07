/*
  Warnings:

  - The values [CREATE_EVENTS,SELL_TICKETS,CUSTOM_BRANDING,NO_PLATFORM_FEE,IMPORT_DB_USERS] on the enum `FeatureKey` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CoinTxType" AS ENUM ('EARNED_EVENT_CREATED', 'EARNED_PARTICIPANT', 'EARNED_ORDER_PAID', 'EARNED_SUBSCRIPTION_RENEWED', 'EARNED_REFERRAL', 'EARNED_FEATURE_USED', 'EARNED_PROFILE_COMPLETED', 'SPENT_ADDON', 'EXPIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "FeatureKey_new" AS ENUM ('QR_TICKETS', 'TICKET_SCANNER', 'SELF_CHECK_IN', 'RECEIPT_COLLECTION', 'CUSTOM_FIELDS', 'PROMO_CODES', 'EXPORT_DATA', 'WAITLIST', 'RECURRING_EVENTS', 'EMAIL_CAMPAIGNS', 'ANALYTICS', 'TEAM_MEMBERS', 'WHITE_LABEL', 'API_ACCESS', 'EMBED_WIDGET', 'PRIORITY_SUPPORT', 'DEDICATED_MANAGER');
ALTER TABLE "features" ALTER COLUMN "feature_key" TYPE "FeatureKey_new" USING ("feature_key"::text::"FeatureKey_new");
ALTER TYPE "FeatureKey" RENAME TO "FeatureKey_old";
ALTER TYPE "FeatureKey_new" RENAME TO "FeatureKey";
DROP TYPE "public"."FeatureKey_old";
COMMIT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "reminder_sent_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "max_participants_per_event" INTEGER;
