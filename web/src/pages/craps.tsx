import { Box, Button, Center, SimpleGrid } from "@chakra-ui/react";
import { Heading, Image } from "@chakra-ui/react";
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { FormControl, Text, Select} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React,{useState} from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { getRandomInt } from "../utils/getRandomInt";
import {useChangeFundsMutation, useCreateBetMutation,} from "../generated/graphql";

// Pairs the unicode dice side to its respective image
const DICE_FACE: any = {
    '⚀': "https://upload.wikimedia.org/wikipedia/commons/2/2c/Alea_1.png",
    '⚁': "https://upload.wikimedia.org/wikipedia/commons/b/b8/Alea_2.png",
    '⚂': "https://upload.wikimedia.org/wikipedia/commons/2/2f/Alea_3.png",
    '⚃': "https://upload.wikimedia.org/wikipedia/commons/8/8d/Alea_4.png",
    '⚄': "https://upload.wikimedia.org/wikipedia/commons/5/55/Alea_5.png",
    '⚅': "https://upload.wikimedia.org/wikipedia/commons/f/f4/Alea_6.png"
}

// This function returns a random die
const getRandomDie = (): string => {
    const diceSides = ['⚀','⚁','⚂', '⚃', '⚄','⚅'];
  
    return diceSides[getRandomInt(0, diceSides.length)];
};

// This function converts unicode dice to its respective image
const convertUnicode = (unicode: string): string => {
  
    return DICE_FACE[unicode];
};

// This function calculates the sum of two dice sides
const diceSum = (dice1: number, dice2: number): number => {
    return (dice1 + dice2);
};

// This function converts unicode to its integer 
const getDiceInt = (diceUni: string): number => {
    let diceInt = 0;

    if (diceUni === '⚀') {
        diceInt = 1;
    } else if (diceUni === '⚁') {
        diceInt = 2;
    } else if (diceUni === '⚂') {
        diceInt = 3;
    } else if (diceUni === '⚃') {
        diceInt = 4;
    } else if (diceUni === '⚄') {
        diceInt = 5;
    } else if (diceUni === '⚅'){
        diceInt = 6;
    } else {
        console.log('Wrong input');
    }

    return diceInt;
};

enum Decider {
    Win = "WIN",
    Lose = "LOSE",
    Nothing = "",
}
  
interface EndGameProps {
    decider: Decider;
}

// This function determines if a winning alert, losing alert, or nothing should be displayed 
const EndGame: React.FC<EndGameProps> = ({ decider }) => {
    const endGameFn = () => {
      if (decider === "WIN") {
        return <Win></Win>
      } else if (decider === "LOSE") {
        return <Lose></Lose>
      } else {
        return <></>
      }
    };
    
    return (
      endGameFn()
    )
}

const Tile: React.FC<any> = (props: any) => {

    return (
      <Box bg="rgb(26,32,44)" textAlign="center" >
          <Image src={convertUnicode(props.value)}/>
      </Box>
    );
};

const Win: React.FC<any> = () => {
    return (
        <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="150px"
        color="rgb(26,32,44)"
        marginTop="20px"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                You won!!!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
                Place your wager and roll the dice to start a new game!
            </AlertDescription>
        </Alert>
    );
};

const Lose: React.FC<any> = () => {
    return (
        <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="150px"
        color="rgb(26,32,44)"
        marginTop="20px"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                You lost!!!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
                Place your wager and roll the dice to start a new game!
            </AlertDescription>
        </Alert>
    );
};

const Board: React.FC<{}> = ({}) => {

    const [diceDisplay, setDiceDisplay] = useState<Array<string>>([])
    const [continueState, setContinueState] = useState<Decider>(Decider.Nothing)
    const [marker, setMarker] = useState<number>(-1)
    const [bet, setBet] = useState<number>(0)

    const [, changeFunds] = useChangeFundsMutation();
    const [, createBet] = useCreateBetMutation();

    const rollDice = () => {
        let wager = document.getElementById("placeBet");
        const wagerVal = wager.value;
        console.log("WagerVal: "+wagerVal);
        setBet(wagerVal);
        console.log("Bet: "+bet);

        if (bet === 0) {
            createBet({
                input: {
                  game: "Craps",
                  wager: wagerVal,
                  payout: wagerVal * 2,
                },
            });
        }

        let diceSide = [];
        for (let i = 0; i < 2; i++) {
            const die: string = getRandomDie();
            diceSide.push(
              die
            );
          }
        setDiceDisplay(diceSide);
        let diceValue1 = getDiceInt(diceSide[0]);
        let diceValue2 = getDiceInt(diceSide[1]);
        let sumOfDice = diceSum(diceValue1,diceValue2);


        if (marker === -1) {
            if (sumOfDice === 7 || sumOfDice === 11) {
              setContinueState(Decider.Win);
              setMarker(-1);
              setBet(0);
              changeFunds({fundDelta: wagerVal*2});
            } else if (sumOfDice === 2 || sumOfDice === 3 || sumOfDice === 12) {
                setContinueState(Decider.Lose);
                setMarker(-1);
                setBet(0);
                changeFunds({fundDelta: 0});
            } else {
                setContinueState(Decider.Nothing);
                setMarker(sumOfDice);
            }
        
          } else {
            if (sumOfDice === marker) {
              setContinueState(Decider.Win);
              setMarker(-1);
              setBet(0);
              changeFunds({fundDelta: wagerVal*2});
            } else if (sumOfDice === 7) {
                setContinueState(Decider.Lose);
                setMarker(-1);
                setBet(0);
                changeFunds({fundDelta: 0});
            } else {
                setContinueState(Decider.Nothing);
            }
          }
    }
    
    return (
    <>
    <Center><Heading marginTop={"50px"} color='red'>Craps ⚅</Heading></Center>
    <Box
        margin={"auto"}
        width={"25%"}
        marginTop={"50px"}
        padding={"10px"}
        bg="rgb(26,32,44)"
    >
    <SimpleGrid columns={2} rows={1} spacing={2}>
        {diceDisplay.map((die: string, i: number) => (<Tile key={`[0, ${i}]`} value={die}/>))}
    </SimpleGrid>
    </Box>
    <Center marginTop={"40px"}>
    <Button colorScheme="red" onClick={rollDice}>
        Roll Dice
    </Button>
    </Center>
    <Center marginTop={"40px"}>
    <FormControl id="placeBet" width={"25%"}>
        <Select placeholder="Wager" color="red">
            <option>$25</option>
            <option>$50</option>
            <option>$75</option>
            <option>$100</option>
            <option>$125</option>
            <option>$150</option>
        </Select>
    </FormControl>
    </Center>
    <EndGame decider={continueState} />
    <Text marginTop={"150px"} fontSize="lg">Rules: Place your wager and roll the dice. If your first roll is a 7 or 11, you win. 
    If your first roll is a 2, 3, or 12, you lose. Rolling any other number 
    (4, 5, 6, 8, 9, 10) means that a marker is set to your number, and you will continue rolling the dice. 
    To win, keep rolling the dice until you roll the marker number. However, if you roll a 7 before rolling the marker number, you lose.
    </Text>
    </>
    );
  };

const Craps: React.FC<{}> = ({}) => {
  useIsAuth();
  return (
    <>
      <InterfaceUI>
        <Board></Board>
      </InterfaceUI>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Craps);