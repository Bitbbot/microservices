import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SupplierRepository } from '../../repositories/supplier.repository';
import { DeleteSupplierEvent } from '../impl/delete-supplier.event';

@EventsHandler(DeleteSupplierEvent)
export class DeleteSupplierHandler
  implements IEventHandler<DeleteSupplierEvent>
{
  constructor(private readonly repository: SupplierRepository) {}
  handle(event: DeleteSupplierEvent): any {
    return this.repository.deleteOne(event.id);
  }
}
