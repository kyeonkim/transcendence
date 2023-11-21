import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [PrismaModule],
  exports: [GameService]
})
export class GameModule {}
