import { InputType, Int, Field } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Max } from 'class-validator';
import { FileUploadInterface } from '../entities/file-upload.interface';

@InputType()
export class CreateSupplierInput {
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
}
