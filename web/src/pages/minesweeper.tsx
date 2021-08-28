import { Box, Button, Center, SimpleGrid } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState, useEffect } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { useIsAuth } from "../utils/useIsAuth";
import { sumAdjacents } from "../utils/minesweeper/sumAdjacents";

// CONSTANTS
const n = 7; // size of (n x n) matrix

// TYPESCRIPT DEFINITIONS
interface MinesweeperTilesProps {
    matrix: Tile[][];
    updateTile: (row: number, column: number) => void;
    endGameState: () => void;
    //updateGameState: () => void;
    //isGameStarted?: boolean;
    //setIsGameStarted?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Tile {
    hasBomb: boolean;
    adjacentCount: number;
    isVisible: boolean;
}

interface MinesweeperUIProps {
    updateGameState: () => void;
    // setSeconds: function useEffect(effect: React.EffectCallback, deps?: React.DependencyList | undefined): void
    startTimer: () => void;
    matrix: Tile[][];
    seconds: number;
    setSeconds: React.Dispatch<React.SetStateAction<number>>;
    isGameStarted: boolean;
    setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
    //decrementTest: () => void;
    endGameState: () => void;
}

// MAIN COMPONENT
const Minesweeper: React.FC<{}> = ({}) => {
    useIsAuth();
    const hold: Tile = { hasBomb: false, adjacentCount: 0, isVisible: true };

    const [matrix, setMatrix] = useState<Tile[][]>(
        //tilePlacement()
        // initial numbers filled here
        // first array for number of rows
        Array.from({ length: n }, () => Array.from({ length: n }, () => hold))
    ); // use string blanks for starting off
    const [isGameStarted, setIsGameStarted] = useState(false);

    const [seconds, setSeconds] = useState(90);

    /*
    const decrementTest = () => {
        setSeconds(seconds - 1);
    };
    */

    const startTimer = () => {
        console.log("function is called");
        //if (isGameStarted === true) {
        console.log("Game started, no countdown tho");
        useEffect(() => {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
                console.log("countdown works");
            } else {
                console.log("end of countdown");
                setSeconds(0);
            }
        });
        //}
    };
    // game does not reset board - adds more bombs instead
    const updateGameState = () => {
        if (isGameStarted === false) {
            setIsGameStarted(true);
            let newMatrix = bombSet(matrix);
            newMatrix = bombCount(newMatrix);
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
            setIsGameStarted(false);
        }
        // console.log("GAME START");
    };

    // explicit game reset - yet to try/test
    const resetGameBoard = () => {
        if (isGameStarted === false) {
            setMatrix(
                Array.from({ length: n }, () =>
                    Array.from({ length: n }, () => hold)
                )
            );
        }
    };

    const endGameState = () => {
        if (isGameStarted === true) {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    matrix[i][j] = {
                        hasBomb: matrix[i][j].hasBomb,
                        adjacentCount: matrix[i][j].adjacentCount,
                        isVisible: true,
                    };
                }
            }
            setIsGameStarted(false);
            //alert("GAME OVER");
        }
    };

    const updateTile = (row: number, column: number) => {
        let copy = [...matrix];

        // try to implement properties for matrix tiles
        if (copy[row][column].isVisible === false) {
            copy[row][column] = {
                hasBomb: copy[row][column].hasBomb,
                adjacentCount: copy[row][column].adjacentCount,
                isVisible: true,
            };
        }

        setMatrix(copy);

        console.log(copy);
    };

    const checkEndGame = (matrix: Tile[][]) => {
        console.log("checkEndGame is called");
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (
                    matrix[i][j].hasBomb === false &&
                    matrix[i][j].isVisible === false
                ) {
                    break;
                }
            }
        }
        endGameState();
    };

    return (
        <>
            <InterfaceUI>
                <Box>
                    <MinesweeperUI
                        //decrementTest={decrementTest}
                        updateGameState={updateGameState}
                        startTimer={startTimer}
                        seconds={seconds}
                        isGameStarted={isGameStarted}
                        setSeconds={setSeconds}
                        endGameState={endGameState}
                        setIsGameStarted={setIsGameStarted}
                        matrix={matrix}
                    />
                    <MinesweeperTiles
                        matrix={matrix}
                        updateTile={updateTile}
                        endGameState={endGameState}
                    />
                </Box>
            </InterfaceUI>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(Minesweeper);

// MINESWEEPER UI

const MinesweeperUI: React.FC<MinesweeperUIProps> = ({
    updateGameState,
    endGameState,
    setSeconds,
    isGameStarted,
    seconds,
    startTimer,
    //decrementTest,
    setIsGameStarted,
    matrix,
}) => {
    return (
        <Box>
            <Button
                onClick={() => {
                    updateGameState();
                }}
            >
                Start
            </Button>
            <Box>{seconds}</Box>
        </Box>
    );
};

// MINESWEEPER TILE GRID
const MinesweeperTiles: React.FC<MinesweeperTilesProps> = ({
    matrix,
    updateTile,
    endGameState,
    //updateGameState,
    //isGameStarted,
    //setIsGameStarted,
}) => {
    return (
        <Box bgColor={"blue.700"}>
            {matrix.map((row, rowIndex) => (
                <SimpleGrid key={rowIndex} columns={n}>
                    {row.map((column, columnIndex) => (
                        <Center py={2} key={columnIndex}>
                            <Button
                                bgColor={"orange.200"}
                                width={"60%"}
                                isDisabled={
                                    matrix[rowIndex][columnIndex].isVisible
                                }
                                onClick={() => {
                                    updateTile(rowIndex, columnIndex);
                                    if (matrix[rowIndex][columnIndex].hasBomb) {
                                        endGameState();
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

// Add properties to tiles
const tilePlacement = () => {
    let tiles: Tile[][] = [];

    for (let i = 0; i < n; i++) {
        tiles.push([]);
        for (let j = 0; j < n; j++) {
            tiles[i].push({
                hasBomb: false,
                adjacentCount: 0,
                isVisible: false,
            });
        }
    }

    bombSet(tiles);
    bombCount(tiles);
    console.log("testing the things:");
    console.log(tiles);
    return tiles;
};

// Bomb Placement
const bombSet = (tiles: Tile[][]) => {
    let bombsPlaced = 0;

    while (bombsPlaced < 7) {
        const rowRandom = Math.floor(getRandomInt(0, tiles.length));
        const colRandom = Math.floor(getRandomInt(0, tiles[0].length));

        tiles[rowRandom][colRandom] = {
            hasBomb: true,
            adjacentCount: tiles[rowRandom][colRandom].adjacentCount,
            isVisible: tiles[rowRandom][colRandom].isVisible,
        };

        // cells[rowRandom][colRandom].textContent = 'H'
        bombsPlaced++;
    }
    return tiles;
};

// Sum Adjacent
const bombCount = (tiles: Tile[][]) => {
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
