-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "blocked_user_id" INTEGER NOT NULL,
    "blocked_user_nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
