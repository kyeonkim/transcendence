import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { addFriendDto, uploadImgDto } from './dto/user.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
    constructor(
		private readonly UserService: UserService,
		) {}

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


	@ApiTags('User API')
	@ApiOperation({summary: `유저 이미지 업로드 API`, description: `회원가입 시 유저의 이미지를 저장한다.`})
	@Post("upload")
	@UseInterceptors(FileInterceptor("file", {
		storage: diskStorage({
		  destination: './storage',
		  filename(req, file, callback): void {
			return callback(null, `${req.query.nickname}`);
		  }
		})
	  }))
	@ApiConsumes('multipart/form-data')
	UserFileUpload(@Query('nickname') nickName: string, @Body() img: uploadImgDto, @UploadedFile() file: Express.Multer.File)
	{
		return {status: true};
	}

	@ApiTags('User API')
	@ApiOperation({summary: `유저 이미지 전달 API`, description: `유저의 이미지를 전달한다.`})
	@Get("getimg/nickname/:nickname")
	GetUserImageByNickName(@Param('nickname') nickName: string)
	{
		return this.UserService.GetUserImageByNickName(nickName);
	}

}