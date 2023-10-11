import { Injectable } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class PrismaService {

    async CreateUser(user : createUserDto) : Promise<boolean>
    {

        return true;
    }
}
