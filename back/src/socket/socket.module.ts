import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { SocketService } from './socket.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketGameService } from 'src/socket/socket.gameservice';
import { EventModule } from 'src/event/event.module';
// import { GameModule } from 'src/game/game.module';

@Module({
  providers: [SocketGateway, SocketService, SocketGameService],
  imports: [AuthModule, PrismaModule, EventModule],
  exports: [SocketService, SocketGateway, SocketGameService],
})
export class SocketModule {}
