import { Module } from '@nestjs/common';
import { AuthService, JwtAccessStrategy, JwtRefreshStrategy, JwtTwoFAStrategy, JwtWsStrategy } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, JwtTwoFAStrategy, JwtWsStrategy],
    imports: [HttpModule, PrismaModule, JwtModule, UserModule],
    exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, JwtTwoFAStrategy, JwtWsStrategy]
})
export class AuthModule {}
