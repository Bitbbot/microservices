import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Supplier {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  country: string;

  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  vatNumber?: number;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field(() => [String], { nullable: true })
  sectors?: string[];

  @Field(() => [String, ID], { nullable: true })
  certificates?: [{ name: string; id: string }];
}
