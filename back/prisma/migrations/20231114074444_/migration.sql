/*
  Warnings:

  - You are about to drop the column `is_manger` on the `Chatroom_user` table. All the data in the column will be lost.
  - You are about to drop the column `is_owner` on the `Chatroom_user` table. All the data in the column will be lost.
  - Added the required column `user_nickname` to the `Chatroom_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatroom_user" DROP COLUMN "is_manger",
DROP COLUMN "is_owner",
ADD COLUMN     "is_manager" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_nickname" TEXT NOT NULL;
