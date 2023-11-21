import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

export class gameDataDto
{
    @ApiProperty()
    @IsBoolean()
    rank: boolean;

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