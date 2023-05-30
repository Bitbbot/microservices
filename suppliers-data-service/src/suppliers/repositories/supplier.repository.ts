import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/queries/supplier.entity';
import { Role } from '../entities/queries/role.entity';
import { Sector } from '../entities/queries/sector.entity';
import { mapFindOneToModel, mapSaveToModel } from './model.mappers';

@Injectable()
export class SupplierRepository {
  constructor(
    @InjectRepository(Supplier, 'queries')
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Role, 'queries')
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Sector, 'queries')
    private readonly sectorRepo: Repository<Sector>,
  ) {}

  async findAll() {
    return this.supplierRepo.find();
  }

  async findOne(id: string) {
    const supplier = await this.supplierRepo.findOne({
      where: { id },
    });
    if (supplier) return mapFindOneToModel(supplier);
  }

  async save(
    id: string,
    name: string,
    country: string,
    vatNumber: number,
    roles: string[] | undefined,
    sectors: string[] | undefined,
  ): Promise<unknown> {
    const newSupplier = mapSaveToModel(
      id,
      name,
      country,
      vatNumber,
      roles,
      sectors,
    );

    return this.supplierRepo.save(newSupplier);
  }

  async deleteOne(id: string) {
    return this.supplierRepo.delete({ id });
  }
}
