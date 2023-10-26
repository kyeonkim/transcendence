import { ApiProperty } from "@nestjs/swagger";

export class gameDataDto
{
    @ApiProperty()
    rank: boolean;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    enemy_id: number;

    @ApiProperty()
    my_score: number;

    @ApiProperty()
    enemy_score: number;
}