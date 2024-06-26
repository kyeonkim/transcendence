import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [SocialController],
  providers: [SocialService],
  imports: [PrismaModule, EventModule, SocketModule],
  exports: [SocialService],
})
export class SocialModule {}
