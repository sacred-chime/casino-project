import { withUrqlClient } from "next-urql";
import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";


var playerCardTotal = 0;
var playerHandValues : any[];
var dealerCardTotal = 0;
var dealerHandValues:Array<Array<String>>;

function drawCard(){
  var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return([suits[Math.floor(Math.random() * 3)], values[Math.floor(Math.random() * 12)]]);
}

function placeBet() {
  var betValue = prompt("How much would you like to bet");
  console.log("Bet Placed for", betValue);
  //alert("Bet Placed");
}

function calculateHand(hand:any[]){
  let total = 0;
  let aces = 0;
  for(let i = 0; i < hand.length; i++){
    if (hand[i][1] == "A"){
      aces += 1;
    }
    else if(hand[i][1] == "J" || hand[i][1] == "Q" || hand[i][1] == "K"){
      total += 10;
    }
    else{
      total += parseInt(hand[i][1]);
    }
  }
  for(let i = 0; i < aces; i++){
    if(total <= 10){
      total += 11;
    }
    else{
      total += 1;
    }
  }
  return total;
}

function hit() {
  console.log("Hit");
  var drawnCard = drawCard();
  playerHandValues.push(drawnCard);
  console.log("Drew", drawnCard[0], drawnCard[1]);
  playerCardTotal = calculateHand(playerHandValues);
  console.log("Total", playerCardTotal);
}

function stand() {
  console.log("Stand", playerCardTotal);
}

interface tileProps {
  value: String;
}

const Tile: React.FC<tileProps> = (props) => {
  return (
    <Box bg="#1A202D" height="100px" textAlign="center" paddingTop="50px">
      {props.value}
    </Box>
  );
};

const Board: React.FC<{}> = ({}) => {
  let boardTiles = new Array(14);
  boardTiles[0] = <Tile key={0} value={"Dealer's Cards"} />;
  for (let i = 1; i < 6; i++) {
    boardTiles[i] = <Tile key={i} value={""} />;
  }
  boardTiles[7] = <Tile key={7} value={"Your Cards"} />;
  boardTiles[6] = <Tile key={6} value={"Total: 21"} />;
  for (let i = 8; i < 13; i++) {
    boardTiles[i] = <Tile key={i} value={""} />;
  }
  boardTiles[13] = <Tile key={13} value={`Total: ${playerCardTotal}`} />;


  return (
    <Box
      margin={"auto"}
      width={"100%"}
      marginTop={"100px"}
      padding={"10px"}
      bg="lightskyblue"
    >
      <SimpleGrid columns={7} spacing={2}>
        {boardTiles}
      </SimpleGrid>
    </Box>
  );
};

const Blackjack: React.FC<{}> = ({}) => {
  useIsAuth();
  return (
    <>
      <InterfaceUI>
      <button onClick={hit}>Hit</button>
      <button onClick={stand}>Stand</button>
      <button onClick={placeBet}>Place Bet</button>
      {<Board />}
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Blackjack);
