import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

	PostAuth(token : string) : boolean {
		console.log(token);
		return true;
	}
}
