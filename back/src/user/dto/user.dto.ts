import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class friendDto
{
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    friend_id?: number;

    @ApiProperty()
    @IsString()
    friend_nick_name: string;
}

export class getUserDto
{
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsString()
    nick_name: string;
}

export class uploadImgDto
{
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File;
}