-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFA_key" TEXT;
