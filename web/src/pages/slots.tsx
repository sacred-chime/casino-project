import { Box, SimpleGrid } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { NavBar } from "../components/NavBar";
import { convertNumToCoord } from "../utils/convertNumToCoord";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";

const getRandomFruit = () => {
  const fruit = [
    "apple",
    "cherry",
    "banana",
    "strawberry",
    "mango",
    "pineapple",
  ];

  return fruit[getRandomInt(0, fruit.length)];
};

interface tileProps {
  value: String;
}

const Tile: React.FC<tileProps> = (props) => {
  return (
    <Box bg="tomato" height="100px" textAlign="center" paddingTop="38px">
      {props.value}
    </Box>
  );
};

const Board: React.FC<{}> = ({}) => {
  let boardTiles = [];
  for (let i = 0; i < 9; i++) {
    boardTiles.push(
      <Tile key={`${convertNumToCoord(i)}`} value={getRandomFruit()} />
    );
  }
  return (
    <Box
      margin={"auto"}
      width={"25%"}
      marginTop={"100px"}
      padding={"10px"}
      bg="lightskyblue"
    >
      <SimpleGrid columns={3} spacing={2}>
        {boardTiles}
      </SimpleGrid>
    </Box>
  );
};

const Slots: React.FC<{}> = ({}) => {
  return (
    <>
      <NavBar />
      <Board />
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Slots);
