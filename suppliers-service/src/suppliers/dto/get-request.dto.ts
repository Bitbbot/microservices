import { IsUUID } from 'class-validator';

export class GetSupplierDto {
  @IsUUID()
  id: string;
}
