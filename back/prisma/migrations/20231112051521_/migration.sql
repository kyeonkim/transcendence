/*
  Warnings:

  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_chatroom_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatroom_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_mannager" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Manager";

-- DropTable
DROP TABLE "Message";
