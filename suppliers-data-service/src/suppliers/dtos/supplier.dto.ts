import {
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SupplierDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectors: string[];

  @IsOptional()
  @IsNumberString()
  vatNumber: number;
}
