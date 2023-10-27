import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

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