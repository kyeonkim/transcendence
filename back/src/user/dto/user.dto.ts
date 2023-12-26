import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

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