import { Box, Container, Heading, Text, Button, SimpleGrid, Flex, Grid, GridItem } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, {useState} from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { CellValue, CellState, Cell } from "../components/minesweeper/types/index"; 
import cellButton from "../components/minesweeper/Button/index";
import { getRandomInt } from "../utils/getRandomInt";

function generateCells() {
    const cells: Cell[][] = []; // arrays

    for (let row = 0; row < 9; row++) {
        cells.push([]);
        for (let col = 0; col < 9; col++) {
            cells[row].push({
                value: CellValue.none, // imported from types in components 
                state: CellState.open
                
            })
        }
    }

    // randomize bomb locations func - 10 as default
    let bombsPlaced = 0;
//    while (bombsPlaced < 10) {
//
//    }



    return cells; 
}



const App: React.FC<{}> = ({ }) => {
    useIsAuth();
    // state
    const [cells, setcells] = useState(generateCells());

    // grid of cells made here
    // React.ReactNode to ensure output is JSX element
    const renderCells = (): React.ReactNode => {
        // row is an array, rowIndex - element, index in map
        return cells.map((row, rowIndex) =>
            // map again, similar to 2darray - element(cell), index 
            // returns each Box - each Box has unique key, hence where Row and Col Index come in
            row.map((cell, columnIndex) => <Box
                as='button'
                bg="tomato"
                borderWidth='1px'
                borderColor='black'
                height="45px"
                w="45px"
                key={`${rowIndex}-${columnIndex}`}
                _hover={{bg: 'red'}} // hover before active to make activation visible
                _active={{
                    bg: 'white',
                }}
                
            />));
    };

    //console.log(cells);
    return (
        <>
            <InterfaceUI>
                <Box id="main-box" bg='gray.400' padding='12px' borderWidth='4px' borderStyle='solid' borderRightColor='gray.400' borderBottomColor='gray.400' borderLeftColor='white' borderTopColor='white'
                w='520px' h='600px' >
                   
                    <Box id="header" bg='gray.400' padding='10px' borderWidth='4px' borderStyle='solid' borderRightColor='white' borderBottomColor='white' borderLeftColor='gray.100' borderTopColor='gray.100'
                        w='96%' h='20%' display='flex' justifyContent='space-between'>
                    
                        <Box id="flag-count" w="80px" h="48px" color="red.300" bg="black">
                            000
                        </Box>
                        <Box as='button' id="reset" bg='gray.300' h="40px" w="60px" borderStyle='solid' borderWidth='2px' padding='3px' _active={{bg: 'gray.200',}}>
                            Reset
                        </Box>
                        <Box id="timer" w="80px" h="48px" color="red.300" bg="black">
                            100
                        </Box>

                    </Box>

                    <Box id="body" bg='gray.400' padding='14px' borderWidth='4px' borderStyle='solid' borderRightColor='white' borderBottomColor='white' borderLeftColor='gray.100' borderTopColor='gray.100'
                        w='96%' h='460px' > {renderCells()}
                        <Grid gridTemplateColumns='repeat(9, 1fr)' gridTemplateRows='repeat(9, 1f)' >

                        </Grid>
                    </Box>
                
                </Box>
                
            </InterfaceUI>
            
        </>
    ); // consider using Box as='button' to call a function at each square
};






// <Board rowNum={3} colNum={5} />
/*
interface BoardProps {rowNum: number, colNum: number , randomVar?: number}

const Board: React.FC<BoardProps> = ({rowNum, colNum}) => {
    let boardSquaresRows: number[][] = [];
    for (let row = 0; row < rowNum; row++) {
        let boardSquaresCols: JSX.Element[] = [];
        
        for (let col = 0; col < colNum; col++) {
            boardSquaresCols.push(<Box>{col}</Box>);
            let mappedBoard: JSX.Element[] = boardSquaresCols.map((element, index) => {element })
        }
         
        boardSquaresRows.push(<Box>{boardSquaresCols}</Box>);

    }
    return 
};
*/
export default withUrqlClient(createUrqlClient)(App);