import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto 
{
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    nick_name: string;
}

export class TokenDto {
    @ApiProperty()
    access_token: string;
}