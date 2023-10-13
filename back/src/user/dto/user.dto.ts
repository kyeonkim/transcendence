import { ApiProperty } from "@nestjs/swagger";

export class createUserDto 
{
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    nick_name: string;
    
    @ApiProperty()
    img_name: string;
}

export class addFriendDto
{
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    friend_id: number;
}

export class getUserDto
{
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    nick_name: string;
}