import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { SocketService } from './socket.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SocketGateway, SocketService],
  imports: [AuthModule, PrismaModule],
  exports: [SocketService, SocketGateway],
})
export class SocketModule {}
