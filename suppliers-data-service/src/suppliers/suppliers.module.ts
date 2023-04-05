import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { Role } from './entities/queries/role.entity';
import { Sector } from './entities/queries/sector.entity';
import { Supplier } from './entities/queries/supplier.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { SupplierRepository } from './repositories/supplier.repository';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Role, Sector, Supplier], 'queries'),
    forwardRef(() => EventsModule),
  ],
  controllers: [SuppliersController],
  providers: [SupplierRepository],
  exports: [SupplierRepository],
})
export class SuppliersModule {}
