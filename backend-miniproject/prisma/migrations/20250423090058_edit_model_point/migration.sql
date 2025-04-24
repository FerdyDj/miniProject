/*
  Warnings:

  - You are about to drop the column `desc` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Point` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Point" DROP COLUMN "desc",
DROP COLUMN "points",
DROP COLUMN "type",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "TransType";
