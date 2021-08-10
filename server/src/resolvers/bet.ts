import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Bet } from "../entities/Bet";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { BetInput } from "./BetInput";

@Resolver(Bet)
export class BetResolver {
  @FieldResolver(() => User)
  creator(@Root() bet: Bet, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(bet.playerId);
  }

  @Query(() => [Bet])
  async bets(): Promise<Bet[]> {
    return Bet.find();
  }

  @Query(() => Bet, { nullable: true })
  bet(@Arg("id") id: number): Promise<Bet | undefined> {
    return Bet.findOne(id);
  }

  @Mutation(() => Bet)
  @UseMiddleware(isAuth)
  async createBet(
    @Arg("input") input: BetInput,
    @Ctx() { req }: MyContext
  ): Promise<Bet> {
    return Bet.create({
      ...input,
      playerId: req.session.userId,
    }).save();
  }
}
