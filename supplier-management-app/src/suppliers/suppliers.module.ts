import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersResolver } from './suppliers.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SUPP_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: 'supplier',
          protoPath: join(__dirname, '../../src/suppliers/supplier.proto'),
        },
      },
    ]),
  ],
  providers: [SuppliersResolver, SuppliersService],
})
export class SuppliersModule {}
