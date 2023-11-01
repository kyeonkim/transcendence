import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class SignUpDto 
{
    @ApiProperty()
    @IsString()
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