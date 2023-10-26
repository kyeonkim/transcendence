import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { GameModule } from 'src/game/game.module';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [UserModule, GameModule, PrismaModule, AuthModule]
})
export class TestModule {}
