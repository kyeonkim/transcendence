import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    let id:number = 42;
    this.logger.debug("Logging...");
    this.logger.debug("id : " + id);
    return 'Hello World!';
  }
  getSeoul(): string {
    return 'Hello 42Seoul!'
  }
}
