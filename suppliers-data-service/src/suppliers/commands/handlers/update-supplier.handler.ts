import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSupplierCommand } from '../impl/update-supplier.command';
import { SupplierRepository } from '../../repositories/supplier.repository';
import { Supplier } from '../../models/supplier.model';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(UpdateSupplierCommand)
export class UpdateSupplierHandler
  implements ICommandHandler<UpdateSupplierCommand>
{
  constructor(
    private readonly repository: SupplierRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSupplierCommand) {
    const { id, name, country, vatNumber, roles, sectors, traceId } = command;

    const doesExist = await this.repository.findOne(id);
    if (!doesExist)
      throw new HttpException(
        'supplier with specified id does not exist',
        HttpStatus.BAD_REQUEST,
      );

    const supplier = this.publisher.mergeObjectContext(
      new Supplier(id, name, country, vatNumber, roles, sectors, traceId),
    );

    supplier.updateSupplier();
    supplier.commit();
  }
}
