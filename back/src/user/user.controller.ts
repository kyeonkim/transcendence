import { Controller, Post, Body, Get, Param, ParseIntPipe, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { IntraTokenDto, UserTokenDto } from '../auth/dto/token.dto';
import { createUserDto, addFriendDto, getUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
    constructor(
		private readonly UserService: UserService,
		private readonly AuthService: AuthService
		) {}
	
	@ApiOperation({summary: `유저 확인 API`, description: `발급 받은 토큰을 통해 해당 유저가 가입되어 있는지 확인한다.`})
	@Post("auth")
	PostAuth(@Body() token : IntraTokenDto)
	{
		return this.AuthService.PostAuth(token);
	}

	@ApiOperation({summary: `유저 생성 API`, description: `새로생성된 유저를 db에 저장한다.`})
    @Post("create")
    CreateUser(@Body() user : createUserDto)
    {
        return this.UserService.CreateUser(user);
    }

	@ApiOperation({summary: `친구 추가 API`, description: `해당 유저끼리 친구를 추가한다.`})
	@Post("addfriend")
	AddFriend(@Body() user : addFriendDto)
    {
		return this.UserService.AddFriend(user);
    }

	@ApiOperation({summary: `닉네임 유저 데이터 API`, description: `닉네임으로 유저 데이터를 가져온다.`})
	@Get("getdata/nickname/:nickname")
    GetUserDataByNickName(@Param('nickname') nickname: string)
	{
		return this.UserService.GetUserDataByNickName(nickname);
	}

	@ApiOperation({summary: `아이디 유저 데이터 API`, description: `아이디로 유저 데이터를 가져온다.`})
	@Get("getdata/id/:id")
    GetUserDataById(@Param('id', ParseIntPipe) id: number)
	{
		return this.UserService.GetUserDataById(id);
	}

	@ApiBearerAuth("token")
	@Post("token/varify")
	VarifyToken(@Body() token : UserTokenDto)
	{
		return token;
		// return this.UserService.VarifyToken(token);
	}
}