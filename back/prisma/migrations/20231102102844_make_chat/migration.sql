-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatroom_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "chatroom_id" DROP NOT NULL,
ALTER COLUMN "chatroom_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE SET NULL ON UPDATE CASCADE;
