/*
  Warnings:

  - The `mute_time` column on the `Chatroom_user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chatroom_user" DROP COLUMN "mute_time",
ADD COLUMN     "mute_time" INTEGER;
