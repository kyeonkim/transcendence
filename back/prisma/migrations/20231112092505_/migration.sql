-- CreateTable
CREATE TABLE "Mute" (
    "idx" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mute_pkey" PRIMARY KEY ("idx")
);

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;
