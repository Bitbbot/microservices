export interface CreateSupplierDto {
  id: string;
  country: string;
  name: string;
  vatNumber: number;
  roles: string[];
  sectors: string[];
  certificates: Certificate[];
}
interface Certificate {
  filename: string;
  file: Uint8Array;
}
