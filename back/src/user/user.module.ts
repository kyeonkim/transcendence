import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [HttpModule, PrismaModule, JwtModule, AuthModule],
  exports: [UserService]
})
export class UserModule {}
