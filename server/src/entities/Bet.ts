import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Bet extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  playerId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.bets)
  player: User;

  @Field()
  @Column()
  game!: string;

  @Field()
  @Column("decimal", { precision: 10, scale: 2 })
  wager!: number;

  @Field()
  @Column("decimal", { precision: 10, scale: 2 })
  payout!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
