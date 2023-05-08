import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SuppliersService } from './suppliers.service';
import { SupplierRequest } from './interfaces/supplier-request.interface';
import { Result } from './interfaces/result.interface';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @GrpcMethod('SupplierService', 'CreateSupplier')
  createSupplier(data: SupplierRequest): Promise<Result> {
    return this.suppliersService.createSupplier(data);
  }

  @GrpcMethod('SupplierService', 'GetSupplier')
  getSupplier(data: { id: string }): Promise<Result> {
    return this.suppliersService.getSupplier(data);
  }
}
