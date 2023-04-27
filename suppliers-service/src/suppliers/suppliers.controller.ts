import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { SuppliersService } from './suppliers.service';

interface INumberArray {
  data: number[];
}
interface ISumOfNumberArray {
  sum: number;
}

@Controller()
export class SuppliersController {
  private logger = new Logger('AppController');
  constructor(private readonly suppliersService: SuppliersService) {}

  @GrpcMethod('SupplierService', 'Accumulate')
  accumulate(numberArray: INumberArray, metadata: any): ISumOfNumberArray {
    console.log('k');
    this.logger.log('Adding ' + numberArray.toString());
    return { sum: this.suppliersService.accumulate(numberArray.data) };
  } //
}
