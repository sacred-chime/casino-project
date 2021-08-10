import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Bet } from "../entities/Bet";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { BetInput } from "./BetInput";

@ObjectType()
class PaginatedBets {
  @Field(() => [Bet])
  bets: Bet[];
  @Field()
  hasMore: boolean;
}

@Resolver(Bet)
export class BetResolver {
  @FieldResolver(() => User)
  creator(@Root() bet: Bet, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(bet.playerId);
  }

  @Query(() => PaginatedBets)
  async bets(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedBets> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const qb = await getConnection()
      .getRepository(Bet)
      .createQueryBuilder("b")
      //.innerJoinAndSelect("b.player", "u", 'u.id = b."playerId"')
      .orderBy('b."createdAt"', "DESC")
      .take(realLimitPlusOne);

    if (cursor) {
      qb.where('b."createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const bets = await qb.getMany();

    return {
      bets: bets.slice(0, realLimit),
      hasMore: bets.length === realLimitPlusOne,
    };
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
