import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: process.env.FRONTEND_DOMAIN, credentials: true });
  await app.listen(process.env.PORT);
  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
