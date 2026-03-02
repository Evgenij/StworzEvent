/*
  Warnings:

  - The primary key for the `plan_features` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feature_key` on the `plan_features` table. All the data in the column will be lost.
  - Added the required column `feature_id` to the `plan_features` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plan_features" DROP CONSTRAINT "plan_features_pkey",
DROP COLUMN "feature_key",
ADD COLUMN     "feature_id" TEXT NOT NULL,
ADD CONSTRAINT "plan_features_pkey" PRIMARY KEY ("plan_id", "feature_id");

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
