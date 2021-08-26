import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import {
  useChangeFundsMutation,
  useCreateBetMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { useIsAuth } from "../utils/useIsAuth";

// INTERFACES / TYPE DEFINITIONS
interface Card {
  suit: string;
  value: string;
}

interface PlayerHandProps {
  total: number;
  cards: Card[];
}

interface BlackjackBoardProps {
  playerHand: PlayerHandProps;
  dealerHand: PlayerHandProps;
  setPlayerHand: React.Dispatch<React.SetStateAction<PlayerHandProps>>;
  setDealerHand: React.Dispatch<React.SetStateAction<PlayerHandProps>>;
}

interface BlackjackTileProps {
  value: String;
}

interface CasinoProps {
  winner: boolean;
  loser: boolean;
  bet: number;
  message: String;
  stand: boolean;
}

// MAIN COMPONENT
const Blackjack: React.FC<{}> = ({}) => {
  useIsAuth();
  const [playerHand, setPlayerHand] = useState<PlayerHandProps>({
    total: 0,
    cards: [],
  });
  const [dealerHand, setDealerHand] = useState<PlayerHandProps>({
    total: 0,
    cards: [],
  });

  return (
    <>
      <InterfaceUI>
        <BlackjackBoard
          playerHand={playerHand}
          dealerHand={dealerHand}
          setPlayerHand={setPlayerHand}
          setDealerHand={setDealerHand}
        />
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Blackjack);

// BOARD COMPONENT
const BlackjackBoard: React.FC<BlackjackBoardProps> = ({
  playerHand,
  dealerHand,
  setPlayerHand,
  setDealerHand,
}) => {
  const boardTiles = [];
  boardTiles[0] = <BlackjackTile key={0} value={"Dealer's Cards"} />;
  for (let i = 1; i < 7; i++) {
    boardTiles[i] = (
      <BlackjackTile
        key={i}
        value={
          dealerHand.cards[i - 1]
            ? dealerHand.cards[i - 1].value +
              " of " +
              dealerHand.cards[i - 1].suit
            : ""
        }
      />
    );
  }
  boardTiles[7] = <BlackjackTile key={7} value={"Your Cards"} />;
  boardTiles[6] = (
    <BlackjackTile key={6} value={`Total: ${dealerHand.total}`} />
  );
  for (let i = 8; i < 13; i++) {
    boardTiles[i] = (
      <BlackjackTile
        key={i}
        value={
          playerHand.cards[i - 8]
            ? playerHand.cards[i - 8].value +
              " of " +
              playerHand.cards[i - 8].suit
            : ""
        }
      />
    );
  }
  boardTiles[13] = (
    <BlackjackTile key={13} value={`Total: ${playerHand.total}`} />
  );

  const [, changeFunds] = useChangeFundsMutation();
  const [, createBet] = useCreateBetMutation();
  const [betted, setBetted] = useState(() => false);
  const [status, setStatus] = useState<CasinoProps>(() => {
    return {
      winner: false,
      loser: false,
      bet: 0,
      message: "Please place bet.",
      stand: false,
    };
  });

  const defaultHand = (): PlayerHandProps => {
    return {
      total: 0,
      cards: [],
    };
  };

  return (
    <Center id="center" mt={"10vh"}>
      <Box id="box" width={"90%"}>
        <Text mt={"30px"} mb={"10px"}>
          Dealer must stand on 17 and draw to 16.
        </Text>
        <Box m={"auto"} width={"100%"} p={"10px"} bg="lightskyblue">
          <SimpleGrid columns={7} spacing={2}>
            {boardTiles}
          </SimpleGrid>
        </Box>
        <Box my={"10px"}>
          <ButtonGroup spacing={3} mb={"5px"}>
            <Button
              key="Hit"
              isDisabled={!betted}
              onClick={() => {
                if (betted) {
                  if (playerHand.total < 21 && dealerHand.cards.length == 1) {
                    setPlayerHand(() => {
                      const newHand = playerHand.cards.concat(drawCard());
                      const newTotal = calculateHand(newHand);
                      return {
                        total: newTotal,
                        cards: newHand,
                      };
                    });
                  }
                  setStatus((prevState) => {
                    const calcWin = calculateWinner(
                      playerHand,
                      dealerHand,
                      prevState
                    );
                    return {
                      winner: calcWin.winner,
                      loser: calcWin.loser,
                      bet: calcWin.bet,
                      message: calcWin.message,
                      stand: false,
                    };
                  });

                  if (status.winner || status.loser) {
                    setDealerHand(defaultHand());
                    setPlayerHand(defaultHand());
                    if (status.winner && status.loser) {
                      changeFunds({
                        fundDelta: status.bet,
                      });
                      createBet({
                        input: {
                          game: "Blackjack",
                          wager: status.bet,
                          payout: status.bet,
                        },
                      });
                    } else if (status.winner) {
                      changeFunds({
                        fundDelta: status.bet * 2,
                      });
                      createBet({
                        input: {
                          game: "Blackjack",
                          wager: status.bet,
                          payout: status.bet * 2,
                        },
                      });
                    } else if (status.loser) {
                      changeFunds({
                        fundDelta: 0,
                      });
                      createBet({
                        input: {
                          game: "Blackjack",
                          wager: status.bet,
                          payout: 0,
                        },
                      });
                    }
                    setStatus((prevState) => {
                      return { ...prevState, winner: false, loser: false };
                    });
                    setBetted(() => false);
                  }
                }
              }}
            >
              Hit
            </Button>
            <Button
              key="Stand"
              isDisabled={!betted}
              onClick={() => {
                if (betted) {
                  if (
                    playerHand.total <= 21 &&
                    dealerHand.total < 21 &&
                    dealerHand.total < 17
                  ) {
                    setDealerHand(() => {
                      let newTotal = dealerHand.total;
                      let newHand = dealerHand.cards;
                      while (newTotal < 17) {
                        newHand = newHand.concat(drawCard());
                        newTotal = calculateHand(newHand);
                      }
                      return {
                        total: newTotal,
                        cards: newHand,
                      };
                    });
                  }

                  setStatus((prevState) => {
                    const calcWin = calculateWinner(
                      playerHand,
                      dealerHand,
                      prevState
                    );
                    return {
                      winner: calcWin.winner,
                      loser: calcWin.loser,
                      bet: calcWin.bet,
                      message: calcWin.message,
                      stand: true,
                    };
                  });

                  if (status.winner || status.loser) {
                    setDealerHand(defaultHand());
                    setPlayerHand(defaultHand());
                    if (status.winner && status.loser) {
                      changeFunds({
                        fundDelta: status.bet,
                      });
                      createBet({
                        input: {
                          game: "Blackjack",
                          wager: status.bet,
                          payout: status.bet,
                        },
                      });
                    } else if (status.winner) {
                      changeFunds({
                        fundDelta: status.bet * 2,
                      });
                      createBet({
                        input: {
                          game: "Blackjack",
                          wager: status.bet,
                          payout: status.bet * 2,
                        },
                      });
                    } else if (status.loser) {
                      changeFunds({
                        fundDelta: 0,
                      });
                      createBet({
                        input: {
                          game: "Blackjack",
                          wager: status.bet,
                          payout: 0,
                        },
                      });
                    }
                    setStatus((prevState) => {
                      return { ...prevState, winner: false, loser: false };
                    });
                    setBetted(() => false);
                  }
                }
              }}
            >
              Stand
            </Button>
            <Button
              key="Bet"
              hidden={betted}
              onClick={() => {
                if (!betted && status.bet > 0) {
                  setDealerHand(() => {
                    const newDealerHand: Card[] = [drawCard()];
                    const newDealerTotal = calculateHand(newDealerHand);
                    return {
                      total: newDealerTotal,
                      cards: newDealerHand,
                    };
                  });
                  setPlayerHand(() => {
                    const newPlayerHand: Card[] = [drawCard(), drawCard()];
                    const newPlayerTotal = calculateHand(newPlayerHand);
                    return {
                      total: newPlayerTotal,
                      cards: newPlayerHand,
                    };
                  });
                  changeFunds({
                    fundDelta: -status.bet,
                  });
                  setStatus((prevState) => {
                    return {
                      ...prevState,
                      winner: false,
                      loser: false,
                      message: "Game in progress please hit or stand.",
                    };
                  });
                  setBetted(() => true);
                }
              }}
            >
              Place Bet
            </Button>
          </ButtonGroup>
          <Flex>
            <Text hidden={betted} mr={"5px"}>
              How much would you like to bet?
            </Text>
            <NumberInput
              hidden={betted}
              type="number"
              width={"150px"}
              defaultValue={0}
              min={1}
              max={1000000}
              onChange={(input) => {
                setStatus((prevState) => {
                  return {
                    ...prevState,
                    winner: false,
                    loser: false,
                    bet: parseInt(input),
                    message: "Please place bet.",
                  };
                });
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
        </Box>
        <Box key="status" my={"10px"}>
          {status.message}
        </Box>
      </Box>
    </Center>
  );
};

// TILE COMPONENT
const BlackjackTile: React.FC<BlackjackTileProps> = ({ value }) => {
  return (
    <Box bg="gray.800" height="100px" lineHeight="100px" textAlign="center">
      {value}
    </Box>
  );
};

// HELPER FUNCTIONS
const drawCard = (): Card => {
  const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  return {
    suit: suits[getRandomInt(0, 3)],
    value: values[getRandomInt(0, 12)],
  };
};

const calculateHand = (hand: Card[]) => {
  let total = 0;
  let aces = 0;
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].value == "A") {
      aces += 1;
    } else if (
      hand[i].value == "J" ||
      hand[i].value == "Q" ||
      hand[i].value == "K"
    ) {
      total += 10;
    } else {
      total += parseInt(hand[i].value);
    }
  }
  for (let i = 0; i < aces; i++) {
    if (total <= 10) {
      total += 11;
    } else {
      total += 1;
    }
  }
  return total;
};

const calculateWinner = (
  player: PlayerHandProps,
  dealer: PlayerHandProps,
  status: CasinoProps
): CasinoProps => {
  if (player.total > 21) {
    return {
      winner: false,
      loser: true,
      bet: status.bet,
      message: `Dealer win by Player Bust. You lost $${status.bet}`,
      stand: status.stand,
    };
  }
  if (dealer.total > 21) {
    return {
      winner: true,
      loser: false,
      bet: status.bet,
      message: `Player win by Dealer Bust. You won $${2 * status.bet}`,
      stand: status.stand,
    };
  }
  if (status.stand) {
    if (dealer.total > player.total) {
      if (dealer.total <= 21) {
        return {
          winner: false,
          loser: true,
          bet: status.bet,
          message: `Dealer win by total. You lost $${status.bet}`,
          stand: status.stand,
        };
      } else if (dealer.total > 21) {
        return {
          winner: true,
          loser: false,
          bet: status.bet,
          message: `Player win by Dealer Bust. You won $${status.bet * 2}`,
          stand: status.stand,
        };
      }
    } else if (dealer.total == player.total) {
      return {
        winner: true,
        loser: true,
        bet: status.bet,
        message: "Tie, push bets back.",
        stand: status.stand,
      };
    } else if (dealer.total >= 17 && player.total > dealer.total) {
      return {
        winner: true,
        loser: false,
        bet: status.bet,
        message: `Player win by Dealer stand. You won $${status.bet * 2}`,
        stand: status.stand,
      };
    } else {
      return {
        winner: false,
        loser: false,
        bet: status.bet,
        message: "Game in progress please stand again.",
        stand: status.stand,
      };
    }
  }
  return {
    winner: false,
    loser: false,
    bet: status.bet,
    message: "Game in progress please hit or stand.",
    stand: status.stand,
  };
};
