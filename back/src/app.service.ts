import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(AppService.name);

  getHello(): string
  {
    let id:number = 42;
    this.logger.debug("Logging...");
    this.logger.debug("id : " + id);
    return 'Hello World!!!';
  }

  getSeoul(): string
  {
    return 'Hello 42Seoul!'
  }
  
  getLogin(): Promise<AxiosResponse>
  {
    const dummyData = {
      id: 1,
      title: '더미 데이터',
      content: '이것은 더미 데이터 예제입니다.',
    };
    const axiosResponse: AxiosResponse = {
      data: dummyData,
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
      config: undefined
    };
    this.logger.debug("42login Service Call...");
    return Promise.resolve(axiosResponse);
  }
}