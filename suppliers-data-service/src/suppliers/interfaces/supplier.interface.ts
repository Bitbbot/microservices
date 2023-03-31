interface SupplierInterface {
    id: string;
    name: string;
    country: string;
    vatNumber?: number;
    roles?: string[];
    sectors?: string[];
}