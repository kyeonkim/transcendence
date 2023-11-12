/*
  Warnings:

  - You are about to drop the column `password` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `private` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `twoFA_key` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatroom" DROP COLUMN "password",
DROP COLUMN "private",
ADD COLUMN     "is_password" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "owner_nickname" TEXT NOT NULL DEFAULT 'owner';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFA_key";

-- CreateTable
CREATE TABLE "TwoFA_key" (
    "user_id" INTEGER NOT NULL,
    "twoFA_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFA_key_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Chatroom_password" (
    "chatroom_idx" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatroom_password_pkey" PRIMARY KEY ("chatroom_idx")
);

-- AddForeignKey
ALTER TABLE "TwoFA_key" ADD CONSTRAINT "TwoFA_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatroom_password" ADD CONSTRAINT "Chatroom_password_chatroom_idx_fkey" FOREIGN KEY ("chatroom_idx") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;
