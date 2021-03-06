import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useRef, useState } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import {
  useChangeFundsMutation,
  useCreateBetMutation,
  useMeQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { isValidCoord } from "../utils/minesweeper/isValidCoord";
import { sumAdjacents } from "../utils/minesweeper/sumAdjacents";
import { useIsAuth } from "../utils/useIsAuth";

// CONSTANTS
const n = 15; // size of (n x n) matrix

// TYPESCRIPT DEFINITIONS
interface MinesweeperTilesProps {
  matrix: MinesweeperTile[][];
  updateTile: (row: number, column: number) => void;
  setAllTilesVisibility: (visible: boolean) => void;
  addFlag: (row: number, column: number) => void;
}

export interface MinesweeperTile {
  hasBomb: boolean;
  adjacentCount: number;
  isVisible: boolean;
  isFlagged: boolean;
}

interface MinesweeperUIProps {
  seconds: number;
  isGameStarted: boolean;
  updateGameState: () => void;
  setBet: React.Dispatch<React.SetStateAction<number>>;
}

// MAIN COMPONENT
const Minesweeper: React.FC<{}> = ({}) => {
  useIsAuth();
  const defaultSeconds = 180;

  const [{ data, fetching }] = useMeQuery();
  const [, changeFunds] = useChangeFundsMutation();
  const [, createBet] = useCreateBetMutation();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [bet, setBet] = useState(0);

  // Default TileState
  const defaultTileState: MinesweeperTile = {
    hasBomb: false,
    adjacentCount: 0,
    isVisible: true,
    isFlagged: false,
  };
  const defaultTileMatrix = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => defaultTileState)
  );
  const [matrix, setMatrix] = useState<MinesweeperTile[][]>(defaultTileMatrix);

  const secondsRef = useRef(seconds);
  secondsRef.current = seconds;

  // START / RESET BUTTON
  const updateGameState = () => {
    if (isGameStarted === false) {
      // IF NOT ENOUGH MONEY OR NO BET
      if (data?.me?.money && data?.me?.money < bet) {
        alert("PLEASE ADD FUNDS.");
        return;
      }
      if (bet <= 0) {
        alert("PLEASE PLACE BET.");
        return;
      }

      // START GAME
      setIsGameStarted(true);
      setSeconds(defaultSeconds);
      changeFunds({
        fundDelta: -bet,
      });
      // POPULATE WITH BOMBS
      let newMatrix = setBombLocations(defaultTileMatrix);
      newMatrix = setBombAdjacencyValues(newMatrix);
      for (let i = 0; i < newMatrix.length; i++) {
        for (let j = 0; j < newMatrix[i].length; j++) {
          newMatrix[i][j] = {
            hasBomb: newMatrix[i][j].hasBomb,
            adjacentCount: newMatrix[i][j].adjacentCount,
            isVisible: false,
            isFlagged: matrix[i][j].isFlagged,
          };
        }
      }
      setMatrix(newMatrix);
    } else {
      // RESET GAME
      setIsGameStarted(false);
      setMatrix(defaultTileMatrix);
      setAllTilesVisibility(false);
      setAllTilesNotFlagged();
    }
  };

  // MINESWEEPER TILE onClick
  const updateTile = (row: number, column: number) => {
    if (matrix[row][column].hasBomb) {
      setIsGameStarted(false);
      // console.log("Bomb was clicked");
      setAllTilesNotFlagged();
      createBet({
        input: {
          game: "Minesweeper",
          wager: bet,
          payout: 0,
        },
      });
      alert("YOU LOSE!");
    }

    let copy = createUpdateTileMatrix([...matrix], row, column);
    // console.log(copy);
    if (checkForEndGame(copy)) {
      // IF GAME IS WON
      alert("YOU WON!");
      // console.log("YOU WON!");
      setIsGameStarted(false);
      setAllTilesVisibility(true);
      createBet({
        input: {
          game: "Minesweeper",
          wager: bet,
          payout: bet * 2,
        },
      });
      changeFunds({
        fundDelta: bet * 2,
      });
    } else {
      setMatrix(copy);
    }
  };

  // SETS ALL TILES TO visible INPUT BOOLEAN VALUE
  const setAllTilesVisibility = (visible: boolean) => {
    let copy = [...matrix];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        copy[i][j] = {
          hasBomb: matrix[i][j].hasBomb,
          adjacentCount: matrix[i][j].adjacentCount,
          isVisible: visible,
          isFlagged: matrix[i][j].isFlagged,
        };
      }
      setMatrix(copy);
    }
  };

  // ADD FLAG TO TILE
  const addFlag = (row: number, column: number) => {
    let copy = [...matrix];
    if (copy[row][column].isVisible === false) {
      copy[row][column] = {
        hasBomb: copy[row][column].hasBomb,
        adjacentCount: copy[row][column].adjacentCount,
        isVisible: copy[row][column].isVisible,
        isFlagged: !copy[row][column].isFlagged,
      };
    }
    setMatrix(copy);

    window.oncontextmenu = (e) => {
      e.preventDefault();
    };
  };

  // SETS ALL TILES TO NOT FLAGGED
  const setAllTilesNotFlagged = () => {
    let copy = [...matrix];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        copy[i][j] = {
          hasBomb: matrix[i][j].hasBomb,
          adjacentCount: matrix[i][j].adjacentCount,
          isVisible: matrix[i][j].isVisible,
          isFlagged: false,
        };
      }
      setMatrix(copy);
    }
  };

  // TIMER HERE
  useEffect(() => {
    const newSeconds = seconds - 1;
    if (isGameStarted) {
      //   console.log("use effect ran works");
      setTimeout(() => setSeconds(newSeconds), 1000);
      if (newSeconds === 0) {
        setIsGameStarted(false);
        alert("TIMES UP");
        setAllTilesVisibility(true);
        createBet({
          input: {
            game: "Minesweeper",
            wager: bet,
            payout: 0,
          },
        });
      }
    }
  });

  return (
    <>
      <InterfaceUI>
        <Box>
          <MinesweeperUI
            seconds={seconds}
            isGameStarted={isGameStarted}
            updateGameState={updateGameState}
            setBet={setBet}
          />
          <MinesweeperTiles
            matrix={matrix}
            updateTile={updateTile}
            setAllTilesVisibility={setAllTilesVisibility}
            addFlag={addFlag}
          />
        </Box>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Minesweeper);

// MINESWEEPER UI
const MinesweeperUI: React.FC<MinesweeperUIProps> = ({
  seconds,
  isGameStarted,
  updateGameState,
  setBet,
}) => {
  return (
    <Center>
      <Flex
        bgColor={"blue.700"}
        flexDir={"column"}
        width={"40vw"}
        borderTopRadius={10}
        mt={10}
      >
        <Center my={2}>
          <Flex width={"98%"} bgColor={"gray.800"} borderRadius={4} p={2}>
            <Button
              ml={"auto"}
              bgColor="green.700"
              onClick={() => {
                updateGameState();
              }}
            >
              {isGameStarted ? "RESET" : "START"}
            </Button>
            <Center
              ml={"24"}
              mr={"auto"}
              border={"gray.800"}
              bgColor={"gray.700"}
              borderWidth={2}
              borderRadius={4}
              p={1}
            >
              <Text fontFamily={"heading"} px={2}>
                {seconds} seconds left{".".repeat((seconds % 3) + 1)}
              </Text>
            </Center>
          </Flex>
        </Center>
        <Center>
          <Text fontFamily={"heading"}>Right Click to Flag a Tile.</Text>
        </Center>

        <Center my={2}>
          <Flex height={"40px"}>
            <Center>
              <Text hidden={isGameStarted} fontFamily={"heading"} mr={5}>
                How much would you like to bet?
              </Text>
            </Center>

            <NumberInput
              hidden={isGameStarted}
              type="number"
              width={"150px"}
              bgColor={"gray.700"}
              defaultValue={0}
              min={1}
              max={1000000}
              onChange={(input) => {
                setBet(parseInt(input));
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
        </Center>
      </Flex>
    </Center>
  );
};

// MINESWEEPER TILE GRID
const MinesweeperTiles: React.FC<MinesweeperTilesProps> = ({
  matrix,
  updateTile,
  setAllTilesVisibility,
  addFlag,
}) => {
  return (
    <Center>
      <Center
        bgColor={"blue.700"}
        width={"40vw"}
        borderBottomRadius={10}
        pb={5}
      >
        <Box>
          {matrix.map((row, rowIndex) => (
            <Flex key={rowIndex} columns={n} spacing={"5px"}>
              {row.map((column, columnIndex) => (
                <Center py={2} key={columnIndex} height={"50px"} width={"50px"}>
                  <Button
                    bgColor={
                      matrix[rowIndex][columnIndex].isVisible
                        ? matrix[rowIndex][columnIndex].hasBomb
                          ? "gray.500"
                          : matrix[rowIndex][columnIndex].adjacentCount === 0
                          ? "red.300"
                          : "orange.300"
                        : "gray.500"
                    }
                    color={
                      matrix[rowIndex][columnIndex].adjacentCount !== 0
                        ? "blue.700"
                        : "white"
                    }
                    width={"60%"}
                    isDisabled={matrix[rowIndex][columnIndex].isVisible}
                    onClick={() => {
                      updateTile(rowIndex, columnIndex);
                      if (matrix[rowIndex][columnIndex].hasBomb) {
                        setAllTilesVisibility(true);
                      }
                    }}
                    onContextMenu={() => {
                      addFlag(rowIndex, columnIndex);
                      //   console.log("right click heard");
                    }}
                  >
                    {matrix[rowIndex][columnIndex].isVisible
                      ? matrix[rowIndex][columnIndex].hasBomb
                        ? "????"
                        : "" + matrix[rowIndex][columnIndex].adjacentCount
                      : matrix[rowIndex][columnIndex].isFlagged
                      ? "????"
                      : " "}
                  </Button>
                </Center>
              ))}
            </Flex>
          ))}
        </Box>
      </Center>
    </Center>
  );
};

// HELPER / PLACEHOLDER FUNCTIONS

// Bomb Placement
const setBombLocations = (tiles: MinesweeperTile[][]) => {
  let bombsPlaced = 0;
  const maxNumberOfBombs = Math.round(
    (tiles.length * tiles[0].length) / 6.4 + 1
  );
  while (bombsPlaced < maxNumberOfBombs) {
    const rowRandom = Math.floor(getRandomInt(0, tiles.length));
    const colRandom = Math.floor(getRandomInt(0, tiles[0].length));
    tiles[rowRandom][colRandom] = {
      hasBomb: true,
      adjacentCount: tiles[rowRandom][colRandom].adjacentCount,
      isVisible: tiles[rowRandom][colRandom].isVisible,
      isFlagged: false,
    };
    bombsPlaced++;
  }
  return tiles;
};

// Sum Adjacent
const setBombAdjacencyValues = (tiles: MinesweeperTile[][]) => {
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[0].length; j++) {
      const newAdjacent = sumAdjacents(tiles, i, j);
      tiles[i][j] = {
        hasBomb: tiles[i][j].hasBomb,
        adjacentCount: newAdjacent,
        isVisible: tiles[i][j].isVisible,
        isFlagged: tiles[i][j].isFlagged,
      };
    }
  }

  return tiles;
};

// Check if the game has been won
const checkForEndGame = (matrix: MinesweeperTile[][]) => {
  let gameWon = false;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].hasBomb === false && matrix[i][j].isVisible === false) {
        // console.log(`Win Result: ${gameWon}`);
        return gameWon;
      }
    }
  }
  gameWon = true;
  //   console.log(`Win Result: ${gameWon}`);
  return gameWon;
};

// CREATE NEW UPDATETILE MATRIX
const createUpdateTileMatrix = (
  matrix: MinesweeperTile[][],
  row: number,
  column: number
) => {
  if (matrix[row][column].isVisible === false) {
    matrix[row][column] = {
      hasBomb: matrix[row][column].hasBomb,
      adjacentCount: matrix[row][column].adjacentCount,
      isVisible: true,
      isFlagged: matrix[row][column].isFlagged,
    };
  }

  // DEPTH FIRST SEARCH
  if (
    matrix[row][column].adjacentCount === 0 &&
    matrix[row][column].hasBomb === false
  ) {
    // all adjacent moves
    let neighborMoves = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    // creating an array of all valid adjacent coordinates
    const neighbors = [];
    for (let i = 0; i < neighborMoves.length; i++) {
      const curr_neighbor = neighborMoves[i];
      const curr_coordinate = [
        curr_neighbor[0] + row,
        curr_neighbor[1] + column,
      ];
      if (isValidCoord(curr_coordinate, matrix)) {
        neighbors.push(curr_coordinate);
      }
    }
    // setting adjacent
    for (let j = 0; j < neighbors.length; j++) {
      if (
        matrix[neighbors[j][0]][neighbors[j][1]].isVisible === false &&
        matrix[row][column].adjacentCount === 0 &&
        matrix[neighbors[j][0]][neighbors[j][1]].hasBomb === false
      ) {
        matrix = createUpdateTileMatrix(
          matrix,
          neighbors[j][0],
          neighbors[j][1]
        );
      }
    }
  }

  return matrix;
};
