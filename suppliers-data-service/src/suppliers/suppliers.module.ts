import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/events/event.entity';
import { SuppliersController } from './suppliers.controller';
import { Role } from './entities/queries/role.entity';
import { Sector } from './entities/queries/sector.entity';
import { Supplier } from './entities/queries/supplier.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { SupplierRepository } from './repository/supplier.repository';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { SuppliersSagas } from './sagas/suppliers.sagas';
import { EventRepository } from './repository/events.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Event], 'events'),
    TypeOrmModule.forFeature([Role, Sector, Supplier], 'queries'),
  ],
  controllers: [SuppliersController],
  providers: [
    SupplierRepository,
    EventRepository,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    SuppliersSagas,
  ],
})
export class SuppliersModule {}
