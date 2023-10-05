import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AxiosResponse } from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("42seoul")
  getSeoul(): string {
    return this.appService.getSeoul();
  }
  @Get("42login")
  getLogin(): Promise<AxiosResponse> {
    return this.appService.getLogin();
  }
}
