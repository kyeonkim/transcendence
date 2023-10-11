import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { tokenDto } from './dto/token.dto';
import { createUserDto } from './dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}
	
	@ApiOperation({summary: `유저 확인 API`, description: `발급 받은 토큰을 통해 해당 유저가 가입되어 있는지 확인한다.`})
	@Post("auth")
	PostAuth(@Body() token : tokenDto) : Promise<boolean>
	{
		return this.UserService.PostAuth(token);
	}

	@ApiOperation({summary: `유저 생성 API`, description: `새로생성된 유저를 db에 저장한다.`})
    @Post("create")
    CreateUser(@Body() user : createUserDto) : Promise<AxiosResponse>
    {
        return this.UserService.CreateUser(user);
    }
}
