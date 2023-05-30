import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcSupplierInterface } from './entities/grpc.supplier.interface';
import { v4 as uuidv4 } from 'uuid';
import { handleCertificates } from './utils/handle-certificates';
import { map } from 'rxjs';

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
  }: CreateSupplierInput) {
    try {
      const res = await handleCertificates(certificates);
      if (!Array.isArray(res)) return res;

      return this.supplierService
        .createSupplier({
          id: uuidv4(),
          country,
          name,
          vatNumber,
          roles,
          sectors,
          certificates: res,
        })
        .pipe(map((data) => data));
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      return this.supplierService
        .GetSuppliers({})
        .pipe(map((data) => data.suppliers));
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      return this.supplierService.GetSupplier({ id }).pipe(map((data) => data));
    } catch (error) {
      return error;
    }
  }

  async update({
    id,
    vatNumber,
    name,
    certificates,
    sectors,
    roles,
    country,
    deleteCertificates,
  }: UpdateSupplierInput) {
    try {
      const res = await handleCertificates(certificates);
      if (!Array.isArray(res)) return res;

      return this.supplierService
        .updateSupplier({
          id,
          country,
          name,
          vatNumber,
          roles,
          sectors,
          deleteCertificates,
          addCertificates: res,
        })
        .pipe(map((data) => data));
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      return this.supplierService
        .deleteSupplier({ id })
        .pipe(map((data) => data));
    } catch (error) {
      return error;
    }
  }
}
