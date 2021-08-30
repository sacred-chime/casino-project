import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
import NextImage from "next/image";
import React, { useState } from "react";
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
import { useIsAuth } from "../utils/useIsAuth";

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
          <HowToPlaySlots />
          <Game />
          <SlotsSymbolTable />
        </HStack>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Slots);

// GAME COMPONENT
const Game: React.FC<{}> = ({}) => {
  const symbols = slotsSymbols();
  return (
    <Flex justifyContent={"center"} key={"game"} id={"game"}>
      <Board symbols={symbols} />
      <Box ml={"20px"} key={"game-info"} id={"game-info"}></Box>
    </Flex>
  );
};

// GAME BOARD COMPONENT
const Board: React.FC<BoardProps> = ({ symbols }) => {
  const [{ data, fetching }] = useMeQuery();
  const [, changeFunds] = useChangeFundsMutation();
  const [, createBet] = useCreateBetMutation();
  const [bet, setBet] = useState(0);
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState<Slots>({
    squares: new Array(15).fill({ value: 0, symbol: " " }),
    colors: new Array(15).fill("white"),
  });

  let status;
  const slotsRows = [];

  for (let row = 0; row < 3; row++) {
    let slotsRow = [];
    for (let col = 0; col < 5; col++) {
      slotsRow.push(
        <Square
          key={`row-${row},col-${col}`}
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
        <Center my={"10px"}>
          <Flex flexDir={"column"}>
            <Flex>
              <Text mr={3}>How much would you like to bet?</Text>
              <NumberInput
                type="number"
                defaultValue={0}
                min={0.1}
                max={1000000}
                onChange={(input) => {
                  setBet(() => {
                    return parseFloat(input);
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
            <Center mt={3}>
              <Button
                onClick={() => {
                  // generates random symbols for each cell in the slots game
                  let newSquares = new Array<SlotsSymbol>(15);
                  for (let i = 0; i < 15; i++) {
                    newSquares[i] = symbols[getRandomInt(0, symbols.length)];
                  }
                  let values = calculateWinner(newSquares, bet);
                  let newColors = values.colors;
                  if ((data?.me?.money && data!.me!.money < bet) || bet <= 0) {
                    alert("Invalid bet amount, please try again.");
                    setSlots(() => {
                      return {
                        squares: Array(15).fill(newSquares),
                        colors: Array(15).fill("white"),
                      };
                    });
                  } else {
                    // checks if the user has won, if so sets winning message
                    if (values.winner) {
                      setMessage(
                        "Congratulations, you won $" + values.winnings
                      );
                    } else {
                      // if user loses, random lose phrase is set
                      let phrases = [
                        "Wow you're bad at this",
                        "Better luck next time!",
                        "It's time to stop",
                        "Get help",
                        "Sorry",
                      ];
                      status = phrases[getRandomInt(0, phrases.length)];
                      setMessage(status);
                    }
                    // updates users money
                    createBet({
                      input: {
                        game: "Slots",
                        wager: bet!,
                        payout: values.winnings,
                      },
                    });
                    changeFunds({
                      fundDelta: values.winnings - bet,
                    });
                    // displays slots
                    setSlots(() => {
                      return {
                        squares: newSquares,
                        colors: newColors,
                      };
                    });
                  }
                }}
              >
                Spin
              </Button>
            </Center>
            <Center>
              <Box key="message" my={"10px"}>
                {message}
              </Box>
            </Center>
          </Flex>
        </Center>
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

// HOW TO PLAY
const HowToPlaySlots: React.FC<{}> = ({}) => {
  return (
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
        Enter the amount you want to bet in the box below. After entering your
        bet, simply press the play button! To win, match 5 shapes with the same
        value to any of the 15 patterns below, and win your bet * value of the
        symbols!
      </Text>
      <Box mt={2}>
        <NextImage
          src="/images/slots_paylines_3.png"
          height={"600px"}
          width={"600px"}
        />
      </Box>
    </Box>
  );
};

// SYMBOL TABLE
const SlotsSymbolTable: React.FC<{}> = ({}) => {
  return (
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
  );
};

// HELPER FUNCTIONS
const calculateWinner = (squares: SlotsSymbol[], bet: number) => {
  let colors = new Array<string>(15);

  // values corresponding to value each symbol is worth
  const values = [
    10, 10, 10, 10, 15, 15, 15, 20, 20, 30, 1, 1000, 30, 30, 1000,
  ];

  // initially sets each cell in the slot to have a white background
  for (let i = 0; i < colors.length; i++) {
    colors[i] = "white";
  }
  try {
    let symbolsList = [];

    // assigns symbols to array
    for (let i = 0; i < slotsSymbols().length; i++) {
      symbolsList.push(slotsSymbols()[i].symbol);
    }
    const splitSquares = arrayChunks(squares, 5);

    // loops through all 15 winning patterns
    for (let i = 0; i < lines().length; i++) {
      const [a, b, c, d, e] = lines()[i];
      let ind1 = values[symbolsList.indexOf(squares[a].symbol)];
      let ind2 = values[symbolsList.indexOf(squares[b].symbol)];
      let ind3 = values[symbolsList.indexOf(squares[c].symbol)];
      let ind4 = values[symbolsList.indexOf(squares[d].symbol)];
      let ind5 = values[symbolsList.indexOf(squares[e].symbol)];

      // if the value at each indice matches the other 4 indices, the user has won. sets the background color of winning cells to green
      if (ind1 === ind2 && ind2 === ind3 && ind3 === ind4 && ind4 === ind5) {
        colors[a] = "mediumseagreen";
        colors[b] = "mediumseagreen";
        colors[c] = "mediumseagreen";
        colors[d] = "mediumseagreen";
        colors[e] = "mediumseagreen";

        // winner is true, user has won their bet * value of symbol
        return {
          winner: true,
          winnings: ind1 * bet,
          colors: colors,
        };
      }
    }
    // else user has lost, winner is false and they have no winnings
    return { winner: false, winnings: 0, colors: colors };
  } catch {
    return { winner: false, winnings: 0, colors: colors };
  }
};
