import { ApiProperty } from "@nestjs/swagger";

export class friendDto
{
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    friend_id: number;
}

export class getUserDto
{
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    nick_name: string;
}

export class uploadImgDto
{
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File;
}