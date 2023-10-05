import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: ["http://localhost:3000",  "http://10.13.8.3:3000"],});
  await app.listen(4242);
}
bootstrap();
