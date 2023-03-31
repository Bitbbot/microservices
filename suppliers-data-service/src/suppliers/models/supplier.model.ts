import { AggregateRoot } from '@nestjs/cqrs';
import { AddSupplierEvent } from '../events/impl/add-supplier.event';
import { DeleteSupplierEvent } from '../events/impl/delete-supplier.event';
import { UpdateSupplierEvent } from '../events/impl/update-supplier.event';

export class Supplier extends AggregateRoot {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly country: string,
    private readonly vatNumber: number | undefined,
    private readonly roles: string[] | undefined,
    private readonly sectors: string[] | undefined,
    private readonly traceId: string,
  ) {
    super();
  }

  addSupplier() {
    this.apply(
      new AddSupplierEvent(
        this.id,
        this.name,
        this.country,
        this.vatNumber,
        this.roles,
        this.sectors,
        this.traceId,
      ),
    );
  }
  deleteSupplier() {
    this.apply(
      new DeleteSupplierEvent(
        this.id,
        this.name,
        this.country,
        this.vatNumber,
        this.roles,
        this.sectors,
        this.traceId,
      ),
    );
  }
  updateSupplier() {
    this.apply(
      new UpdateSupplierEvent(
        this.id,
        this.name,
        this.country,
        this.vatNumber,
        this.roles,
        this.sectors,
        this.traceId,
      ),
    );
  }
}
