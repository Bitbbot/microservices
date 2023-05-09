import { InputType, Field, PartialType, ID, Int } from '@nestjs/graphql';
import { Max } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUploadInterface } from '../entities/file-upload.interface';

@InputType()
export class UpdateSupplierInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  @Max(99999999)
  vatNumber?: number;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  roles?: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  sectors?: string[];

  @Field(() => [GraphQLUpload], { nullable: true, defaultValue: [] })
  certificates?: FileUploadInterface[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  deleteCertificates?: string[];
}
