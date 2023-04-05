import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { AddSupplierEvent } from '../events/impl/add-supplier.event';
import { EventRepository } from '../repositories/events.repository';
import { UpdateSupplierEvent } from '../events/impl/update-supplier.event';
import { DeleteSupplierEvent } from '../events/impl/delete-supplier.event';

@Injectable()
export class SuppliersSagas {
  constructor(private readonly repository: EventRepository) {}
  @Saga()
  supplierAdded = (events: Observable<any>): Observable<void> => {
    return events.pipe(
      ofType(AddSupplierEvent, UpdateSupplierEvent, DeleteSupplierEvent),
      map((event) => {
        let name;
        if (event instanceof AddSupplierEvent) {
          name = 'AddSupplierEvent';
        } else if (event instanceof UpdateSupplierEvent) {
          name = 'UpdateSupplierEvent';
        } else name = 'DeleteSupplierEvent';
        this.repository.createEvent(event, name);
      }),
    );
  };
}
