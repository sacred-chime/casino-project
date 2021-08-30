import { MigrationInterface, QueryRunner } from "typeorm";

export class FakeBets1628641646080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        
        insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 980.46, 1267.22, 4, '2020-11-01T17:11:18Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 627.24, 1253.84, 5, '2021-05-02T02:09:33Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 659.28, 874.61, 3, '2020-06-16T15:29:40Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 498.36, 1776.38, 1, '2020-01-23T00:24:23Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 785.35, 882.22, 2, '2020-06-07T19:33:50Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 557.71, 1032.4, 4, '2020-06-11T16:51:19Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 40.37, 1591.37, 2, '2020-01-28T13:33:17Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 102.02, 1485.68, 5, '2020-05-17T17:08:34Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 843.01, 1602.23, 5, '2020-04-09T18:30:17Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 549.28, 1968.03, 5, '2020-08-09T12:43:54Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 715.64, 859.37, 2, '2021-06-23T13:24:24Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 867.5, 430.8, 4, '2019-10-09T06:53:39Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 233.11, 964.36, 3, '2020-11-28T05:33:50Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 787.69, 1941.09, 1, '2020-09-22T19:23:15Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 730.01, 770.69, 5, '2019-12-23T10:36:51Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 933.4, 1390.29, 3, '2021-01-22T04:20:19Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 262.32, 642.35, 5, '2021-04-19T12:35:08Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 514.96, 128.72, 2, '2019-11-26T05:41:21Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 871.56, 1321.83, 3, '2020-10-22T09:19:27Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 322.18, 486.06, 2, '2020-03-02T14:47:58Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 537.42, 1975.55, 1, '2019-09-05T21:39:38Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 229.48, 1576.59, 5, '2020-07-03T07:37:05Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 444.38, 1324.26, 5, '2020-03-22T06:29:22Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 729.06, 1284.72, 1, '2021-02-17T20:35:53Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 918.34, 765.94, 2, '2020-07-04T22:36:10Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 47.45, 351.94, 5, '2019-08-27T16:28:07Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 53.5, 582.8, 3, '2019-10-11T11:30:33Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 782.77, 1206.86, 4, '2021-02-04T13:54:32Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 741.67, 1882.85, 3, '2020-07-11T05:08:34Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 235.54, 921.97, 4, '2020-10-10T16:00:13Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 158.15, 811.01, 4, '2021-05-04T00:05:12Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 333.76, 1738.23, 3, '2020-02-17T16:40:56Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 184.68, 885.41, 3, '2020-04-28T10:20:41Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 902.55, 430.32, 2, '2020-09-12T19:56:04Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 575.42, 1229.13, 1, '2021-07-09T17:50:09Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 783.43, 1262.13, 3, '2020-11-10T19:02:46Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 733.31, 269.76, 3, '2021-05-17T22:46:24Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 849.8, 1510.48, 3, '2020-09-27T16:40:02Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 231.18, 454.95, 3, '2019-11-20T04:30:20Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 737.75, 27.53, 5, '2020-11-03T05:31:28Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 996.73, 213.61, 1, '2020-09-03T08:00:04Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 493.84, 1937.46, 1, '2020-10-19T19:11:29Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 333.25, 1737.19, 1, '2021-03-04T07:09:38Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 838.51, 861.62, 2, '2021-07-08T19:36:49Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 32.99, 54.63, 1, '2019-11-03T16:51:43Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 127.62, 1968.49, 2, '2020-04-11T20:59:07Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 422.98, 1211.73, 3, '2021-07-25T11:40:22Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 61.79, 1229.24, 4, '2021-06-02T02:02:32Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 634.32, 678.28, 3, '2021-02-24T00:13:51Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 526.09, 1643.75, 2, '2021-02-11T12:01:51Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 270.38, 1602.89, 2, '2019-11-16T16:51:14Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 861.38, 93.34, 2, '2019-09-23T06:20:48Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 612.82, 584.85, 4, '2020-02-19T18:05:48Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 556.46, 763.3, 1, '2019-10-14T11:44:48Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 720.15, 1782.31, 2, '2021-01-11T20:39:02Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 812.91, 1825.46, 4, '2020-06-11T20:56:16Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 741.35, 1203.86, 3, '2021-03-14T23:42:24Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 383.53, 1905.61, 3, '2021-01-14T05:02:21Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 129.19, 1902.42, 1, '2021-06-29T00:19:18Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 974.71, 1955.02, 5, '2019-11-20T11:53:45Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 34.9, 1216.56, 2, '2019-12-10T10:28:42Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 462.77, 712.26, 4, '2020-10-31T07:00:44Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 599.35, 98.19, 3, '2021-03-19T06:15:04Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 32.46, 239.79, 5, '2021-01-22T14:06:05Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 626.26, 1139.34, 2, '2020-05-19T15:51:50Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 275.35, 965.4, 3, '2020-05-27T15:28:17Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 888.48, 255.22, 5, '2020-05-11T21:48:17Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 23.59, 1748.68, 1, '2020-09-27T09:27:46Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 186.9, 98.91, 2, '2019-11-03T10:36:21Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 280.67, 1865.37, 5, '2020-09-18T20:58:37Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 556.4, 974.42, 3, '2020-05-10T18:52:04Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 667.89, 788.34, 1, '2021-07-11T20:40:39Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 912.52, 205.56, 1, '2019-08-10T20:48:31Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 186.57, 944.34, 1, '2020-07-15T07:17:58Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 756.77, 1939.69, 5, '2020-10-29T12:27:09Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 254.37, 1883.72, 5, '2021-03-19T22:39:23Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 829.69, 1047.4, 5, '2020-03-14T01:47:03Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 392.31, 1323.15, 1, '2021-02-15T19:02:31Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 237.97, 503.11, 2, '2020-02-14T04:05:48Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 317.17, 1646.25, 5, '2020-02-03T01:01:00Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 966.14, 1787.07, 4, '2019-11-24T03:37:01Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 707.14, 812.71, 3, '2021-04-25T17:22:18Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 545.44, 893.95, 5, '2021-06-01T23:27:04Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 761.02, 1158.81, 4, '2020-05-10T22:17:31Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 697.07, 66.23, 1, '2020-09-20T09:15:03Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 424.98, 1619.64, 4, '2020-12-11T21:50:43Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 547.4, 985.35, 3, '2020-05-22T09:47:12Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 446.4, 1259.61, 5, '2019-08-21T01:04:54Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 782.18, 1905.59, 2, '2020-03-23T04:54:39Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 614.98, 1147.78, 5, '2021-07-25T10:03:35Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 934.99, 1969.76, 3, '2019-12-07T01:13:17Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 142.94, 1032.45, 4, '2020-11-30T04:06:03Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 816.28, 582.77, 5, '2021-07-30T04:13:20Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 289.13, 1057.59, 5, '2021-03-27T16:26:37Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Craps', 838.21, 16.93, 4, '2020-01-13T06:56:55Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 754.4, 1398.28, 4, '2019-12-15T01:17:13Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Minesweeper', 189.93, 782.88, 5, '2020-04-16T22:29:20Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Roulette', 775.74, 185.02, 3, '2020-02-26T03:22:53Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Slots', 282.14, 1948.76, 2, '2020-10-29T00:06:45Z');
insert into bet (game, wager, payout, "playerId", "createdAt") values ('Blackjack', 383.12, 1513.06, 2, '2019-10-15T07:26:03Z');`);
  }

  public async down(_: QueryRunner): Promise<void> {}
}