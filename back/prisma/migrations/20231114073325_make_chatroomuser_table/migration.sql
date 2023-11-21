/*
  Warnings:

  - You are about to drop the column `chatroom_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_manager` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Mute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mute" DROP CONSTRAINT "Mute_chatroom_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatroom_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatroom_id",
DROP COLUMN "is_manager";

-- DropTable
DROP TABLE "Mute";

-- CreateTable
CREATE TABLE "Chatroom_user" (
    "idx" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "is_manger" BOOLEAN NOT NULL DEFAULT false,
    "is_mute" BOOLEAN NOT NULL DEFAULT false,
    "mute_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chatroom_user_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chatroom_user_user_id_key" ON "Chatroom_user"("user_id");

-- AddForeignKey
ALTER TABLE "Chatroom_user" ADD CONSTRAINT "Chatroom_user_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatroom_user" ADD CONSTRAINT "Chatroom_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
