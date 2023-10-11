import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { tokenDto } from './dto/token.dto';

@Injectable()
export class UserService {
	constructor(private readonly httpService: HttpService) {}

    async PostAuth(token : tokenDto) : Promise<boolean>
	{
		const getTokenConfig = {
			url: '/oauth/token/info',
			method: 'get',
			baseURL : 'https://api.intra.42.fr/',
			headers : {'Authorization': `Bearer ${token.access_token}`}
		};
		try {
			const { data } = await firstValueFrom(this.httpService.request(getTokenConfig));
			console.log(data);
			console.log(data.resource_owner_id);
		} catch (error) {
			console.error(error);
		}
		return true;
	}
}
