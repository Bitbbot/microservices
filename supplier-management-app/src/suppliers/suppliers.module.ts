import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersResolver } from './suppliers.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ClientsModule.register([
      {
        name: 'SUPP_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.SUPPLIER_SERVICE_URL,
          package: 'supplier',
          protoPath: join(__dirname, '../../src/suppliers/supplier.proto'),
        },
      },
    ]),
  ],
  providers: [SuppliersResolver, SuppliersService],
})
export class SuppliersModule {}
