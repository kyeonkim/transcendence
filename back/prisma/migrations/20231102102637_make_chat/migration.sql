/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD COLUMN     "idx" SERIAL NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("idx");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatroom_id" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Chatroom" (
    "idx" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Message" (
    "idx" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Manager" (
    "idx" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "mannager_id" INTEGER NOT NULL,
    "mannager_nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Ban" (
    "idx" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("idx")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;
