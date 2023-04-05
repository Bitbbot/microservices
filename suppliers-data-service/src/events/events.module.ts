import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from '../suppliers/commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from '../suppliers/queries/handlers';
import { SuppliersSagas } from './sagas/suppliers.sagas';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/events/event.entity';
import { EventRepository } from './repositories/events.repository';
import { EventsController } from './events.controller';

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => SuppliersModule),
    TypeOrmModule.forFeature([Event], 'events'),
  ],
  controllers: [EventsController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    SuppliersSagas,
    EventRepository,
  ],
})
export class EventsModule {}
