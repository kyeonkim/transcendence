import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto, TokenDto } from './dto/token.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly AuthService: AuthService,
		private readonly UserService: UserService
		) {}

	@ApiTags('User API')
	@ApiOperation({summary: `유저 생성 API`, description: `새로생성된 유저를 db에 저장한다.`})
	@Post("signup")
	SignUp(@Body() user : SignUpDto)
	{
		return this.AuthService.SignUp(user);
	}
	
	@ApiOperation({summary: `유저 확인 API`, description: `42에서 발급 받은 토큰을 통해 해당 유저가 가입되어 있는지 확인한다.`})
	@Post("login")
	Login(@Body() token : TokenDto)
	{
		return this.AuthService.Login(token);
	}

	@ApiOperation({summary: `토큰 재발급 API`, description: `리프래시 토큰을 통해 새로운 토큰을 발급한다.`})
	@ApiBearerAuth('JWT-refresh')// swagger code
	@Post("token/refresh")
	@UseGuards(AuthGuard('jwt-refresh'))
	RecreateToken(@Body() token : TokenDto)
	{
		return this.AuthService.ReCreateToken(token);
	}


	@ApiBearerAuth('JWT-auth')
	@Get("token/varify")
	@UseGuards(AuthGuard('jwt-access'))
	VarifyToken()
	{
		console.log("token varify");
		return `okay`;
		// return this.UserService.VarifyToken(token);
	}
}
