import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UserTokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {

    @Post("token/varify")
	@UseGuards(AuthGuard('jwt-access'))
    @ApiBearerAuth('JWT-nuth')
	VarifyToken(@Body() token : UserTokenDto)
	{
		return token;
		// return this.UserService.VarifyToken(token);
    }
}
