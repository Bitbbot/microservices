import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersResolver } from './suppliers.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUPP_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get('SUPPLIER_SERVICE_URL'),
            package: 'supplier',
            protoPath: join(__dirname, '../../src/suppliers/supplier.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [SuppliersResolver, SuppliersService],
})
export class SuppliersModule {}
