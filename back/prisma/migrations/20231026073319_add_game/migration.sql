/*
  Warnings:

  - The primary key for the `Tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[nick_name]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_pkey",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "Tokens_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "Game" (
    "idx" SERIAL NOT NULL,
    "rank" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,
    "enemy_id" INTEGER NOT NULL,
    "winner" BOOLEAN NOT NULL,
    "my_score" INTEGER NOT NULL DEFAULT 0,
    "enemy_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_nick_name_key" ON "Tokens"("nick_name");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
