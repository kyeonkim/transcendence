import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/socket/socket.module';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [PrismaModule, SocketModule, EventModule],
  exports: [GameService]
})
export class GameModule {}
