import { Box, Button, Flex, Grid, SimpleGrid, useControllableState } from "@chakra-ui/react";
import { collectProjectingChildren } from "framer-motion/types/render/dom/projection/utils";
import { withUrqlClient } from "next-urql";
import React, { Dispatch, useState } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
/*import {
  Cell,
  CellState,
  CellValue,
} from "../components/minesweeper/types/index";
*/
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { sumAdjacents } from "../utils/minesweeper/sumAdjacents";
import { useIsAuth } from "../utils/useIsAuth";

// MAIN COMPONENT
const Minesweeper: React.FC<{}> = ({}) => {
  useIsAuth();
  // state
  const [cells, setCells] = useState(generateCells());

  
   // maybe use multiple functions for different states?
  // how to apply setcells to each box if cannot reference - maybe bring generateCells back in?
  // or bring useState out of MAIN?
  
  //console.log(cells);
  return (
    <>
      <InterfaceUI>
        <Box
          id="main-box"
          bg="gray.400"
          padding="12px"
          borderWidth="4px"
          borderStyle="solid"
          borderRightColor="gray.400"
          borderBottomColor="gray.400"
          borderLeftColor="white"
          borderTopColor="white"
          w="520px"
          h="600px"
        >
          <Flex
            id="header"
            bg="gray.400"
            padding="10px"
            borderWidth="4px"
            borderStyle="solid"
            borderRightColor="white"
            borderBottomColor="white"
            borderLeftColor="gray.100"
            borderTopColor="gray.100"
            w="96%"
            h="20%"
            justifyContent="space-between"
          >
            <Box id="flag-count" w="80px" h="48px" color="red.300" bg="black">
              000
            </Box>
            <Button
              id="reset"
              bg="gray.300"
              h="40px"
              w="60px"
              borderStyle="solid"
              borderWidth="2px"
              padding="3px"
              _active={{ bg: "gray.200" }}
            >
              Reset
            </Button>
            <Box id="timer" w="80px" h="48px" color="red.300" bg="black">
              100
            </Box>
          </Flex>

          <Box
            id="body"
            bg="gray.400"
            padding="14px"
            borderWidth="4px"
            borderStyle="solid"
            borderRightColor="white"
            borderBottomColor="white"
            borderLeftColor="gray.100"
            borderTopColor="gray.100"
            w="96%"
            h="460px"
          >
            <RenderCells cells={cells} setCells={setCells}/>
            <Grid
              gridTemplateColumns="repeat(9, 1fr)"
              gridTemplateRows="repeat(9, 1f)"
            ></Grid>
          </Box>
        </Box>
      </InterfaceUI>
    </>
  ); // consider using Box as='button' to call a function at each square
};

export default withUrqlClient(createUrqlClient)(Minesweeper);

interface RenderCellsProps {
  cells: Cell[][];
  setCells: React.Dispatch<React.SetStateAction<Cell[][]>>;
}

// grid of cells made here
const RenderCells: React.FC<RenderCellsProps> = ({ cells, setCells }) => {

  /*
  handleCardClick(id, card) {
    let items = [...state.items];
    items[id].selected = items[id].selected ? false : true
    this.setState(() => ({
        items
    }));
}
  */
  const updateCell = (row: number, column: number) => {
    let copy = cells;
    
    copy[row][column].isOpen = true;
    copy[row][column].hasBomb = true;
    console.log("bomb planted");
    //console.log({cells})


    let rowCell = [];
    for (let index = 0; index < 9; index++) {
      let colCell = [];
      if (copy[row][column].hasBomb === true) {
        colCell.push(
          < NewCell key={"board-col" + column} rowIndex={row} columnIndex={column} content='💣' updateCell={updateCell} />
        )
      }
      rowCell.push(
      <Box key={"board-row" + row} columns={9}>
        {row}
      </Box>
      )
    }


    for (let i = 0; i < copy.length; i++) {
      for (let j = 0; j < copy[0].length; j++) {
        const newAdjacent = sumAdjacents(copy, i, j);
        copy[i][j].adjacentCount = newAdjacent; 
      }
    }
    setCells(copy);
    
    return <Box>{rowCell}</Box>;

    // return (<RenderCells cells={copy} setCells={setCells} />); // maybe return Minesweeper? unlikely
  }
  
  let rows = [];
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    
    let row = [];
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      if (cells[rowIndex][colIndex].hasBomb === false && cells[rowIndex][colIndex].isOpen === false ) {
        row.push(
          < NewCell key={"board-col" + colIndex} rowIndex={rowIndex} columnIndex={colIndex} updateCell={updateCell} content={"" + cells[rowIndex][colIndex].adjacentCount}  />
        )
      }
      else {
        row.push(
          < NewCell key={"board-col" + colIndex} rowIndex={rowIndex} columnIndex={colIndex} content='💣' updateCell={updateCell} />
        )
      }
    }
    rows.push(
      <Box key={"board-row" + rowIndex} columns={9}>
        {row}
      </Box>
    )
  }
  return <Box>{rows}</Box>;

};

// Box

interface NewCellProps {
  rowIndex: number;
  columnIndex: number;
  content?: string;
  updateCell: (row: number, column: number) => void
  
  
}
const NewCell: React.FC<NewCellProps> = ({ rowIndex, columnIndex, content, updateCell }) => {
  return <Box
    as="button"
    onClick={() => updateCell(rowIndex, columnIndex)} // onClick for each cell/button
    bg="tomato"
    borderWidth="1px"
    borderColor="black"
    height="45px"
    w="45px"
    //id={`${rowIndex}-${columnIndex}`}
    //key={`${rowIndex}-${columnIndex}`}
    _hover={{ bg: "red" }} // hover before active to make activation visible
    _active={{
      bg: "white",

    }}
  > {content}
  </Box>
  
}


export interface Cell {
  hasBomb: boolean;
  isOpen: boolean;
  adjacentCount: number;
  rowVal: number;
  colVal: number; 
}


// HELPER FUNCTIONS


const generateCells = () => {
  let cells: Cell[][] = []; // arrays

  for (let row = 0; row < 9; row++) {
    cells.push([]);
    for (let col = 0; col < 9; col++) {
      cells[row].push({
        hasBomb: false,
        isOpen: false, 
        adjacentCount: 0,
        rowVal: row,
        colVal: col,
      });
    }
  }

  // randomize bomb locations func - 10 as default
  let bombsPlaced = 0;
  while (bombsPlaced < 10) {
    const rowRandom = Math.floor(getRandomInt(0, 8));
    const colRandom = Math.floor(getRandomInt(0, 8));

    const current = cells[rowRandom][colRandom];
    // change CellValue.none to bomb - enum defaults to nine since "bomb" is the nineth in console.log
    if (!current.hasBomb) {
      cells[rowRandom][colRandom].hasBomb = true; 
      // cells[rowRandom][colRandom].textContent = 'H'
      bombsPlaced++;
      
    }
  }
  // console.log(`Bombs Placed: ${bombsPlaced}`)



  //sum of adjacent cells w/ bombs
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[0].length; j++) {
      const newAdjacent = sumAdjacents(cells, i, j);
      cells[i][j].adjacentCount = newAdjacent; 
    }
    
  }
  
  return cells;
};


// onClick function
// check if adjacentCount of nearby cells is 0 - clear multiple cells - recursion

function handleClick(rowCount: number, colCount: number) {
  console.log("Func call worked")
  console.log({ rowCount }, { colCount });
  

}
/*
const componentDidUpdate = (prevProps: Cell[][]) => {
    if(prevProps.isOpen !== true){
        this.setCells({          
          isOpen: true,
        });
    }
}
*/