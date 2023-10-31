import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class eventDto
{
    @ApiProperty()
    @IsInt()
    to: number;

    @ApiProperty()
    @IsString()
    type: string;

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