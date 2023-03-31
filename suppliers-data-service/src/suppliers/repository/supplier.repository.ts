import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/queries/supplier.entity';
import { Role } from '../entities/queries/role.entity';
import { Sector } from '../entities/queries/sector.entity';

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
    if (supplier)
      return {
        id: supplier.id,
        vatNumber: supplier.vatNumber,
        name: supplier.name,
        country: supplier.country,
        sectors: supplier.sectors.map((sector) => sector.sector),
        roles: supplier.roles.map((role) => role.role),
      };
  }

  async save(
    id: string,
    name: string,
    country: string,
    vatNumber: number | undefined,
    roles: string[] | undefined,
    sectors: string[] | undefined,
  ): Promise<unknown> {
    const newSupplier = this.supplierRepo.create({
      id,
      name,
      country,
      vatNumber,
    });

    if (sectors)
      newSupplier.sectors = sectors.map((sector: string) =>
        this.sectorRepo.create({ sector }),
      );
    else newSupplier.sectors = [];
    if (roles)
      newSupplier.roles = roles.map((role: string) =>
        this.roleRepo.create({ role }),
      );
    else newSupplier.roles = [];

    return this.supplierRepo.save(newSupplier);
  }

  async deleteOne(id: string) {
    return this.supplierRepo.delete({ id });
  }
}
