/*
  Warnings:

  - You are about to drop the column `inviteExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `inviteToken` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_inviteToken_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "inviteExpires",
DROP COLUMN "inviteToken";
