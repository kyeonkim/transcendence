import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialService } from './social.service';
import { addFriendDto } from 'src/user/dto/user.dto';

@ApiTags('Social API')
@Controller('social')
export class SocialController {
    constructor(
        private readonly SocialService: SocialService,
    ) {}

	@ApiTags('User API')
	@ApiOperation({summary: `친구 추가 API`, description: `해당 유저끼리 친구를 추가한다.`})
	@Post("addfriend")
	AddFriend(@Body() user : addFriendDto)
    {
		return this.SocialService.AddFriend(user);
    }

    @ApiOperation({summary: `친구 확인 API`, description: `두 유저의 친구여부를 확인한다.`})
	@Get("checkFriend")
	async CreateDummyUser(@Query('user1', ParseIntPipe) user1_id: number, @Query('user2') user2_name: string)
	{
		return await this.SocialService.CheckFriend(user1_id, user2_name);
	}
}  
