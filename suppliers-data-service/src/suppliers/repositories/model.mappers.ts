import { Supplier } from '../entities/queries/supplier.entity';
import { Sector } from '../entities/queries/sector.entity';
import { Role } from '../entities/queries/role.entity';

export function mapFindOneToModel(supplier: Supplier): any {
  return {
    id: supplier.id,
    vatNumber: supplier.vatNumber,
    name: supplier.name,
    country: supplier.country,
    sectors: supplier.sectors.map((sector) => sector.sector),
    roles: supplier.roles.map((role) => role.role),
  };
}

export function mapSaveToModel(
  id: string,
  name: string,
  country: string,
  vatNumber: number,
  roles: string[] | undefined,
  sectors: string[] | undefined,
): Supplier {
  const newSupplier = new Supplier();
  newSupplier.id = id;
  newSupplier.name = name;
  newSupplier.country = country;
  newSupplier.vatNumber = vatNumber;

  newSupplier.sectors = sectors
    ? sectors.map((sector) => {
        const newSector = new Sector();
        newSector.sector = sector;
        return newSector;
      })
    : [];

  newSupplier.roles = roles
    ? roles.map((role) => {
        const newRole = new Role();
        newRole.role = role;
        return newRole;
      })
    : [];

  return newSupplier;
}
