import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { IResponse } from './entities/response';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { GrpcSupplierInterface } from './entities/grpc.supplier.interface';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class SuppliersService implements OnModuleInit {
  private supplierService: GrpcSupplierInterface;
  constructor(@Inject('SUPP_PACKAGE') private client: ClientGrpc) {}
  onModuleInit(): any {
    this.supplierService =
      this.client.getService<GrpcSupplierInterface>('SupplierService');
  }

  async create({
    vatNumber,
    name,
    certificates,
    sectors,
    roles,
    country,
  }: CreateSupplierInput): Promise<IResponse> {
    const files = [];
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'svg', 'webp'];

    for (let certificate of certificates) {
      const { createReadStream, filename } = await certificate;
      const fileExt = filename.split('.').pop();
      // console.log(fileExt);
      if (!allowedExtensions.includes(fileExt))
        throw new HttpException('Wrong file extension', HttpStatus.BAD_REQUEST);

      // const file = createReadStream();
      // console.log(file);
      await createReadStream()
        .pipe(createWriteStream(join(process.cwd(), `/temp/${filename}`)))
        .on('finish', () => {})
        .on('error', () => {
          return new HttpException(
            'Could not save image',
            HttpStatus.BAD_REQUEST,
          );
        });
      // await createReadStream().pipe();
      files.push(filename);
    }

    const { createReadStream, filename } = await certificates[0];
    const file = fs.readFileSync(join(process.cwd(), `/temp/${filename}`));

    // const file = createReadStream();

    const obs = this.supplierService.createSupplier({
      id: uuidv4(),
      country,
      name,
      vatNumber,
      roles,
      sectors,
      certificates: [file],
    });
    obs.subscribe({
      next(x) {
        // console.log(x);
      },
      complete() {
        // console.log('complete');
      },
    });
    return { status: 200 };
  }

  findAll() {
    return `This action returns all suppliers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierInput: UpdateSupplierInput) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
