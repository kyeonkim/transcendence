import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Matches } from "class-validator";

export class FtSignUpDto 
{
    @ApiProperty()
    @IsString()
    access_token: string;

    @ApiProperty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_]*$/, {message: `영문자와 숫자만 입력 가능합니다.`})
    nick_name: string;
}

// 구글, 일반 로그인 구현 필요 - kyeonkim
export class SignUpDto 
{
    @ApiProperty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_]*$/, {message: `영문자와 숫자만 입력 가능합니다.`})
    nick_name: string;

    @ApiProperty()
    @IsString()
    password: string;
}

export class LoginDto {
    @ApiProperty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_]*$/, {message: `영문자와 숫자만 입력 가능합니다.`})
    nick_name: string;

    @ApiProperty()
    @IsString()
    password: string;
}

export class TokenDto {
    @ApiProperty()
    @IsString()
    access_token: string;
}

export class TwoFADTO {
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsString()
    user_nickname: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    secret?: string;

    @ApiProperty()
    // @IsString()
    @IsOptional()
    code?: string;
}

export class GoogleLoginDto {
    @ApiProperty()
    @IsString()
    code: string;
}
