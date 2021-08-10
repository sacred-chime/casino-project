import { Field, InputType } from "type-graphql";

@InputType()
export class BetInput {
  @Field()
  game: string;
  @Field()
  wager: number;
  @Field()
  payout: number;
}
