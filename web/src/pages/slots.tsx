import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useState } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import {
  useChangeFundsMutation,
  useCreateBetMutation,
  useMeQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { arrayChunks } from "../utils/slots/arrayChunks";
import { lines } from "../utils/slots/slotsLines";
import { SlotsSymbol, slotsSymbols } from "../utils/slots/slotsSymbols";
import * as logo from "../utils/slots/slots_paylines_3.png";
import { useIsAuth } from "../utils/useIsAuth";

const img = logo.default.src;

const Comp = () => {
  return <Image src={String(img)} />;
};

// INTERFACES
interface SquareProps {
  index: number;
  bgColor: string;
  symbol: string;
}

interface BoardProps {
  bet?: number;
  symbols: SlotsSymbol[];
}

interface Slots {
  squares: SlotsSymbol[];
  colors: string[];
}

// MAIN COMPONENT
const Slots: React.FC<{}> = ({}) => {
  useIsAuth();
  return (
    <>
      <InterfaceUI>
        <HStack spacing="24px">
          <Box
            top="-5px"
            p={5}
            shadow="md"
            borderWidth="1px"
            flex="1"
            borderRadius="sm"
          >
            <Heading fontSize="xl">How to Play</Heading>
            <Text s="10px" mt={4}>
              Enter the amount you want to bet in the box below. 
              After entering your bet, simply press the
              play button! To win, match 5 shapes with the same value to any of
              the 15 patterns below, and win your bet * value of the symbols!
            </Text>
            <br></br>
            <Text>
              Note: Users can play for free by leaving the bet input empty or betting 0,
              but in order to play more than $1 must be bet
            </Text>
            <br></br>
            <Comp></Comp>
          </Box>

          <Game />
          <Box
            top="-5px"
            p={5}
            shadow="md"
            borderWidth="1px"
            flex="1"
            borderRadius="sm"
          >
            <Table>
              <Thead>
                <Tr>
                  <Th>Symbols</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>💩</Td>
                  <Td>1</Td>
                </Tr>
                <Tr>
                  <Td>♣️,♦,♥,♠</Td>
                  <Td>10</Td>
                </Tr>
                <Tr>
                  <Td>🍌,🍒,🍓,🍍</Td>
                  <Td>15</Td>
                </Tr>
                <Tr>
                  <Td>👑,📖</Td>
                  <Td>20</Td>
                </Tr>
                <Tr>
                  <Td>💲,💍</Td>
                  <Td>30</Td>
                </Tr>
                <Tr>
                  <Td>💯</Td>
                  <Td>1000</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </HStack>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Slots);

// GAME COMPONENT
const Game: React.FC<{}> = ({}) => {
  const symbols = slotsSymbols();
  //displays the slots
  return (
    <Flex justifyContent={"center"} key={"game"} id={"game"}>
      <Board symbols={symbols} />
      <Box ml={"20px"} key={"game-info"} id={"game-info"}></Box>
    </Flex>
  );
};

// GAME BOARD COMPONENT
const Board: React.FC<BoardProps> = ({ symbols }) => {

  //functions for updating game components
  const [{ data, fetching }] = useMeQuery();
  const [, changeFunds] = useChangeFundsMutation();
  const [, createBet] = useCreateBetMutation();
  const [bet, setBet] = useState<number | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [slots, setSlots] = useState<Slots>({
    squares: new Array(15).fill({ value: 0, symbol: " " }),
    colors: new Array(15).fill("white"),
  });

  let status;
  const slotsRows = [];

  //creates initial, blank slots
  for (let row = 0; row < 3; row++) {
    let slotsRow = [];
    for (let col = 0; col < 5; col++) {
      slotsRow.push(
        <Square
          index={row * 5 + col}
          bgColor={slots.colors[row * 5 + col]}
          symbol={slots.squares[row * 5 + col].symbol}
        />
      );
    }
    slotsRows.push(
      <SimpleGrid id={"board-row" + row} key={"board-row" + row} columns={5}>
        {slotsRow}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      <Box key={"game-board"} id={"game-board"}>
        <Heading as={"h1"}>Slot Machine</Heading>
        <Text>Try to not lose your mortgage :)</Text>
        <Box
          my={"10px"}
          p={3}
          bgColor={"purple.700"}
          borderRadius={"25px"}
          key={"slot-rows"}
          id={"slot-rows"}
        >
          {slotsRows}
        </Box>
        {
          <label style={{ marginRight: "5px" }}>
            How much would you like to bet?
          </label>
        }
        <input
          type="number"
          onChange={(input) => {
            //saves the bet amount
            let bet = parseFloat(input.target.value)
            if(!isNaN(bet))
            {
              setBet(bet);
            }
            //if the input field is empty, sets the bet as 0
            else
            {
              setBet(0)
            }
          }}
          style={{ color: "black" }}
        />
        <Center my={"10px"}>
          <Button
            onClick={() => {
              //generates random symbols for each cell in the slots game
              let newSquares = new Array<SlotsSymbol>(15);
              for (let i = 0; i < 15; i++) {
                newSquares[i] = symbols[getRandomInt(0, symbols.length)];
              }
              let values = calculateWinner(newSquares, bet!);
              
              let newColors = values.colors;
              
              //checks that the amount bet is not more money than the user has and checks to make sure bet is above $1 (unless it is 0 to play for free).
              //if the bet is more than the user has or is l.t. 1, sends an alert and clears the slots. no money is lost or gained
              if (data!.me!.money! < bet! || (bet! < 1 && bet! != 0)) {
                alert("Invalid bet amount, please try again.");
                setSlots({
                  squares: Array(15).fill(newSquares),
                  colors: Array(15).fill("white"),
                });
                changeFunds({
                  fundDelta: 0,
                });
                createBet({
                  input: {
                    game: "Slots",
                    wager: bet!,
                    payout: 0,
                  },
                });
              } else {
                //checks if the user has won, if so sets winning message
                if (values.winner) {
                  setMessage("Congratulations, you won $" + values.winnings)
                }
                else
                {
                  //if user loses, random lose phrase is set
                  let phrases = [
                    "Wow you're bad at this",
                    "Better luck next time!",
                    "It's time to stop",
                    "Get help",
                    "Sorry",
                  ];
                  status = phrases[getRandomInt(0, phrases.length)];
                  setMessage(status)
                }
                //updates users money
                changeFunds({
                  fundDelta: values.winnings,
                });
                
                //creates bet history
                createBet({
                  input: {
                    game: "Slots",
                    wager: bet!,
                    payout: values.winnings,
                  },
                });
                //displays slots
                setSlots({
                  squares: newSquares,
                  colors: newColors,
                });
              }
            }}
          >
            Spin
          </Button>
        </Center>
        <Box my={"10px"}>
          {message}
        </Box>
        
      </Box>
    </Box>
  );
};

// SQUARE COMPONENT
const Square: React.FC<SquareProps> = ({ index, bgColor, symbol }) => {
  return (
    <Flex
      id={"square" + index}
      key={"square" + index}
      color={"black"}
      bgColor={bgColor}
      border={"1px solid #999"}
      height={"9vw"}
      width={"9vw"}
      alignItems={"center"}
      justifyContent={"center"}
      fontSize={"5vw"}
      fontWeight={"bold"}
    >
      {symbol}
    </Flex>
  );
};

// HELPER FUNCTIONS
const calculateWinner = (squares: SlotsSymbol[], bet: number) => {
  let colors = new Array<string>(15);
  //values corresponding to value each symbol is worth
  const values = [
    10, 10, 10, 10, 15, 15, 15, 20, 20, 30, 1, 1000, 30, 30, 1000,
  ];

  //initially sets each cell in the slot to have a white background
  for (let i = 0; i < colors.length; i++) {
    colors[i] = "white";
  }
  try {
    let symbolsList = [];
    
    //assigns symbols to array
    for (let i = 0; i < slotsSymbols().length; i++) {
      symbolsList.push(slotsSymbols()[i].symbol);
    }

    //loops through all 15 winning patterns
    for (let i = 0; i < lines().length; i++) {
      const [a, b, c, d, e] = lines()[i];
      let ind1 = values[symbolsList.indexOf(squares[a].symbol)];
      let ind2 = values[symbolsList.indexOf(squares[b].symbol)];
      let ind3 = values[symbolsList.indexOf(squares[c].symbol)];
      let ind4 = values[symbolsList.indexOf(squares[d].symbol)];
      let ind5 = values[symbolsList.indexOf(squares[e].symbol)];

      //if the value at each indice matches the other 4 indices, the user has won. sets the background color of winning cells to green
      if (ind1 === ind2 && ind2 === ind3 && ind3 === ind4 && ind4 === ind5) {
        colors[a] = "mediumseagreen";
        colors[b] = "mediumseagreen";
        colors[c] = "mediumseagreen";
        colors[d] = "mediumseagreen";
        colors[e] = "mediumseagreen";

        //winner is true, user has won their bet * value of symbol
        return {
          winner: true,
          winnings: ind1 * bet,
          colors: colors,
        };
      }
    }
    //else user has lost, winner is false and their winnings is -bet
    return { winner: false, winnings: -bet, colors: colors };
  } catch {
    return { winner: false, winnings: -bet, colors: colors };
  }
};
