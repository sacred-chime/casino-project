import { Box, SimpleGrid } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { getRandomInt } from "../utils/getRandomInt";

const getRandomDie = (): any => {
    const diceSides = ['⚀','⚁','⚂', '⚃', '⚄','⚅'];
  
    return diceSides[getRandomInt(0, diceSides.length)];
  };

const Tile: React.FC<any> = (props: any) => {
    return (
      <Box bg="rgb(88,88,88)" height="100px" textAlign="center" paddingTop="38px">
        {props.value}
      </Box>
    );
  };

const Board: React.FC<{}> = ({}) => {
    let boardTiles = [];
    for (let i = 0; i < 2; i++) {
      const die: any = getRandomDie();
      boardTiles.push(
        <Tile key={`[0, ${i}]`} value={die}/>
      );
    }
    return (
      <Box
        margin={"auto"}
        width={"25%"}
        marginTop={"100px"}
        padding={"10px"}
        bg="rgb(88,88,88)"
      >
        <SimpleGrid columns={2} rows={1} spacing={2}>
          {boardTiles}
        </SimpleGrid>
      </Box>
    );
  };




const Craps: React.FC<{}> = ({}) => {
  useIsAuth();
  return (
    <>
      <InterfaceUI>
        <div>Craps</div>
        <Board></Board>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Craps);



/*
If his first throw is 7 or 11 and we bet the pass line we all win
If first roll is 2, 3, 12 we all loss
4, 5, 6, 8, 9, 10 
marker is now on number. Keeps rolling dice until he rolls that number. 
Roll number before 7, we all win
*/