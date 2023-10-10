import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}
	
	@Post("token")
	PostAuth(@Body() user : createUserDto) : Promise<boolean>
	{
		return this.AuthService.PostAuth(user);
	}
}
