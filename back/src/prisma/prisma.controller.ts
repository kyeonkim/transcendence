import { Post, Body, Controller } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { createUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('prisma API')
@Controller('prisma')
export class PrismaController {
	constructor(private readonly PrismaService: PrismaService) {}

    @ApiOperation({summary: `유저 생성 API`, description: `새로생성된 유저를 db에 저장한다.`})
    // @ApiResponse({status: 201, description:`default value 4242` })
    @Post("createuser")
    CreateUser(@Body() user : createUserDto) : Promise<boolean>
    {
        return this.PrismaService.CreateUser(user);
    }
}
