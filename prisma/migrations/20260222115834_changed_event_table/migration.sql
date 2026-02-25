/*
  Warnings:

  - You are about to drop the column `createdAt` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `events` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starts_at` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizationId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "organizationId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "organization_id" TEXT NOT NULL,
ADD COLUMN     "starts_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
