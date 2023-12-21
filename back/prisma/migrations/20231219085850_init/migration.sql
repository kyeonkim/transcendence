-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL,
    "nick_name" TEXT NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,
    "img_name" TEXT DEFAULT 'default.png',
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "ladder" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "twoFA" BOOLEAN NOT NULL DEFAULT false,
    "lower_nickname" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "TwoFA_key" (
    "user_id" INTEGER NOT NULL,
    "twoFA_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFA_key_pkey" PRIMARY KEY ("user_id")
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
    "twoFAPass" BOOLEAN NOT NULL,
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
    "idx" SERIAL NOT NULL,
    "to_id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "from_nickname" TEXT NOT NULL,
    "chatroom_id" INTEGER,
    "chatroom_name" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Chatroom" (
    "idx" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_password" BOOLEAN NOT NULL DEFAULT false,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "owner_id" INTEGER NOT NULL,
    "owner_nickname" TEXT NOT NULL,
    "room_password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Ban" (
    "idx" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Chatroom_user" (
    "idx" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_nickname" TEXT NOT NULL,
    "is_manager" BOOLEAN NOT NULL DEFAULT false,
    "is_mute" BOOLEAN NOT NULL DEFAULT false,
    "mute_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chatroom_user_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "blocked_user_id" INTEGER NOT NULL,
    "blocked_user_nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "idx" SERIAL NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_name_key" ON "User"("nick_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_lower_nickname_key" ON "User"("lower_nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_nick_name_key" ON "Tokens"("nick_name");

-- CreateIndex
CREATE UNIQUE INDEX "Chatroom_user_user_id_key" ON "Chatroom_user"("user_id");

-- AddForeignKey
ALTER TABLE "TwoFA_key" ADD CONSTRAINT "TwoFA_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_following_user_id_fkey" FOREIGN KEY ("following_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatroom_user" ADD CONSTRAINT "Chatroom_user_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatroom_user" ADD CONSTRAINT "Chatroom_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
