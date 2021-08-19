import { Box, Button, Center, SimpleGrid } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql";
import React,{useState} from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { getRandomInt } from "../utils/getRandomInt";
import { Image } from "@chakra-ui/react"
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react"
import { CloseButton } from "@chakra-ui/react"
import { FormControl,FormLabel,FormErrorMessage,FormHelperText} from "@chakra-ui/react"
import { Select } from "@chakra-ui/react"
import diceFace1 from "../assets/dice-six-faces-one.png";
import diceFace2 from "../assets/dice-six-faces-two.png";
import diceFace3 from "../assets/dice-six-faces-three.png";
import diceFace4 from "../assets/dice-six-faces-four.png";
import diceFace5 from "../assets/dice-six-faces-five.png";
import diceFace6 from "../assets/dice-six-faces-six.png";

// Pairs the unicode dice side to its respective image
const DICE_FACE: any = {
    '⚀': diceFace1,
    '⚁': diceFace2,
    '⚂': diceFace3,
    '⚃': diceFace4,
    '⚄': diceFace5,
    '⚅': diceFace6
}

// This function returns a random die
const getRandomDie = (): any => {
    const diceSides = ['⚀','⚁','⚂', '⚃', '⚄','⚅'];
  
    return diceSides[getRandomInt(0, diceSides.length)];
};

// This function converts unicode dice to its respective image
const convertUnicode = (unicode: any): any => {
  
    return DICE_FACE[unicode];
};

// This function calculates the sum of two dice sides
const diceSum = (dice1: any, dice2: any): any => {
    return (dice1 + dice2);
};

// This function converts unicode to its integer 
const getDiceInt = (diceUni: any): any => {
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

const Tile: React.FC<any> = (props: any) => {

    return (
      <Box bg="rgb(88,88,88)" height="100px" textAlign="center" paddingTop="38px">
          {props.value}
          {<Image src={convertUnicode(props.value)}/>}
      </Box>
    );
};

const Win: React.FC<any> = (props: any) => {
    console.log("Lose React method");
    return (
        <Alert status="success">
        <AlertIcon />
        <Box flex="1">
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription display="block">
        Your application has been received. We will review your application and
        respond within the next 48 hours.
        </AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
    );
};

const Lose: React.FC<any> = (props: any) => {
    console.log("Lose React method");
    return (
        <Alert status="success">
        <AlertIcon />
        <Box flex="1">
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription display="block">
        Your application has been received. We will review your application and
        respond within the next 48 hours.
        </AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
    );
};

const Board: React.FC<{}> = ({}) => {

    const [diceDisplay, setDiceDisplay] = useState<any>(['START', 'GAME'])
    
    const rollDice = () => {
        let diceSide = [];
        for (let i = 0; i < 2; i++) {
            const die: any = getRandomDie();
            diceSide.push(
              die
            );
          }
        setDiceDisplay(diceSide);
        let diceValue1 = getDiceInt(diceSide[0]);
        let diceValue2 = getDiceInt(diceSide[1]);
        let sumOfDice = diceSum(diceValue1,diceValue2);

        console.log("The sum is"+sumOfDice);

        if (sumOfDice === 7 || sumOfDice === 11) {
            console.log('YOU WON!!!!!!');
            <Win></Win>
        } else if (sumOfDice === 2 || sumOfDice === 3 || sumOfDice === 12) {
            console.log('YOU LOST!!!!!!');
            <Lose></Lose>
        } else {
            console.log('Other');
        }

        let marker = sumOfDice;

        console.log("This is the marker: "+marker);

        // while(true) {
        //     // let markerDiceSide = [];
        //     // for (let i = 0; i < 2; i++) {
        //     //     const die: any = getRandomDie();
        //     //     markerDiceSide.push(
        //     //         die
        //     //     );
        //     // }
        //     // setDiceDisplay(markerDiceSide);
        //     let markerDiceValue1 = getDiceInt(diceSide[0]);
        //     let markerDiceValue2 = getDiceInt(diceSide[1]);
        //     let markerSumOfDice = diceSum(markerDiceValue1,markerDiceValue2);

        //     console.log('Inside marker.... '+ markerSumOfDice);

        //     if (sumOfDice === marker) {
        //         console.log('YOU WON...marker!!!!!!');
        //         <Win></Win>
        //         break;
        //     } else if (sumOfDice === 7) {
        //         console.log('YOU LOST...marker!!!!!!');
        //         <Lose></Lose>
        //         break;
        //     }
        // }
    }
/*
If his first throw is 7 or 11 and we bet the pass line we all win
If first roll is 2, 3, 12 we all loss
4, 5, 6, 8, 9, 10 
marker is now on number. Keeps rolling dice until he rolls that number. 
Roll number before 7, we all win
*/
    
    return (
    <>
    <Center><Heading marginTop={"50px"} color='red'>Craps ⚅</Heading></Center>
    <Box
        margin={"auto"}
        width={"25%"}
        marginTop={"50px"}
        padding={"10px"}
        bg="rgb(88,88,88)"
    >
    <SimpleGrid columns={2} rows={1} spacing={2}>
        {diceDisplay.map((die: any, i: any) => (<Tile key={`[0, ${i}]`} value={die}/>))}
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