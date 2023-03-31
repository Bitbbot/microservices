import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddSupplierCommand } from '../impl/add-supplier.command';
import { SupplierRepository } from '../../repository/supplier.repository';
import { Supplier } from '../../models/supplier.model';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(AddSupplierCommand)
export class AddSupplierHandler implements ICommandHandler<AddSupplierCommand> {
  constructor(
    private readonly repository: SupplierRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddSupplierCommand) {
    const { id, name, country, vatNumber, roles, sectors, traceId } = command;

    const doesExist = await this.repository.findOne(id);
    if (doesExist)
      throw new HttpException(
        'supplier with the same id already exists',
        HttpStatus.BAD_REQUEST,
      );

    const supplier = this.publisher.mergeObjectContext(
      new Supplier(id, name, country, vatNumber, roles, sectors, traceId),
    );

    supplier.addSupplier();
    supplier.commit();
  }
}
