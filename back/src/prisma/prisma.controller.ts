import { Post, Body, Controller } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { createUserDto } from './dto/create-user.dto';

@Controller('prisma')
export class PrismaController {
	constructor(private readonly PrismaService: PrismaService) {}

    @Post("createuser")
    CreateUser(@Body() user : createUserDto) : Promise<boolean>
    {
        return this.PrismaService.CreateUser(user);
    }
}
