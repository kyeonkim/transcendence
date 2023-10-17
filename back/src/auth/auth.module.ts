import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AuthService],
  imports: [HttpModule, PrismaModule, JwtModule, forwardRef(()=> UserModule)],
  exports: [AuthService]
})
export class AuthModule {}
