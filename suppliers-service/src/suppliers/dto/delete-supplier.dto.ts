import { IsUUID } from 'class-validator';

export class DeleteSupplierDto {
  @IsUUID()
  id: string;
}
