import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SuppliersService } from './suppliers.service';
import { Readable } from 'stream';
import { SupplierRequest } from './interfaces/supplier-request.interface';
import { Result } from './interfaces/result.interface';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @GrpcMethod('SupplierService', 'CreateSupplier')
  createSupplier(data: SupplierRequest): Result {
    // Here you can process the received data, for example, save it to a database or a file
    console.log(data);
    // console.log('here');
    // Return the response to the client
    return this.suppliersService.addCertificate(data);
  }
}
