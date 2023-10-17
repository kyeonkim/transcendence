import { ApiProperty } from "@nestjs/swagger";

export class IntraTokenDto {
    @ApiProperty()
    access_token: string;
}

export class UserTokenDto {
    @ApiProperty()
    user_id: number;
    @ApiProperty()
    access_token: string;
    @ApiProperty()
    refresh_token: string;
}