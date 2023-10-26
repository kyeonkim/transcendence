import { Controller, Delete, Param, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Test API')
@Controller('test')
export class TestController {
    constructor(
        private readonly TestService: TestService,
    ) {}

	@ApiOperation({summary: `더미유저 생생성 API`, description: `더미데이터를 생성한다.`})
	@Post("createdummy")
	CreateDummyUser()
	{
		return this.TestService.CreateDummyUser();
	}

	@ApiOperation({summary: `유저 삭제 데이터 API`, description: `닉네임으로 유저 데이터를 삭제한다.`})
	@Delete("getdata/nickname/:nickname")
    DeleteUserById(@Param('nickname') nickName: string)
	{
		return this.TestService.DeleteUserById(nickName);
	}

	@ApiOperation({summary: `더미 게임 데이터 추가 API`, description: `더미데이터를 생성한다.`})
	@Post("creategamedummy")
	CreateDummyGame()
	{
		return this.TestService.CreateDummyGame();
	}

	@ApiOperation({summary: `더더미  게임 데이터 삭제 API`, description: `더미게임데이터를 삭삭제제한한다.`})
	@Delete("getdata/deletedummy")
    DeleteDummyGame()
	{
		return this.TestService.DeleteDummyGame();
	}
}
