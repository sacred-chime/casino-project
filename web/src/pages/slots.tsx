import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  Text,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  HStack,
  Image,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { arrayChunks } from "../utils/slots/arrayChunks";
import { SlotsSymbol, slotsSymbols } from "../utils/slots/slotsSymbols";
import { useIsAuth } from "../utils/useIsAuth";
import { lines } from "../utils/slots/slotsLines"
import { useMeQuery } from "../generated/graphql";
import { useChangeFundsMutation } from "../generated/graphql"
import * as logo from '../utils/slots/slots_paylines_3.png';

const img = logo.default.src;

const Comp = ()=> {
    return <Image src={String(img)}  />
}

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
            Note: Minimum bet = 1, default bet = 1
            After entering your bet, simply press the play button!
            To win, match 5 shapes with the same value to any of the 15
            patterns below, and win your bet * value of the symbols!</Text>
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
  const [, changeFunds] = useChangeFundsMutation() ;
  const [bet, setBet] = useState<number | undefined>();
  const [winnings, setWinnings] = useState(0);
  const [slots, setSlots] = useState<Slots>({
    squares: new Array(15).fill({ value: 0, symbol: " " }),
    colors: new Array(15).fill("white"),
  });

  let status;
  let values = { winner: false, winnings: 0, colors: slots.colors };

  if (values.winner) {
    status = "Winner!";
  } else {
    let phrases = [
      "Wow you're bad at this",
      "Better luck next time!",
      "It's time to stop",
      "Get help",
      "Sorry",
    ];
    status = phrases[getRandomInt(0, phrases.length)];
  }

  const slotsRows = [];

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
        {<label style={{ marginRight: '5px'}} >
          How much would you like to bet?
          </label>}
          <input
            type="number"
            min="1"
            onChange={(input) => {
              document.getElementById("loseMessage")!.hidden=true;
              setBet(parseInt(input.target.value))
            }}
            style={{ color: "black" }}
          />
        <Center my={"10px"}>
          <Button  onClick={() => {
              document.getElementById("loseMessage")!.hidden=false;
              document.getElementById("winMessage")!.hidden=true;
              let newSquares = new Array<SlotsSymbol>(15);
              for (let i = 0; i < 15; i++) {
                newSquares[i] = symbols[getRandomInt(0, symbols.length)];
              }
              console.log(data!.me!.money)
              values = calculateWinner(newSquares, bet!);
              setWinnings(values.winnings)
              let newColors = values.colors;
              if(data!.me!.money < bet! || bet! <= 0)
              {
                alert('Invalid bet amount, please try again.')
                setSlots({
                  squares: Array(15).fill(newSquares),
                  colors: Array(15).fill("white")
                })
                setWinnings(0)
                changeFunds({
                  fundDelta: winnings
                })
              }
              else
              {
                if(values.winner)
                {
                  document.getElementById("loseMessage")!.hidden = true;
                  document.getElementById("winMessage")!.hidden = false;
                }
                changeFunds({
                  fundDelta: winnings
                })
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
        <Box id="loseMessage" my={"10px"}>{status}</Box>
        <Box id="winMessage" my={"10px"}>Congrats, you won ${winnings}!</Box>
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
  const values = [10,10,10,10,15,15,15,20,20,30,1,1000,30,30,1000] ;
  for (let i = 0; i < colors.length; i++) {
    colors[i] = "white";
  }
  try {
    let symbolsList = [] ;
    for(let i=0; i<slotsSymbols().length;i++) { symbolsList.push(slotsSymbols()[i].symbol)}
    const splitSquares = arrayChunks(squares, 5);
    for(let i=0; i<lines().length;i++)
    {
      const [a, b, c, d, e] = lines()[i];
      let ind1 = values[symbolsList.indexOf(squares[a].symbol)] ;
      let ind2 = values[symbolsList.indexOf(squares[b].symbol)] ;
      let ind3 = values[symbolsList.indexOf(squares[c].symbol)] ;
      let ind4 = values[symbolsList.indexOf(squares[d].symbol)] ;
      let ind5 = values[symbolsList.indexOf(squares[e].symbol)] ;

      if (ind1 === ind2 && ind2 === ind3 && ind3 === ind4 && ind4 === ind5) {
        colors[a] = "mediumseagreen";
        colors[b] = "mediumseagreen";
        colors[c] = "mediumseagreen";
        colors[d] = "mediumseagreen";
        colors[e] = "mediumseagreen";
        console.log(
          "squares: ",
          squares,
          "colors: ",
          colors,
          "splitSquares: ",
          splitSquares
        );
        return {
          winner: true,
          winnings: ind1 * bet,
          colors: colors,
        };
      }
    }
    return { winner: false, winnings: -bet, colors: colors };
  } catch {
    return { winner: false, winnings: 0, colors: colors };
  }
};