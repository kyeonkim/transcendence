import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { tokenDto } from './dto/token.dto';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}
	
	@Post("auth")
	PostAuth(@Body() token : tokenDto) : Promise<boolean>
	{
		return this.UserService.PostAuth(token);
	}
}
