import {
    Box,
    Button,
    Center,
    SimpleGrid,
    useSafeLayoutEffect,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { create } from "node:domain";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import {
    useChangeFundsMutation,
    useCreateBetMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { isValidCoord } from "../utils/minesweeper/isValidCoord";
import { sumAdjacents } from "../utils/minesweeper/sumAdjacents";
import { useIsAuth } from "../utils/useIsAuth";

// CONSTANTS
const n = 7; // size of (n x n) matrix

// TYPESCRIPT DEFINITIONS
interface MinesweeperTilesProps {
    matrix: MinesweeperTile[][];
    updateTile: (row: number, column: number) => void;
    setAllTilesVisibility: (visible: boolean) => void;
}

export interface MinesweeperTile {
    hasBomb: boolean;
    adjacentCount: number;
    isVisible: boolean;
}

interface MinesweeperUIProps {
    seconds: number;
    setSeconds: React.Dispatch<React.SetStateAction<number>>;
    //startTimer?: () => void;
    isGameStarted: boolean;
    updateGameState: () => void;
}

// MAIN COMPONENT
const Minesweeper: React.FC<{}> = ({}) => {
    useIsAuth();

    const [, changeFunds] = useChangeFundsMutation();
    const [, createBet] = useCreateBetMutation();
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [seconds, setSeconds] = useState(90);
    const [betted, setBetted] = useState(false);
    // Default TileState
    const defaultTileState: MinesweeperTile = {
        hasBomb: false,
        adjacentCount: 0,
        isVisible: true,
    };
    const defaultTileMatrix = Array.from({ length: n }, () =>
        Array.from({ length: n }, () => defaultTileState)
    );
    const [matrix, setMatrix] =
        useState<MinesweeperTile[][]>(defaultTileMatrix);

    const secondsRef = useRef(seconds);
    secondsRef.current = seconds;

    // START / RESET BUTTON
    const updateGameState = () => {
        if (isGameStarted === false) {
            // START GAME
            setIsGameStarted(true);
            setSeconds(90);
            changeFunds({
                fundDelta: -100,
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
                    };
                }
            }
            setMatrix(newMatrix);
        } else {
            // RESET GAME
            setIsGameStarted(false);
            setMatrix(defaultTileMatrix);
            setAllTilesVisibility(false);
        }
    };

    // MINESWEEPER TILE onClick
    const updateTile = (row: number, column: number) => {
        if (matrix[row][column].hasBomb) {
            setIsGameStarted(false);
            console.log("Bomb was clicked");
            checkForEndGame(matrix); // maybe call a func here that updates a state for lose-bet condition?
            createBet({
                input: {
                    game: "Minesweeper",
                    wager: 100,
                    payout: 200,
                },
            });
            alert("YOU LOSE!");
        }

        let copy = createUpdateTileMatrix([...matrix], row, column);
        //console.log(copy);
        if (checkForEndGame(copy)) {
            // IF GAME IS WON
            alert("YOU WON!");
            //console.log("YOU WON!");
            setAllTilesVisibility(true); // maybe call a func here that updates a state for win-bet condition?
            // however "Place Bet" is onClick - need to update bet on state change as well
            createBet({
                input: {
                    game: "Minesweeper",
                    wager: 100,
                    payout: 200,
                },
            });
            changeFunds({
                fundDelta: 200,
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
                };
            }
            setMatrix(copy);
        }
    };

    // TIMER HERE
    useEffect(() => {
        const newSeconds = seconds - 1;
        if (isGameStarted) {
            console.log("use effect ran works");
            setTimeout(() => setSeconds(newSeconds), 1000);
            if (newSeconds === 0) {
                setIsGameStarted(false);
                alert("TIMES UP");
                setAllTilesVisibility(true);
                createBet({
                    input: {
                        game: "Minesweeper",
                        wager: 100,
                        payout: 200,
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
                        setSeconds={setSeconds}
                        //startTimer={startTimer}
                        isGameStarted={isGameStarted}
                        updateGameState={updateGameState}
                    />
                    <MinesweeperTiles
                        matrix={matrix}
                        updateTile={updateTile}
                        setAllTilesVisibility={setAllTilesVisibility}
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
    setSeconds,
    //startTimer,
    isGameStarted,
    updateGameState,
}) => {
    return (
        <Box>
            <Button
                bgColor="blackAlpha.900"
                onClick={() => {
                    updateGameState();
                }}
            >
                {isGameStarted ? "RESET" : "START"}
            </Button>
            <Button bgColor="blackAlpha.900">{seconds}</Button>
        </Box>
    );
};

// MINESWEEPER TILE GRID
const MinesweeperTiles: React.FC<MinesweeperTilesProps> = ({
    matrix,
    updateTile,
    setAllTilesVisibility,
}) => {
    return (
        <Box bgColor={"blue.700"}>
            {matrix.map((row, rowIndex) => (
                <SimpleGrid key={rowIndex} columns={n}>
                    {row.map((column, columnIndex) => (
                        <Center py={2} key={columnIndex}>
                            <Button
                                bgColor={
                                    matrix[rowIndex][columnIndex].isVisible
                                        ? matrix[rowIndex][columnIndex].hasBomb
                                            ? "gray.500"
                                            : matrix[rowIndex][columnIndex]
                                                  .adjacentCount === 0
                                            ? "red.300"
                                            : "orange.300"
                                        : "gray.500"
                                }
                                color={
                                    matrix[rowIndex][columnIndex]
                                        .adjacentCount !== 0
                                        ? "blue.700"
                                        : "white"
                                }
                                width={"60%"}
                                isDisabled={
                                    matrix[rowIndex][columnIndex].isVisible
                                }
                                onClick={() => {
                                    updateTile(rowIndex, columnIndex);
                                    if (matrix[rowIndex][columnIndex].hasBomb) {
                                        setAllTilesVisibility(true);
                                    }
                                }}
                            >
                                {matrix[rowIndex][columnIndex].isVisible
                                    ? matrix[rowIndex][columnIndex].hasBomb
                                        ? "💣"
                                        : "" +
                                          matrix[rowIndex][columnIndex]
                                              .adjacentCount
                                    : " "}
                            </Button>
                        </Center>
                    ))}
                </SimpleGrid>
            ))}
        </Box>
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
            if (
                matrix[i][j].hasBomb === false &&
                matrix[i][j].isVisible === false
            ) {
                console.log(`Win Result: ${gameWon}`);
                return gameWon;
            }
        }
    }
    gameWon = true;
    console.log(`Win Result: ${gameWon}`);
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
                matrix[neighbors[j][0]][neighbors[j][1]].adjacentCount === 0 &&
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