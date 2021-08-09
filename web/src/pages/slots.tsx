import { Box, SimpleGrid } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { useMeQuery } from "../generated/graphql";
import { convertNumToCoord } from "../utils/convertNumToCoord";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getRandomInt } from "../utils/getRandomInt";
import { isServer } from "../utils/isServer";
import { useIsAuth } from "../utils/useIsAuth";

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
  useIsAuth();
  return (
    <>
      <InterfaceUI>
        <Board />
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Slots);
