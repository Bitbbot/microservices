import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

export function mapCreateSupplierDtoToData(data: CreateSupplierDto): any {
  return {
    id: data.id,
    name: data.name,
    country: data.country,
    vatNumber: String(data.vatNumber),
    roles: data.roles,
    sectors: data.sectors,
  };
}

export function mapUpdateSupplierDtoToData(data: UpdateSupplierDto): any {
  return {
    id: data.id,
    name: data.name,
    country: data.country,
    vatNumber: String(data.vatNumber),
    roles: data.roles,
    sectors: data.sectors,
    deleteFiles: data.deleteCertificates,
  };
}
