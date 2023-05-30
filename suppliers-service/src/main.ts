import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'supplier',
        url: configService.get<string>('SUPPLIERS_SERVICE_URL'),
        protoPath: join(__dirname, '../src/suppliers/supplier.proto'),
      },
    },
  );
  await app.listen();
}

bootstrap();
