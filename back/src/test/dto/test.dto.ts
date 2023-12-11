import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class testMessageDto
{
    @ApiProperty()
    @IsNumber()
    user_id: number;

    @ApiProperty()
    @IsNumber()
    target_id: number;

    @ApiProperty()
    @IsString()
    message: string;
}