import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.SUPPLIERS_DATA_SERVICE_PORT));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
}
bootstrap();
