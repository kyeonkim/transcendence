import { ApiProperty } from "@nestjs/swagger";

export class tokenDto {
    @ApiProperty()
    access_token: string;
}