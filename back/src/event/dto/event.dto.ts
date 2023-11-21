import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class eventDto
{
    @ApiProperty()
    @IsInt()
    to: number;

    @ApiProperty()
    @IsString()
    type: string;// 'add_friend' | 'invite_game' | 'invite_chat'

    @ApiProperty()
    @IsString()
    from: string;

    @ApiProperty()
    @IsInt()
    chatroom_id?: number;

    @ApiProperty()
    @IsString()
    chatroom_name?: string;
}