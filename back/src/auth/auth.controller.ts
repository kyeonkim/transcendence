import { Body, Controller, Delete, Get, Headers, Param, Post, Res, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenSignUpDto, SignUpDto, TokenDto, TwoFADTO, LoginDto } from './dto/token.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly AuthService: AuthService,
		private readonly UserService: UserService
		) {}

	@ApiTags('User API')
	@ApiOperation({summary: `42유저 생성 API`, description: `새로 생성된 42유저를 db에 저장한다.`})
	@Post("42signup")
	async FtSignUp(@Body() user : TokenSignUpDto)
	{
		return await this.AuthService.FtSignUp(user);
	}

	@ApiTags('User API')
	@ApiOperation({summary: `유저 생성 API`, description: `새로 생성된 유저를 db에 저장한다.`})
	@Post("signup")
	async SignUp(@Body() user : SignUpDto)
	{
		return await this.AuthService.SignUp(user);
	}
	
	@ApiOperation({summary: `42유저 확인 API`, description: `42에서 발급 받은 토큰을 통해 해당 유저가 가입되어 있는지 확인한다.`})
	@Post("42login")
	async FtLogin(@Body() token : TokenDto)
	{
		return await this.AuthService.FtLogin(token);
	}

	@ApiTags('User API')
	@ApiOperation({summary: `구글유저 생성 API`, description: `새로 생성된 구글유저를 db에 저장한다.`})
	@Post("googlesignup")
	async GoogleSignUp(@Body() user : TokenSignUpDto)
	{
		console.log("GoogleSignUp request : ", user);
		return await this.AuthService.GoogleSignUp(user);
	}
	
	@ApiOperation({summary: `구글 로그인 API`, description: `구글에서 발급 받은 토큰을 통해 해당 유저가 가입되어 있는지 확인한다.`})
	@Post("googlelogin")
	async GoogleLogin(@Body() data : TokenDto)
	{
		// const rtn = await this.AuthService.GoogleLogin(data);
		// console.log(`google login rtn : `,rtn);
		// return rtn;
		return await this.AuthService.GoogleLogin(data);
	}

	@ApiOperation({summary: `유저 확인 API`, description: `회원가입을 통해 해당 유저가 가입되어 있는지 확인한다.`})
	@Post("login")
	async Login(@Body() loginData : LoginDto)
	{
		return await this.AuthService.Login(loginData);
	}

	@ApiOperation({summary: `토큰 재발급 API`, description: `리프래시 토큰을 통해 새로운 토큰을 발급한다.`})
	@UseGuards(AuthGuard('jwt-refresh'))
	@ApiBearerAuth('JWT-refresh')// swagger code
	@Post("token/refresh")
	async RecreateToken(@Headers() header, @Body() token : TokenDto, @Res({passthrough: true}) res: Response)
	{
		const newToken = await this.AuthService.ReCreateToken(token);
		return newToken;
	}

	@ApiBearerAuth('JWT-auth')
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
	@Get("token/varify")
	async VarifyToken()
	{
		return {status: true, message: "token varify success"};
	}

	@ApiOperation({summary: `2차인증 통과 API`, description: `2차인증 통과여부를 토큰에 넣는다.`})
	@UseGuards(AuthGuard('jwt-twoFA'))
	@ApiBearerAuth('JWT-twoFA')
	@Post("2fa/pass")
	async TwoFAPass(@Req() req, @Body() twofa: TwoFADTO)
	{
		return await this.AuthService.TwoFAPass(twofa);
	}

	@ApiOperation({summary: `2차인증 활성 qr API`, description: `2차인증을 활성화 하기위한 QR코드를 받는다.`})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
	@Post("2fa/activeqr")
	async Active2FAQRCode(@Req() req, @Body() twofa: TwoFADTO)
	{
		twofa.user_id = req.tokenuserdata.user_id;
		twofa.user_nickname = req.tokenuserdata.nick_name;
		return await this.AuthService.Active2FAQRCode(twofa);
	}

	@ApiOperation({summary: `2차인증 활성화 API`, description: `2차인증을 활성화 한다.`})
	@UseGuards(AuthGuard('jwt-twoFA'))
	@ApiBearerAuth('JWT-twoFA')
	@Post("2fa/active")
	async Active2FA(@Req() req, @Body() twofa: TwoFADTO)
	{
		twofa.user_id = req.tokenuserdata.user_id;
		twofa.user_nickname = req.tokenuserdata.nick_name;
		return await this.AuthService.Active2FA(twofa);
	}

	@ApiOperation({summary: '2차인증 비활성화 API', description: '2차인증을 비활성화 한다.'})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
	@Delete("2fa/deactive")
	async Deactive2FA(@Req() req, @Body() twofa: TwoFADTO)
	{
		twofa.user_id = req.tokenuserdata.user_id;
		twofa.user_nickname = req.tokenuserdata.nick_name;
		return await this.AuthService.Deactive2FA(twofa);
	}
}

