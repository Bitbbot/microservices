import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { IResponse } from './entities/response';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcSupplierInterface } from './entities/grpc.supplier.interface';
import { v4 as uuidv4 } from 'uuid';
import { handleCertificates } from './utils/handle-certificates';

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
    //get & validate files
    const res = await handleCertificates(certificates);
    if (!Array.isArray(res)) return res;

    return new Promise((resolve, reject) => {
      const obs = this.supplierService.createSupplier({
        id: uuidv4(),
        country,
        name,
        vatNumber,
        roles,
        sectors,
        certificates: res,
      });
      obs.subscribe({
        next(data) {
          resolve(data);
        },
        error(error) {
          reject(error);
        },
      });
    });
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
