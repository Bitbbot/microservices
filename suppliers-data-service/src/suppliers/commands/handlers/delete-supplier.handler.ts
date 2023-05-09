import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SupplierRepository } from '../../repositories/supplier.repository';
import { Supplier } from '../../models/supplier.model';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DeleteSupplierCommand } from '../impl/delete-supplier.command';

@CommandHandler(DeleteSupplierCommand)
export class DeleteSupplierHandler
  implements ICommandHandler<DeleteSupplierCommand>
{
  constructor(
    private readonly repository: SupplierRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteSupplierCommand) {
    const { id, traceId } = command;

    const supplier = await this.repository.findOne(id);
    if (!supplier)
      throw new HttpException(
        'supplier does not exists',
        HttpStatus.BAD_REQUEST,
      );

    const newSupplier = this.publisher.mergeObjectContext(
      new Supplier(
        supplier.id,
        supplier.name,
        supplier.country,
        supplier.vatNumber,
        supplier.roles,
        supplier.sectors,
        traceId,
      ),
    );
    newSupplier.deleteSupplier();
    newSupplier.commit();
  }
}
