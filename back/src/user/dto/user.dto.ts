import { ApiProperty } from "@nestjs/swagger";

export class createUserDto 
{
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    nick_name: string;
    
    @ApiProperty()
    img_name: string;
}

export class addUserDto
{
    @ApiProperty()
    first_user_id: number;

    @ApiProperty()
    second_user_id: number;
}