import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto, TokenDto, TwoFADTO } from './dto/token.dto';
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
	async SignUp(@Body() user : SignUpDto)
	{
		return await this.AuthService.SignUp(user);
	}
	
	@ApiOperation({summary: `유저 확인 API`, description: `42에서 발급 받은 토큰을 통해 해당 유저가 가입되어 있는지 확인한다.`})
	@Post("login")
	async Login(@Body() token : TokenDto)
	{
		return await this.AuthService.Login(token);
	}

	@ApiOperation({summary: `토큰 재발급 API`, description: `리프래시 토큰을 통해 새로운 토큰을 발급한다.`})
	@ApiBearerAuth('JWT-refresh')// swagger code
	@Post("token/refresh")
	@UseGuards(AuthGuard('jwt-refresh'))
	async RecreateToken(@Body() token : TokenDto)
	{
		return await this.AuthService.ReCreateToken(token);
	}

	@ApiBearerAuth('JWT-auth')
	@Get("token/varify")
	@UseGuards(AuthGuard('jwt-access'))
	async VarifyToken()
	{
		console.log("token varify");
		return `okay`;
		// return this.UserService.VarifyToken(token);
	}

	@ApiOperation({summary: `2차인증 활성 qr API`, description: `2차인증을 활성화 하기위한 QR코드를 받는다.`})
	@Post("2fa/activeqr")
	async Active2FAQRCode(@Body() twofa: TwoFADTO)
	{
		return await this.AuthService.Active2FAQRCode(twofa);
	}

	@ApiOperation({summary: `2차인증 활성화 API`, description: `2차인증을 활성화 한다.`})
	@Post("2fa/active")
	async Active2FA(@Body() twofa: TwoFADTO)
	{
		return await this.AuthService.Active2FA(twofa);
	}
}
