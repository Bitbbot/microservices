import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SuppliersModule } from './suppliers/suppliers.module';

const URL = 'localhost:50051';

const microserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'supplier',
    url: URL,
    protoPath: join(__dirname, '../src/suppliers/supplier.proto'),
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );
  await app.listen();
}
bootstrap();
