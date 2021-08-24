import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { useIsAuth } from "../utils/useIsAuth";
import { useMeQuery } from "../generated/graphql";
import { useChangeFundsMutation } from "../generated/graphql";
import { Fa500Px } from "react-icons/fa";

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
  const [boardTiles, updateBoardTiles] = useState(new Array(14));
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

  let status: CasinoProps = {
    winner: false,
    loser: false,
    bet: 0,
    message: "In Progress.",
    stand: false,
  };


  return (
    <>
      <Box
        margin={"auto"}
        width={"100%"}
        marginTop={"100px"}
        padding={"10px"}
        bg="lightskyblue"
      >
        <SimpleGrid columns={7} spacing={2}>
          {boardTiles}
        </SimpleGrid>
      </Box>
      <Box>
        <Button id="Hit"
          onClick={() => {
            if (playerHand.total < 21 && dealerHand.cards.length == 1) {
              const newHand = playerHand.cards.concat(drawCard());
              const newTotal = calculateHand(newHand);
              setPlayerHand({
                total: newTotal,
                cards: newHand,
              });
            }
            status.stand = false;
            status = calculateWinner(playerHand, dealerHand, status);
            console.log(status.message);
          }}
        >
          Hit
        </Button>
        <Button id="Stand"
          onClick={() => {
            if (
              playerHand.total <= 21 &&
              dealerHand.total < 21 &&
              dealerHand.total <= playerHand.total
            ) {
              const newHand = dealerHand.cards.concat(drawCard());
              const newTotal = calculateHand(newHand);
              setDealerHand({
                total: newTotal,
                cards: newHand,
              }); 
            }
            status.stand = true;
            status = calculateWinner(playerHand, dealerHand, status);
            console.log(status.message);
          }}
        >
          Stand
        </Button>
        {/* <Button onClick={() => placeBet()}>Place Bet</Button> */}
        <Button id = "Bet"
          onClick={() => {
            const newDealerHand: Card[] = [drawCard()];
            const newDealerTotal = calculateHand(newDealerHand);
            setDealerHand({
              total: newDealerTotal,
              cards: newDealerHand,
            });

            const newPlayerHand: Card[] = [drawCard(), drawCard()];
            const newPlayerTotal = calculateHand(newPlayerHand);
            setPlayerHand({
              total: newPlayerTotal,
              cards: newPlayerHand,
            });
            //todo
            document.getElementById("Stand")!.hidden = false;
            document.getElementById("Hit")!.hidden = false;
          
          }}
        >
          Reset Board (maybe bet button)
        </Button>
      </Box>
      <Box id="status" my={"10px"}>
        {status.message}
      </Box>
      <Box id="payout" my={"10px"}>
        Congrats, you won ${status.bet}!
      </Box>
    </>
  );
};

// TILE COMPONENT
const BlackjackTile: React.FC<BlackjackTileProps> = (props) => {
  return (
    <Box bg="gray.800" height="100px" textAlign="center" paddingTop="50px">
      {props.value}
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
) => {
  if (player.total > 21) {
    return {
      winner: false,
      loser: true,
      bet: status.bet,
      message: "Dealer win by Player Bust.",
      stand: status.stand,
    };
  }
  if (dealer.total > 21) {
    return {
      winner: true,
      loser: false,
      bet: status.bet,
      message: "Player win by Dealer Bust.",
      stand: status.stand,
    };
  }
  if (status.stand) {
    if (dealer.total >= player.total) {
      if (dealer.total <= 21) {
        return {
          winner: false,
          loser: true,
          bet: status.bet,
          message: "Dealer win by total.",
          stand: status.stand,
        };
      } else if (dealer.total > 21) {
        return {
          winner: true,
          loser: false,
          bet: status.bet,
          message: "Player win by Dealer Bust.",
          stand: status.stand,
        };
      }
    }
    return {
      winner: false,
      loser: false,
      bet: status.bet,
      message: "In Progress, please stand again.",
      stand: status.stand,
    };
  }
  return {
    winner: false,
    loser: false,
    bet: status.bet,
    message: "In Progress please hit or stand.",
    stand: status.stand,
  };
};
