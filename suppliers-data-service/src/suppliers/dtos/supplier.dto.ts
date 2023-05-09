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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deleteFiles: string[];
}
