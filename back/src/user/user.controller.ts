import { Controller, Post, Body, Get, Param, ParseIntPipe, UsePipes, UseGuards, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { TokenDto } from '../auth/dto/token.dto';
import { createUserDto, addFriendDto, getUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';

import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(
		private readonly UserService: UserService,
		private readonly AuthService: AuthService
		) {}

	@ApiTags('User API')
	@ApiOperation({summary: `유저 생성 API`, description: `새로생성된 유저를 db에 저장한다.`})
    @Post("create")
    CreateUser(@Body() user : createUserDto)
    {
        return this.UserService.CreateUser(user);
    }

	@ApiTags('User API')
	@ApiOperation({summary: `친구 추가 API`, description: `해당 유저끼리 친구를 추가한다.`})
	@Post("addfriend")
	AddFriend(@Body() user : addFriendDto)
    {
		return this.UserService.AddFriend(user);
    }

	@ApiTags('User API')
	@ApiOperation({summary: `닉네임 유저 데이터 API`, description: `닉네임으로 유저 데이터를 가져온다.`})
	@Get("getdata/nickname/:nickname")
    GetUserDataByNickName(@Param('nickname') nickname: string)
	{
		return this.UserService.GetUserDataByNickName(nickname);
	}

	@ApiTags('User API')
	@ApiOperation({summary: `아이디 유저 데이터 API`, description: `아이디로 유저 데이터를 가져온다.`})
	@Get("getdata/id/:id")
    GetUserDataById(@Param('id', ParseIntPipe) id: number)
	{
		return this.UserService.GetUserDataById(id);
	}

	@ApiTags('Test API')
	@ApiOperation({summary: `유저 삭제 데이터 API`, description: `닉네임으로 유저 데이터를 삭제한다.`})
	@Delete("getdata/nickname/:nickname")
    DeleteUserById(@Param('nickname') id: string)
	{
		return this.UserService.DeleteUserById(id);
	}
}