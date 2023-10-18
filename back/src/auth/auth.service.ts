import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { IntraTokenDto, UserTokenDto } from 'src/auth/dto/token.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
        private userService: UserService,
		private readonly httpService: HttpService,
		private jwtService: JwtService,
		private prisma: PrismaService,
        ) {}
        
    // async ReCreateToken(token: UserTokenDto)
    // {
    //     //0. token 디코딩
    //     try {
    //     }
    //     //1. access토큰이 만료가 되었고
    //     //2. 우리가 최근에 발급한 access 토큰이고
    //     //3. refresh 토큰이 만료가 되지않았고
    //     //4. refresh 토큰이 일치하면 -> 재발급 하나라도 아니면 로그아웃.
    //     // if( )//userid와 refresh_token 일치여부 확인
    //     // return await this.CreateToken(token.user_id);// 새토큰 발급
    // }
	async CreateToken(user_id: number)
	{
		const payload = { user_id: user_id };
		const user_token = await this.prisma.tokens.upsert({
			where: {
				tokens_user_id: user_id
			},
			update: {
				access_token: await this.jwtService.signAsync(payload, {expiresIn: '30s', secret: process.env.JWT_SECRET}),
				refresh_token:await this.jwtService.signAsync(payload, {expiresIn: '35s', secret: process.env.JWT_SECRET}),
			},
			create: {
				tokens_user_id: user_id,
				access_token: await this.jwtService.signAsync(payload, {expiresIn: '30s', secret: process.env.JWT_SECRET}),
				refresh_token:await this.jwtService.signAsync(payload, {expiresIn: '35s', secret: process.env.JWT_SECRET}),
			},
		});
		console.log("==============User_token_data=============\n\n",user_token);
		if (user_token == null)
			return {status: false, message: "토큰 발급 실패"}
		else
			return {status: true, message: "토큰 발급 성공", access_token: user_token.access_token, refresh_token: user_token.refresh_token};
	}

	async PostAuth(token : IntraTokenDto)
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
				return {sign: false, access_token: token.access_token};
			else // access_token 발급 refresh_token 발급
			{
				const tokenData = await this.CreateToken(userData.user_id);
				return {sign: true, userdata: await this.userService.GetUserDataById(userData.user_id), token: tokenData};
			}
		} catch (error) {
			console.error(error);
		}
	}
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor() {
	super({
	  //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
	  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	  //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
	  ignoreExpiration: false,
	  //검증 비밀 값(유출 주의)
	  secretOrKey: process.env.JWT_SECRET,
	  // passReqToCallback: true,
	});
  }
  /**
   * @description 클라이언트가 전송한 Jwt 토큰 정보
   *
   * @param payload 토큰 전송 내용
   */
  async validate(payload: UserTokenDto): Promise<any> {
	console.log(payload);
	if (payload. === true)
		return { status: true };
	throw new UnauthorizedException();
  }
}


