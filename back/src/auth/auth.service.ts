import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
	constructor(private readonly httpService: HttpService) {}

	async PostAuth(user : createUserDto) : Promise<boolean> {
		const getTokenConfig = {
			url: '/oauth/token/info',
			method: 'get',
			baseURL : 'https://api.intra.42.fr/',
			headers : {'Authorization': `Bearer ${user.access_token}`}
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
