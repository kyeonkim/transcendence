/*
  Warnings:

  - You are about to drop the column `is_mannager` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_mannager",
ADD COLUMN     "is_manager" BOOLEAN NOT NULL DEFAULT false;
