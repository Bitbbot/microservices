import { Observable } from 'rxjs';

export interface GrpcSupplierInterface {
  createSupplier(data: {
    id: string;
    country: string;
    name: string;
    vatNumber: number;
    roles: string[];
    sectors: string[];
    certificates;
  }): Observable<any>;

  updateSupplier(data: {
    id: string;
    country: string;
    name: string;
    vatNumber: number;
    roles: string[];
    sectors: string[];
    addCertificates;
    deleteCertificates: string[];
  }): Observable<any>;

  deleteSupplier(data: { id: string }): Observable<any>;

  GetSuppliers(data: {}): Observable<any>;

  GetSupplier(data: { id: string }): Observable<any>;
}
