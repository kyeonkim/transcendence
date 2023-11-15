import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { Socket } from "dgram";

export class ChatRoomDto
{
    @ApiProperty()
    @IsInt()
    @IsOptional()
    room_idx?: number;

    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsString()
    user_nickname: string;

    @ApiProperty()
    @IsString()
    chatroom_name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty()
    @IsBoolean()
    private: boolean;
}

export class JoinRoomDto
{
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsString()
    user_nickname: string;
    

    @ApiProperty()
    @IsInt()
    room_id: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    event_id?: number;
}

export class SetChatUserDto
{
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsInt()
    room_id: number;

    @ApiProperty()
    @IsInt()
    target_id: number;

    @ApiProperty()
    @IsString()
    target_nickname: string;
}