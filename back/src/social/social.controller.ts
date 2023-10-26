import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialService } from './social.service';
import { friendDto } from 'src/user/dto/user.dto';

@ApiTags('Social API')
@Controller('social')
export class SocialController {
    constructor(
        private readonly SocialService: SocialService,
    ) {}

	@ApiTags('User API')
	@ApiOperation({summary: `친구 추가 API`, description: `해당 유저끼리 친구를 추가한다.`})
	@Post("addfriend")
	AddFriend(@Body() friend : friendDto)
    {
		return this.SocialService.AddFriend(friend);
    }

    @ApiOperation({summary: `친구 확인 API`, description: `두 유저의 친구여부를 확인한다.`})
	@Get("checkFriend")
	async CreateDummyUser(@Query('user1', ParseIntPipe) user1_id: number, @Query('user2') user2_name: string)
	{
		return await this.SocialService.CheckFriend(user1_id, user2_name);
	}

    @ApiOperation({summary: `친구 삭제 API`, description: `두 유저의 친구 관계를 삭제한다.`})
	@Delete("DeleteFriend")
	async DeleteFriend(@Body() friend: friendDto)
	{
		return await this.SocialService.DeleteFriend(friend);
	}

    @ApiOperation({summary: `친구목록 확인 API`, description: `유저의 친구 목록을 확인한다.`})
    @Get("getFriendList/:id")
    async GetFriendList(@Param('id', ParseIntPipe) user_id: number)
    {
        return await this.SocialService.GetFriendList(user_id);
    }
    //오키 끝 집갈께!!
}  
