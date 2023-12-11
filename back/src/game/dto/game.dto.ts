import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class gameDataDto
{
    @ApiProperty()
    @IsBoolean()
    rank: boolean;

    @ApiProperty()
    @IsString()
    user_nickname : string;

    @ApiProperty()
    @IsNumber()
    user_id: number;

    @ApiProperty()
    @IsNumber()
    enemy_id: number;

    @ApiProperty()
    @IsNumber()
    my_score: number;

    @ApiProperty()
    @IsNumber()
    enemy_score: number;
}

export class gameRoomDto
{
    @ApiProperty()
    @IsNumber()
    user1_id: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    user1_nickname?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    user2_id: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    user2_nickname?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    event_id: number;
}

export class leaveGameRoomDto
{
    @ApiProperty()
    @IsNumber()
    user_id: number;
}

export class readyGameDto
{
    @ApiProperty()
    @IsBoolean()
    game_mode: boolean;

    @ApiProperty()
    @IsNumber()
    user_id: number;

    @ApiProperty()
    @IsBoolean()
    ready: boolean;
}

export class startGameDto
{
    @ApiProperty()
    @IsNumber()
    user_id: number;
}