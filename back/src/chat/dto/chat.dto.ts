import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsString } from "class-validator";
import { Socket } from "dgram";

export class CreateRoomDto
{
    // @ApiProperty()
    // @IsInt()
    // user_id: number;

    // @ApiProperty()
    // @IsString()
    // chatroom_name: string;

    // @ApiProperty()
    // @IsString()
    // password: string;

    // @ApiProperty()
    // @IsBoolean()
    // private: boolean;

    @ApiProperty()
    socket: any;
}