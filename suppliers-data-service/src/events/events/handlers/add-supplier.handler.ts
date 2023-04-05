import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AddSupplierEvent } from '../impl/add-supplier.event';
import { SupplierRepository } from '../../../suppliers/repositories/supplier.repository';

@EventsHandler(AddSupplierEvent)
export class AddSupplierHandler implements IEventHandler<AddSupplierEvent> {
  constructor(private readonly repository: SupplierRepository) {}
  handle(event: AddSupplierEvent): any {
    return this.repository.save(
      event.id,
      event.name,
      event.country,
      event.vatNumber,
      event.roles,
      event.sectors,
    );
  }
}
