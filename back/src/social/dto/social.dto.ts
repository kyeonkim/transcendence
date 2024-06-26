import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";


export class friendDto
{
    @ApiProperty()
    @IsInt()
    @IsOptional()
    event_id?: number;

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
    friend_nickname: string;
}

// export class blockDto
// {
//     @ApiProperty()
//     @IsInt()
//     user_id: number;

//     @ApiProperty()
//     @IsInt()
//     block_id: number;
// }