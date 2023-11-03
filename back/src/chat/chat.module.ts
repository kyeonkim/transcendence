import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [PrismaModule, SocketModule],
})
export class ChatModule {}
