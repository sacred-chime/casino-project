import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, {useState} from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useSubscription } from "urql";

var playerCardTotal = 0;
var playerHandValues : Array<[string, string]> = [];
var dealerCardTotal = 0;
var dealerHandValues:Array<Array<String>>;

function drawCard(): [string, string]{
  var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return([suits[Math.floor(Math.random() * 3)], values[Math.floor(Math.random() * 12)]]);
}

function placeBet() {
  var betValue = prompt("How much would you like to bet");
  console.log("Bet Placed for", betValue);
  //alert("Bet Placed");
}

function calculateHand(hand:string[][]){
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
  var drawnCard: [string, string] = drawCard();
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

function updateBoard(board:Array<string>){
  board[2] = "1";
  console.log(board[2]);
  return board;
}

const Tile: React.FC<tileProps> = (props) => {
  return (
    <Box bg="gray.800" height="100px" textAlign="center" paddingTop="50px">
      {props.value}
    </Box>
  );
};




interface tileProps {
  value: String;
}


const Blackjack: React.FC<{}> = ({}) => {
  useIsAuth();
  const[boardTiles, updateBoardTiles] = useState(new Array(14));
  const[Board, updateBoardFinal] = useState(new Array(14));

  const Board: React.FC<{}> = ({}) => {
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
  
  return (
    <>
      <InterfaceUI>
        <Button onClick={() => hit()}>Hit</Button>
        <Button onClick={() => {updateBoardTiles(boardTiles => updateBoard(boardTiles))}}>test</Button>
        <Button onClick={() => stand()}>Stand</Button>
        <Button onClick={() => placeBet()}>Place Bet</Button>

        <Board />
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Blackjack);
