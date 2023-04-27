import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IResponse {
  @Field(() => ID)
  status: number;

  @Field(() => String, { nullable: true })
  message?: string;
}
