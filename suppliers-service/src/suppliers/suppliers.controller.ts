import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Result } from './interfaces/result.interface';
import { GetSupplierDto } from './dto/get-request.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @GrpcMethod('SupplierService', 'CreateSupplier')
  async createSupplier(data: CreateSupplierDto): Promise<Result> {
    const certificateResponse = await this.suppliersService.createCertificates(
      data,
    );
    const supplierResponse = await this.suppliersService.createSupplier(data);
    if (certificateResponse.status === 200 && supplierResponse.status === 201)
      return { status: 200, message: 'success' };
    else
      return {
        status: supplierResponse.status,
        message: supplierResponse.message,
      };
  }

  @GrpcMethod('SupplierService', 'GetSupplier')
  getSupplier(data: GetSupplierDto): Promise<any> {
    return this.suppliersService.getSupplier(data);
  }

  @GrpcMethod('SupplierService', 'GetSuppliers')
  getSuppliers(): Promise<any> {
    return this.suppliersService.getSuppliers();
  }

  @GrpcMethod('SupplierService', 'DeleteSupplier')
  deleteSupplier(data: DeleteSupplierDto): Promise<Result> {
    return this.suppliersService.deleteSupplier(data);
  }

  @GrpcMethod('SupplierService', 'UpdateSupplier')
  updateSupplier(data: UpdateSupplierDto): Promise<any> {
    return this.suppliersService.updateSupplier(data);
  }
}
