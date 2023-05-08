import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { Role } from './entities/queries/role.entity';
import { Sector } from './entities/queries/sector.entity';
import { Supplier } from './entities/queries/supplier.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { SupplierRepository } from './repositories/supplier.repository';
import { EventsModule } from '../events/events.module';
import { EventHandlers } from './events/handlers';
import { ResponseStatusInterceptor } from './interceptors/createSupplier.status.interceptor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CqrsModule,
    TypeOrmModule.forFeature([Role, Sector, Supplier], 'queries'),
    forwardRef(() => EventsModule),
    ClientsModule.register([
      {
        name: 'CERT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [`${process.env.BROKER_URL}`],
          },
          consumer: {
            groupId: `${process.env.KAFKA_CONSUMER_GROUP_ID}`,
          },
        },
      },
    ]),
  ],
  controllers: [SuppliersController],
  providers: [SupplierRepository, ...EventHandlers, ResponseStatusInterceptor],
  exports: [SupplierRepository],
})
export class SuppliersModule {}
