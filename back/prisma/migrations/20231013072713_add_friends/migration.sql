-- CreateTable
CREATE TABLE "Friends" (
    "id" SERIAL NOT NULL,
    "following_user_id" INTEGER NOT NULL,
    "followed_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_following_user_id_fkey" FOREIGN KEY ("following_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
