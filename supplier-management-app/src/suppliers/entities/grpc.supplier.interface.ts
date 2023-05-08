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
}
