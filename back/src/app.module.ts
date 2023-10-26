import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [HttpModule, PrismaModule, UserModule, AuthModule, GameModule, TestModule]
})
export class AppModule {}
