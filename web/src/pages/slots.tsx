import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { arrayChunks } from "../utils/slots/arrayChunks";
import { SlotsSymbol, slotsSymbols } from "../utils/slots/slotsSymbols";
import { useIsAuth } from "../utils/useIsAuth";
//import ReactDOM from 'react-dom';
//import winners from "../src/patterns.png"

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
        <Game />
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
      {/* <label>
        How much would you like to bet?
        <input
          type="number"
          onChange={(input) => setBet(parseInt(input.target.value))}
          style={{ color: "black" }}
        />
      </label> */}
      <Center my={"10px"}>
        <Button
          // isDisabled={!!bet}
          onClick={() => {
            let newSquares = new Array<SlotsSymbol>(15);
            for (let i = 0; i < 15; i++) {
              newSquares[i] = symbols[getRandomInt(0, symbols.length)];
            }
            values = calculateWinner(newSquares, 1); //bet);
            let newColors = values.colors;
            setSlots({
              squares: newSquares,
              colors: newColors,
            });
            setWinnings(values.winnings);
            //console.log("squares:", newSquares, "colors: ", newColors);
          }}
        >
          Spin
        </Button>
      </Center>
      <Box my={"10px"}>{status}</Box>
      <Box my={"10px"}>Congrats, you won ${winnings}!</Box>
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
  for (let i = 0; i < colors.length; i++) {
    colors[i] = "mediumseagreen";
  }
  try {
    const splitSquares = arrayChunks(squares, 5);
    for (let i = 0; i < 3; i++) {
      // for each row
      const row = splitSquares[i];
      const valueCheck = row[0].value;
      let valueBool = true;
      for (let j = 0; j < row.length; j++) {
        // for each square in row
        if (row[j].value !== valueCheck) {
          valueBool = false;
        }
      }
      if (valueBool) {
        colors[i * 5 + 0] = "green";
        colors[i * 5 + 1] = "green";
        colors[i * 5 + 2] = "green";
        colors[i * 5 + 3] = "green";
        colors[i * 5 + 4] = "green";
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
          winnings: bet * valueCheck,
          colors: colors,
        };
      }
    }
    return { winner: false, winnings: 0, colors: colors };
  } catch {
    return { winner: false, winnings: 0, colors: colors };
  }
};
