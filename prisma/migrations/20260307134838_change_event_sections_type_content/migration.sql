/*
  Warnings:

  - The `content` column on the `event_sections` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "event_sections" DROP COLUMN "content",
ADD COLUMN     "content" JSONB;
