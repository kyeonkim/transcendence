import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { TestModule } from './test/test.module';
import { SocialModule } from './social/social.module';
import { EventModule } from './event/event.module';
import { SocketModule } from './socket/socket.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [HttpModule, PrismaModule, UserModule, AuthModule, GameModule, TestModule, SocialModule, EventModule, SocketModule, ChatModule]
})
export class AppModule {}
