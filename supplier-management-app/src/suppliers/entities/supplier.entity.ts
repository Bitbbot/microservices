import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Supplier {
  @Field(() => ID, { nullable: true })
  id: number;

  @Field(() => String, { nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => Int, { nullable: true })
  vatNumber?: number;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field(() => [String], { nullable: true })
  sectors?: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  certificates?: JSON;
}
