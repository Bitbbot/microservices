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

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Role, Sector, Supplier], 'queries'),
    forwardRef(() => EventsModule),
    ClientsModule.register([
      {
        name: 'CERT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: '1',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: '1',
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
