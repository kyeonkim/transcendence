-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL,
    "nick_name" TEXT NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,
    "img_name" TEXT DEFAULT 'default.png',
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "ladder" INTEGER NOT NULL DEFAULT 1000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "id" SERIAL NOT NULL,
    "following_user_id" INTEGER NOT NULL,
    "following_user_nickname" TEXT NOT NULL,
    "followed_user_id" INTEGER NOT NULL,
    "followed_user_nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "user_id" INTEGER NOT NULL,
    "nick_name" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "idx" SERIAL NOT NULL,
    "rank" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,
    "enemy_id" INTEGER NOT NULL,
    "enemy_name" TEXT NOT NULL DEFAULT 'enemy',
    "winner" BOOLEAN NOT NULL,
    "my_score" INTEGER NOT NULL DEFAULT 0,
    "enemy_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "to_id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "from_nickname" TEXT NOT NULL,
    "chatroom_id" INTEGER,
    "chatroom_name" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_name_key" ON "User"("nick_name");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_nick_name_key" ON "Tokens"("nick_name");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_following_user_id_fkey" FOREIGN KEY ("following_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
