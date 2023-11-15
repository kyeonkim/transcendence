import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Matches } from "class-validator";
import { eventDto } from "src/event/dto/event.dto";

export class SignUpDto 
{
    @ApiProperty()
    @IsString()
    @Matches(/^[a-zA-Z0-9]$/, {message: `영문자와 숫자만 입력 가능합니다.`})
    access_token: string;

    @ApiProperty()
    @IsString()
    nick_name: string;
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

