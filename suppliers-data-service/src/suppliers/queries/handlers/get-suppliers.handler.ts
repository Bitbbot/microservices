import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSuppliersQuery } from '../impl/get-suppliers.query';
import { SupplierRepository } from '../../repository/supplier.repository';

@QueryHandler(GetSuppliersQuery)
export class GetSuppliersHandler implements IQueryHandler<GetSuppliersQuery> {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(query: GetSuppliersQuery) {
    return this.repository.findAll();
  }
}
