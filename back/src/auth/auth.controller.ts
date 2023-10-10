import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}
	
	@Post("token")
	PostAuth(@Body() token : string) : boolean
	{
		return this.AuthService.PostAuth(token);
	}
}
