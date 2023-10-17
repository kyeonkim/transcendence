/*
  Warnings:

  - A unique constraint covering the columns `[tokens_user_id]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tokens_tokens_user_id_key" ON "Tokens"("tokens_user_id");
