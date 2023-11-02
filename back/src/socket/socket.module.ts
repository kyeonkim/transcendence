import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SocketGateway],
  imports: [AuthModule],
})
export class SocketModule {}
