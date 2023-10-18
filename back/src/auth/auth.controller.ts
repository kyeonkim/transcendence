import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UserTokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {

	
	@Get("token/varify")
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-nuth')
	VarifyToken()
	{
		console.log("token varify");
		return `okay`;
		// return this.UserService.VarifyToken(token);
	}
}
