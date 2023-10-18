import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { v4 as uuid } from 'uuid';
import { TokenExpiredError } from 'jsonwebtoken';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { access } from 'fs';

export type UserToken = {
	user_id: number;
	uuid: string;
}

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
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
        return await this.CreateToken(user_id);// 새토큰 발급
    }

	async CreateToken(user_id: number)
	{
		uuid: uuid()
		const payload = { user_id: user_id , uuid: uuid() };
		
		const user_token = await this.prisma.tokens.upsert({
			where: {
				tokens_user_id: user_id
			},
			update: {
				access_token: await this.jwtService.signAsync(payload, {expiresIn: '10s', secret: process.env.JWT_SECRET}),
				refresh_token:await this.jwtService.signAsync(payload, {expiresIn: '5m', secret: process.env.JWT_SECRET}),
			},
			create: {
				tokens_user_id: user_id,
				access_token: await this.jwtService.signAsync(payload, {expiresIn: '10s', secret: process.env.JWT_SECRET}),
				refresh_token:await this.jwtService.signAsync(payload, {expiresIn: '5m', secret: process.env.JWT_SECRET}),
			},
		});
		if (user_token == null)
			return {status: false, message: "토큰 발급 실패"}
		else
			return {status: true, message: "토큰 발급 성공", access_token: user_token.access_token, refresh_token: user_token.refresh_token};
	}

	async PostAuth(token : TokenDto)
	{
		const getTokenConfig = {
			url: '/oauth/token/info',
			method: 'get',
			baseURL : 'https://api.intra.42.fr/',
			headers : {'Authorization': `Bearer ${token.access_token}`}
		};
		try {
			const { data } = await firstValueFrom(this.httpService.request(getTokenConfig));
			const userData = await this.prisma.user.findUnique({
				where: {
				  user_id: data.resource_owner_id,
				},
			});
			if (userData === null)
				return {status: false, access_token: token.access_token};
			else // access_token 발급 refresh_token 발급
			{
				const tokenData = await this.CreateToken(userData.user_id);
				return {status: true, userdata: await this.userService.GetUserDataById(userData.user_id), token: tokenData};
			}
		} catch (error) {
			console.error(error);
		}
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
	});
  }
  /**
   * @description 클라이언트가 전송한 Jwt 토큰 정보
   *
   * @param payload 토큰 전송 내용
   */
  async validate(payload: UserToken): Promise<any> {
	const storedToken = await this.prisma.tokens.findUnique({
		where: {
		  tokens_user_id: payload.user_id,
		},
	});
	if (storedToken == null)
		throw new UnauthorizedException();
	if (payload.uuid !== this.jwtService.decode(storedToken.access_token)["uuid"])
		throw new UnauthorizedException();
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
	  //검증 비밀 값(유출 주의)
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
	const storedToken = await this.prisma.tokens.findUnique({
		where: {
		  tokens_user_id: payload.user_id,
		},
	});
	if (storedToken == null)
		throw new UnauthorizedException();
	if (storedToken.access_token !== req.body.access_token || 
		payload.uuid !== this.jwtService.decode(storedToken.refresh_token)["uuid"])
		throw new UnauthorizedException(); 
	try {
		const done_data = await this.jwtService.verifyAsync(storedToken.access_token, { secret: process.env.JWT_SECRET });
	} catch (error) {
		if (error instanceof TokenExpiredError)
			return { status: true };
	}
	throw new UnauthorizedException(); 
  }
}
