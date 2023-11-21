/*
  Warnings:

  - You are about to drop the `Chatroom_password` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chatroom_password" DROP CONSTRAINT "Chatroom_password_chatroom_idx_fkey";

-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "room_password" TEXT;

-- DropTable
DROP TABLE "Chatroom_password";
