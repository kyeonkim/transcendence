import { Controller, Delete, Get, Param, Post, Query, Res } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialService } from 'src/social/social.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';


@ApiTags('Test API')
@Controller('test')
export class TestController {
    constructor(
        private readonly TestService: TestService,
		private readonly SocialService: SocialService,
		private readonly prisma: PrismaService,
    ) {}

	@ApiOperation({summary: `더미유저 생생성 API`, description: `더미데이터를 생성한다.`})
	@Post("createdummy")
	CreateDummyUser()
	{
		return this.TestService.CreateDummyUser();
	}

	@ApiOperation({summary: `더미유저 삭제 API`, description: `더미데이터를 삭제한다.`})
	@Delete("deletedummy")
	DeleteDummyUser()
	{
		return this.TestService.DeleteDummyUser();
	}

	@ApiOperation({summary: `유저 삭제 데이터 API`, description: `닉네임으로 유저 데이터를 삭제한다.`})
	@Delete("getdata/nickname/:nickname")
    DeleteUserByNickName(@Param('nickname') nickName: string)
	{
		return this.TestService.DeleteUserByNickName(nickName);
	}

	@ApiOperation({summary: `더미 게임 데이터 추가 API`, description: `더미데이터를 생성한다.`})
	@Post("creategamedummy")
	CreateDummyGame()
	{
		return this.TestService.CreateDummyGame();
	}

	@ApiOperation({summary: `더미  게임 데이터 삭제 API`, description: `더미게임데이터를 삭제한다.`})
	@Delete("getdata/deletedummy")
    DeleteDummyGame()
	{
		return this.TestService.DeleteDummyGame();
	}

	@ApiOperation({summary: `더미 채팅방생성 API`, description: `더미데이터를 생성한다.`})
	@Post("createchatdummy")
	CreateDummyChat()
	{
		return this.TestService.CreateDummyChat();
	}

	@ApiOperation({summary: `더미 채팅방 삭제 API`, description: `더미데이터를 삭제한다.`})
	@Delete("deletechatdummy")
	DeleteDummyChat()
	{
		return this.TestService.DeleteDummyChat();
	}

	@ApiOperation({summary: `강제친구 추가 API`, description: `강제로 친구를 추가한다.`})
	@Get("addfriend")
	async AddFriend(@Query('user1') user1_id: number, @Query('user2') user2_id: number)
	{
		const user1 = await this.prisma.user.findUnique({
			where: {
				user_id: user1_id,
			},
		});
		const user2 = await this.prisma.user.findUnique({
			where: {
				user_id: user2_id,
			},
		});
		if (user1 === null || user2 === null)
			return {status: false, message: "유저 찾기 실패"}
		return await this.SocialService.AcceptFriend({user_id: user1.user_id, user_nickname: user1.nick_name, friend_nickname: user2.nick_name});
	}

	@ApiOperation({summary: `dummy message 생성 API`, description: `dummy message를 생성한다.`})
	@Post("createmessagedummy")
	async CreateDummyMessage()
	{
		return await this.TestService.CreateDummyMessage();
	}

	@ApiOperation({summary: `cookie set API`, description: `cookie를 설정한다.`})
	@Get("setcookie")
	async SetCookie(@Res() res: Response)
	{
		console.log("here!!!!");
		res.cookie('test', 'test', {httpOnly: true});
		res.end();
		return "hello";
	}
}
