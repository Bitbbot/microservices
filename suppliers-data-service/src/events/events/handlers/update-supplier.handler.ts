import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateSupplierEvent } from '../impl/update-supplier.event';
import { SupplierRepository } from '../../../suppliers/repositories/supplier.repository';

@EventsHandler(UpdateSupplierEvent)
export class UpdateSupplierHandler
  implements IEventHandler<UpdateSupplierEvent>
{
  constructor(private readonly repository: SupplierRepository) {}
  handle(event: UpdateSupplierEvent): any {
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
