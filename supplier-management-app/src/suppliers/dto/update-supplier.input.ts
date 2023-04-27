import { CreateSupplierInput } from './create-supplier.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateSupplierInput extends PartialType(CreateSupplierInput) {
  @Field(() => ID)
  id: number;
}
