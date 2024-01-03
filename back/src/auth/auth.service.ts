import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FtSignUpDto, GoogleLoginDto, LoginDto, SignUpDto, TokenDto, TwoFADTO } from 'src/auth/dto/token.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TokenExpiredError } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authenticator } from 'otplib';
import { WsException } from '@nestjs/websockets';

export type UserToken = {
	twoFAPass: boolean;
	user_id: number;
	nick_name: string;
}

@Injectable()
export class AuthService {
	constructor(
        private userService: UserService,
		private readonly httpService: HttpService,
		private jwtService: JwtService,
		private prisma: PrismaService,
    ) {}
        
    async ReCreateToken(token: TokenDto)
    {
        //2. 우리가 최근에 발급한 access 토큰이고
		const decoded = this.jwtService.decode(token.access_token);
		const user_id = decoded['user_id'];// access 토큰 uid 비교필요
		const nickname = decoded['nick_name'];// access 토큰 nick_name
		const twoFAPass = decoded['twoFAPass'];// access 토큰 nick_name
        return await this.CreateToken(user_id, nickname, twoFAPass);// 새토큰 발급
    }

	async CreateToken(id: number, nickName: string, twoFAPass: boolean)
	{
		const payload = { user_id: id, nick_name: nickName, twoFAPass: twoFAPass };
		
		const user_token = await this.prisma.tokens.upsert({
			where: {
				user_id : id,
			},
			update: {
				access_token: await this.jwtService.signAsync(payload, {expiresIn: '1h', secret: process.env.JWT_SECRET}),
				refresh_token:await this.jwtService.signAsync(payload, {expiresIn: '1d', secret: process.env.JWT_SECRET}),
				twoFAPass: twoFAPass,
			},
			create: {
				user_id: id,
				nick_name: nickName,
				access_token: await this.jwtService.signAsync(payload, {expiresIn: '1h', secret: process.env.JWT_SECRET}),
				refresh_token:await this.jwtService.signAsync(payload, {expiresIn: '1d', secret: process.env.JWT_SECRET}),
				twoFAPass: twoFAPass,
			},
		});
		if (user_token == null)
			return {status: false, message: "토큰 발급 실패"}
		else
			return {status: true, message: "토큰 발급 성공", access_token: user_token.access_token, refresh_token: user_token.refresh_token};
	}

	async Auth42(token: string)
	{
        const getTokenConfig = {
			url: '/oauth/token/info',
			method: 'get',
			baseURL : 'https://api.intra.42.fr/',
			headers : {'Authorization': `Bearer ${token}`}
		};
		try {
			const { data } = await firstValueFrom(this.httpService.request(getTokenConfig));
			return Number(data.resource_owner_id);
		} catch (error) {
			console.error(`42인증 실페 ==================\n`,error);
			return null;
		}
	}

	async FtLogin(token : TokenDto)
	{
		try {
			const authorizedId = await this.Auth42(token.access_token);
			if (authorizedId === null)
				return {status: false, access_token: token.access_token};
			const userData = await this.prisma.user.findUnique({
				where: {
				  ft_id: authorizedId,
				},
			});
			if (userData === null)
				return {status: false, access_token: token.access_token};
			const tokenData = await this.CreateToken(userData.user_id, userData.nick_name, !userData.twoFA);
			return {status: true, twoFAPass: !(userData.twoFA), userdata: userData, token: tokenData};
		} catch (error) {
			console.error(error);
			return {status: false, access_token: token.access_token};
		}
	}

	async Login(loginData : LoginDto) {
		try {
			const userData = await this.prisma.user.findUnique({
				where: {
				  nick_name: loginData.nick_name,
				},
			});
			if (userData === null)
				return {status: false, message: "유저 찾기 실패"};
			if (bcrypt.compareSync(loginData.password, userData.password) !== true)
				return {status: false, message: "비밀번호가 틀렸습니다."};
			const tokenData = await this.CreateToken(userData.user_id, userData.nick_name, !userData.twoFA);
			return {status: true, twoFAPass: !(userData.twoFA), userdata: userData, token: tokenData};
		} catch (error) {
			console.error(error);
			return {status: false, message: "server error"}
		}
	}

	async FtSignUp(userData : FtSignUpDto)
    {
		if(userData.nick_name.length < 2 || userData.nick_name.length > 10)
			return {status: false, message: "닉네임은 2글자 이상 10글자 이하로 입력해주세요."};
		const low_nickname = userData.nick_name.toLowerCase();
		if( low_nickname === "admin" || low_nickname === "administrator" || low_nickname === "root" || low_nickname === "system" ||
			low_nickname === "sys" || low_nickname === "test" || low_nickname === "guest" || low_nickname === "operator" ||
			low_nickname === "operator" || low_nickname === "user" || low_nickname === "super" || low_nickname === "default" )
			return {status: false, message: "사용할 수 없는 닉네임입니다."};
		const authorizedId = await this.Auth42(userData.access_token);
		if (authorizedId === null)
			return {status: false, access_token: userData.access_token};
		const newUser = await this.userService.CreateUser(userData.nick_name);
    	if (newUser == null)
			return {status: false, message: "이미 사용 중인  이름입니다."};
		await this.prisma.user.update({
			where: { user_id: newUser.user_id },
			data: {ft_id: authorizedId}
		});
		const tokenData = await this.CreateToken(newUser.user_id, newUser.nick_name, !newUser.twoFA);
		return {status: true,  message: "success", userdata: newUser, token: tokenData};
    }
	
    // async GoogleSignUp(userData : FtSignUpDto)
    // {
	// 	if(userData.nick_name.length < 2 || userData.nick_name.length > 10)
	// 		return {status: false, message: "닉네임은 2글자 이상 10글자 이하로 입력해주세요."};
	// 	const low_nickname = userData.nick_name.toLowerCase();
	// 	if( low_nickname === "admin" || low_nickname === "administrator" || low_nickname === "root" || low_nickname === "system" ||
	// 		low_nickname === "sys" || low_nickname === "test" || low_nickname === "guest" || low_nickname === "operator" ||
	// 		low_nickname === "operator" || low_nickname === "user" || low_nickname === "super" || low_nickname === "default" )
	// 		return {status: false, message: "사용할 수 없는 닉네임입니다."};
	// 	const authorizedId = await this.Auth42(userData.access_token);
	// 	if (authorizedId === null)
	// 		return {status: false, access_token: userData.access_token};
	// 	const newUser = await this.userService.CreateUser(userData.nick_name);
    // 	if (newUser == null)
	// 		return {status: false, message: "이미 사용 중인  이름입니다."};
	// 	await this.prisma.user.update({
	// 		where: { user_id: newUser.user_id },
	// 		data: {ft_id: authorizedId}
	// 	});
	// 	const tokenData = await this.CreateToken(newUser.user_id, newUser.nick_name, !newUser.twoFA);
	// 	return {status: true,  message: "success", userdata: newUser, token: tokenData};
    // }

	// 일반 로그인 구현 필요 - kyeonkim
    async SignUp(userData : SignUpDto){
		if(userData.nick_name.length < 2 || userData.nick_name.length > 10)
		return {status: false, message: "닉네임은 2글자 이상 10글자 이하로 입력해주세요."};
		const low_nickname = userData.nick_name.toLowerCase();
		if( low_nickname === "admin" || low_nickname === "administrator" || low_nickname === "root" || low_nickname === "system" ||
			low_nickname === "sys" || low_nickname === "test" || low_nickname === "guest" || low_nickname === "operator" ||
			low_nickname === "operator" || low_nickname === "user" || low_nickname === "super" || low_nickname === "default"
			)
			return {status: false, message: "사용할 수 없는 닉네임입니다."};
			// const authorizedId = await this.Auth42(userData.access_token);
		// if (authorizedId === null)
		// return {status: false, access_token: userData.access_token};
		const newUser = await this.userService.CreateUser(userData.nick_name);
		if (newUser == null)
		return {status: false, message: "이미 사용 중인  이름입니다."};
		await this.prisma.user.update({
			where: { user_id: newUser.user_id },
			data: {password: userData.password}
		});
		const tokenData = await this.CreateToken(newUser.user_id, newUser.nick_name, !newUser.twoFA);
		return {status: true,  message: "success", userdata: newUser, token: tokenData};
	}

	async GoogleLogin(data : GoogleLoginDto) {
		try {
			const authorized = await this.AuthGoogle(data.code);
			console.log("GoogleLogin authorized : ", authorized);
			if (authorized === null)
				return {status: false, access_token: data.code};
			return {status: true, access_token: authorized};
		// 	if (authorizedId === null)
		// 		return {status: false, access_token: token.access_token};
		// 	const userData = await this.prisma.user.findUnique({
		// 		where: {
		// 		  ft_id: authorizedId,
		// 		},
		// 	});
		// 	if (userData === null)
		// 		return {status: false, access_token: token.access_token};
		// 	const tokenData = await this.CreateToken(userData.user_id, userData.nick_name, !userData.twoFA);
		// 	return {status: true, twoFAPass: !(userData.twoFA), userdata: userData, token: tokenData};
		} catch (error) {
			console.error(error);
		// 	return {status: false, access_token: token.access_token};
		}
	}

	async AuthGoogle(code: string) {
		const getTokenConfig = {
			url: '/token',
			method: 'post',
			baseURL : 'https://oauth2.googleapis.com/',
			params: {
				code: code,
				client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
				client_secret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
				redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL,
				grant_type: 'authorization_code',
				scope: ["https://www.googleapis.com/auth/userinfo.email"]
			}
		};
		try {
			const { data } = await firstValueFrom(this.httpService.request(getTokenConfig));
			console.log("AuthGoogle data: ", data);
			return this.jwtService.decode(data.id_token).sub;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async TwoFAPass(twofa: TwoFADTO)
	{
		const user = await this.prisma.user.findUnique({where: {user_id: twofa.user_id}, include: {twoFA_key: true}});
		if (user === null)
			return {status: false, message: "user not found"};
		const isValid = authenticator.verify({ token: twofa.code , secret: user.twoFA_key.twoFA_key});
		if (isValid)
		{
			const tokenData = await this.CreateToken(twofa.user_id, twofa.user_nickname, true);
			return {status: true,
					message: tokenData.message,
					user_id: twofa.user_id,
					nick_name: twofa.user_nickname,
					access_token: tokenData.access_token,
					refresh_token: tokenData.refresh_token
				};
		}
		return {status: false, message: "fail"};
	}

	async Active2FAQRCode(user: TwoFADTO)
	{
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(user.user_nickname, process.env.OTPAUTH_ADDR, secret);
		return {status: true, message: "success", secret: secret, otpauthUrl: otpauthUrl};
	}

	async Active2FA(twofa: TwoFADTO)
	{
		const isValid = authenticator.verify({ token: twofa.code , secret: twofa.secret});
		if (isValid)
		{
			const res = await this.prisma.user.update({
				where: {
					user_id: twofa.user_id,
				},
				data: {
					twoFA: true,
				}
			});
			if (res === null)
				return {status: false, message: "fail"};
			const token = await this.prisma.twoFA_key.upsert({
				where: {
					user_id: twofa.user_id,
				},
				update: {
					twoFA_key: twofa.secret,
				},
				create: {
					user_id: twofa.user_id,
					twoFA_key: twofa.secret,
				}
			});
			if (token === null)
				return {status: false, message: "fail"};
			return {status: true, message: "success"};
		}
		else
			return {status: false, message: "fail"};
	}

	async Deactive2FA(twofa: TwoFADTO)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				user_id: twofa.user_id,
			},
			include: {
				twoFA_key: true,
			}
		});
		if (user === null)
			return {status: false, message: "user not found"};
		const isValid = authenticator.verify({ token: twofa.code , secret: user.twoFA_key.twoFA_key});
		if (!isValid)
			return {status: false, message: "2fa auth fail"};
		await this.prisma.user.update({
			where: {
				user_id: twofa.user_id,
			},
			data: {
				twoFA: false,
			}
		});
		await this.prisma.twoFA_key.delete({
			where: {
				user_id: twofa.user_id,
			}
		});
		return {status: true, message: "success"};
	}
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
	private prisma: PrismaService,
	private jwtService: JwtService
  ) {
	super({
	  //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
	  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
	  //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
	  ignoreExpiration: false,
	  //검증 비밀 값(유출 주의)
	  secretOrKey: process.env.JWT_SECRET,
	  passReqToCallback: true,
	});
  }
  /**
   * @description 클라이언트가 전송한 Jwt 토큰 정보
   *
   * @param payload 토큰 전송 내용
   */
  async validate(req: any, payload: UserToken): Promise<any> {
	// console.log("JwtAccessStrategy req: ", req.headers);
	if (payload.twoFAPass === false)// 2차인증 필요
		throw new UnauthorizedException();
	req['tokenuserdata'] = payload;
	return { status: true };
  }
}

@Injectable()
export class JwtTwoFAStrategy extends PassportStrategy(Strategy, 'jwt-twoFA') {
  constructor(
	private prisma: PrismaService,
	private jwtService: JwtService
  ) {
	super({
	  //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
	  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
	  //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
	  ignoreExpiration: false,
	  //검증 비밀 값(유출 주의)
	  secretOrKey: process.env.JWT_SECRET,
	  passReqToCallback: true,
	});
  }
  
  /**
   * @description 클라이언트가 전송한 Jwt 토큰 정보
   *
   * @param payload 토큰 전송 내용
   */
  async validate(req: any, payload: UserToken): Promise<any> {
	req['tokenuserdata'] = payload;
	return { status: true };
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
	private prisma: PrismaService,
	private jwtService: JwtService
  ) {
	super({
	  //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
	  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	  //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
	  ignoreExpiration: false,
	  //검증 비밀 값
	  secretOrKey: process.env.JWT_SECRET,
	  // request 값을 가져올 수 있도록 허용
	  passReqToCallback: true,
	  
	});
  }
  /**
   * @description 클라이언트가 전송한 Jwt 토큰 정보
   *
   * @param payload 토큰 전송 내용
   */
  async validate(req: any, payload: UserToken): Promise<any> {
	// console.log("JwtRefreshStrategy req: ", req.body);
	// console.log("JwtRefreshStrategy payload: ", payload);
	if (payload.twoFAPass === false)// 2차인증 필요
		throw new UnauthorizedException();
	const storedToken = await this.prisma.tokens.findUnique({
		where: {
		  user_id: payload.user_id,
		},
	});
	// console.log("JwtRefreshStrategy storedToken:", storedToken);
	if (storedToken === null)
		throw new UnauthorizedException();
	if (storedToken.access_token !== req.body.access_token)
		throw new UnauthorizedException();
	try {
		await this.jwtService.verifyAsync(storedToken.access_token, { secret: process.env.JWT_SECRET });
		// console.log("JwtRefreshStrategy done!");
	} catch (error) {
		if (error instanceof TokenExpiredError)
			return { status: true };
	}
	throw new UnauthorizedException(); 
  }
}

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, 'jwt-ws') {
  constructor(
	private prisma: PrismaService,
	private jwtService: JwtService
  ) {
	super({
	  //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
	  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
	  //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
	  ignoreExpiration: false,
	  //검증 비밀 값(유출 주의)
	  secretOrKey: process.env.JWT_SECRET,
	});
  }
  /**
   * @description 클라이언트가 전송한 Jwt 토큰 정보
   *
   * @param payload 토큰 전송 내용
   */
  async validate(payload: UserToken): Promise<any> {
	if (payload.twoFAPass === false)// 2차인증 필요
		throw new WsException(`인증실패`);
	return { status: true };
  }
}