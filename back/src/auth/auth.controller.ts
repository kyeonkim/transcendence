import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { tokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}
	
	@Post("token")
	PostAuth(@Body() token : tokenDto) : Promise<boolean>
	{
		return this.AuthService.PostAuth(token);
	}
}
