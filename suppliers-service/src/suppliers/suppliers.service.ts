import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { SupplierRequest } from './interfaces/supplier-request.interface';
import * as fs from 'fs';

@Injectable()
export class SuppliersService {
  public addCertificate(data: SupplierRequest): {
    status: number;
    message: string;
  } {
    fs.writeFileSync('filename', data.certificates[0]);
    return { status: 200, message: 'File uploaded successfully' };
  }
}
