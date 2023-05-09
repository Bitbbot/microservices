export interface UpdateSupplierDto {
  id: string;
  country: string;
  name: string;
  vatNumber: number;
  roles: string[];
  sectors: string[];
  certificates: Certificate[];
  deleteCertificates: string[];
}
interface Certificate {
  filename: string;
  file: Uint8Array;
}
