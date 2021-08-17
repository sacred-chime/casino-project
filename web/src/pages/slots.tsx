import { withUrqlClient } from "next-urql";
import React, {useState, useEffect} from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik';
import { chakra, color } from "@chakra-ui/react"
import { parseBody } from "next/dist/server/api-utils";
//import ReactDOM from 'react-dom';
//import winners from "../src/patterns.png"

const values = [10,10,10,10,15,15,15,20,20,30,1,1000,30,30,1000] ;
const symbols = ['♣','♦','♥','♠','🍉','🍌','🍒','🍓','🍍','👑','💩','💯','💲','💍','📖'] ;
const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [0, 6, 2, 8, 4],
    [10, 6, 2, 8, 14],
    [0, 6, 7, 8, 14],
    [0, 11, 2, 13, 4],
    [10, 6, 7, 8, 4],
    [10, 11, 2, 13, 14],
    [5, 11, 2, 13, 9],
    [0, 11, 12, 13, 4],
    [0, 6, 2, 8, 14],
    [10, 1, 12, 3, 14],
    [10, 6, 7, 8, 14],
    [0, 11, 7, 13, 9]
  ];

interface squareProps {
    bgColor: string;
    symbol: string;
}

interface boardProps {
    bet?: number;
    squares: Array<string>;
    numArray: Array<number>;
    colors: Array<string>;
}

function renderSquare(i: number,colors:Array<string>,squares:Array<string>) {
  console.log("rendering")  
  return (
      <Square
        bgColor={colors[i]}
        symbol={squares[i]}
      />
    );
  }

function calculateWinner(squares: Array<string>,colors: Array<string>,bet: string | undefined) {
  let bet2 = parseInt(bet!)  
  for(let i=0; i<colors.length;i++)
    {
      colors[i]='white' ;
    }
    
    for(let i=0; i<lines.length;i++)
    {
      const [a, b, c, d, e] = lines[i];
      let ind1 = values[symbols.indexOf(squares[a])] ;
      let ind2 = values[symbols.indexOf(squares[b])] ;
      let ind3 = values[symbols.indexOf(squares[c])] ;
      let ind4 = values[symbols.indexOf(squares[d])] ;
      let ind5 = values[symbols.indexOf(squares[e])] ;

      if (ind1 === ind2 && ind2 === ind3 && ind3 === ind4 && ind4 === ind5) {
        colors[a] = 'green' ;
        colors[b] = 'green' ;
        colors[c] = 'green' ;
        colors[d] = 'green' ;
        colors[e] = 'green' ;
        return [true, (bet2 * Math.round(Math.pow(Math.random() * ind1, Math.sqrt(a)) * Number.EPSILON) * 100)/100,colors];
      }
    }
    return [false, 0,colors];
  }

const Square: React.FC<squareProps> = ({bgColor, symbol}) => {
    return (
        <div className="square" style={{backgroundColor: bgColor}}>{symbol}</div>
    )
}

const Board: React.FC<boardProps> = () => {

    const [bet, setBet] = useState<React.ChangeEvent<HTMLInputElement> | null>(null);
    const [squares, setSquares] = useState(Array(15).fill(null))
    const [colors, setColors] = useState(Array(15).fill('white'))
    const [numArray, setArray] = useState(Array(15).fill(null))
    
    let visible = 'none' ;
    let [winner, winnings] = calculateWinner(squares,colors,bet?.target.value)
    let status ;
    if(winner)
    {
      status = "Winner!"
      visible = 'block' ;
    }
    else
    {
      let phrases = ["Wow you're bad at this", "Better luck next time!", "It's time to stop", "Get help", "Sorry"]
      status = phrases[Math.floor(Math.random() * phrases.length)]
    }

    return (
        <>
          <h1>Slot Machine</h1>
            <p>Try to not lose your mortgage :)</p>
            <div>
              <div className="board-row">
                {renderSquare(0,colors,squares)}{renderSquare(1,colors,squares)}{renderSquare(2,colors,squares)}{renderSquare(3,colors,squares)}{renderSquare(4,colors,squares)}
              </div>
              <div className="board-row">
              {renderSquare(5,colors,squares)}{renderSquare(6,colors,squares)}{renderSquare(7,colors,squares)}{renderSquare(8,colors,squares)}{renderSquare(9,colors,squares)}
              </div>
              <div className="board-row">
              {renderSquare(10,colors,squares)}{renderSquare(11,colors,squares)}{renderSquare(12,colors,squares)}{renderSquare(13,colors,squares)}{renderSquare(14,colors,squares)}
              </div>
            </div>
            <br></br>
            <label>
              How much would you like to bet?
              <input type="number" onChange={(input) => setBet(input)} style={{color: "black"}}/>
            </label>
            <br/>
            <button style={{fontSize:16, position:'relative', left:'42%'}} onClick={() => 
            {    
                for(let i=0;i<15;i++)
                {
                  let randomNum = Math.floor(Math.random() * symbols.length)
                  numArray[i] = (randomNum)
                  squares[i] = symbols[randomNum];
                }
                let values = calculateWinner(squares,colors,bet?.target.value)
                let newColors:any = values[2] ;
                setColors(newColors)
                setSquares(squares)
                setArray(numArray)

            }
            }>Spin</button><br></br><br></br>
            <div>{status}</div><div style={{display: visible}}>Congrats, you won ${winnings}!</div>
        </>
      );
}

const Game: React.FC = () => {
    return (
        <div className="game">
        <div className="game-board">
          <Board squares={Array(15).fill(null)} numArray={Array(15).fill(null)} colors={Array(15).fill('white')}/>
        </div>
        <div className="game-info">
        </div>
      </div>
    )
}

const Slots: React.FC<{}> = ({}) => {
    useIsAuth();
    return (
      <>
        <InterfaceUI>
          <Game />
        </InterfaceUI>
      </>
    );
  };
  
  export default withUrqlClient(createUrqlClient)(Slots)


/**/