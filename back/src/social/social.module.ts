import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SocialController],
  providers: [SocialService],
  imports: [PrismaModule],
  exports: [SocialService],
})
export class SocialModule {}
