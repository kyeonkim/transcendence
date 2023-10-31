import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";


export class friendDto
{
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsString()
    user_nickname: string;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    friend_id?: number;

    @ApiProperty()
    @IsString()
    friend_nick_name: string;
}