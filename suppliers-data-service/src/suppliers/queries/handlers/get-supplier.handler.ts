import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSupplierQuery } from '../impl/get-supplier.query';
import { SupplierRepository } from '../../repository/supplier.repository';

@QueryHandler(GetSupplierQuery)
export class GetSupplierHandler implements IQueryHandler<GetSupplierQuery> {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(query: GetSupplierQuery) {
    return this.repository.findOne(query.id);
  }
}
