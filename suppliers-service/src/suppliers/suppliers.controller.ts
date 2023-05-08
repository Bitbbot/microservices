import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-request.dto';
import { Result } from './interfaces/result.interface';
import { GetSupplierDto } from './dto/get-request.dto';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @GrpcMethod('SupplierService', 'CreateSupplier')
  createSupplier(data: CreateSupplierDto): Promise<Result> {
    return this.suppliersService.createSupplier(data);
  }

  @GrpcMethod('SupplierService', 'GetSupplier')
  getSupplier(data: GetSupplierDto): Promise<any> {
    return this.suppliersService.getSupplier(data);
  }

  @GrpcMethod('SupplierService', 'GetSuppliers')
  getSuppliers(): Promise<any> {
    return this.suppliersService.getSuppliers();
  }
}
