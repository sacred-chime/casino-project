import { withUrqlClient } from "next-urql";
import React from "react";
import { InterfaceUI } from "../components/InterfaceUI";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik';
//import ReactDOM from 'react-dom';
import winners from "../src/patterns.png"

class Square extends React.Component <any, any> {
  constructor(props: any) {
    super(props) ;
    this.state = {
      bgColor: "white"
    } ;
  }

  render() {
    return (
      <div
        className="square"
        style={{backgroundColor: this.props.bgColor}}
      >
        {this.props.value}
      </div>
    );
  }
}

const formik = useFormik({
  initialValues: {
    bet: 1,
  },
  onSubmit: values => {
    alert(JSON.stringify(values, null, 2));
  },
});

class Board extends React.Component <any,any> {

  constructor(props: any) {
    super(props);
    this.state = {
      squares: Array(15).fill(null),
      numArray: Array(15).fill(null),
      colors: Array(15).fill('white')
    };
  }

  calculateWinner(squares: Array<string>,bet: number) {
    let colors = this.state.colors.slice() ;
    
    for(let i=0; i<colors.length;i++)
    {
      colors[i]='white' ;
    }
    
    const values = [10,10,10,10,15,15,15,20,20,30,1,1000,30,30,1000] ;
    const symbols = ['♠','♣','♥','♦','🍉','🍌','🍒','🍓','🍍','👑','💩','💯','💲','💍','📖'] ;
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
        return [true, (bet * Math.round(Math.pow(Math.random() * ind1, Math.sqrt(a)) * Number.EPSILON) * 100)/100,colors];
      }
    }
    return [false, 0,colors];
  }

  handleClick() {
    let numArray = [] ;
    const squares = this.state.squares.slice();
    const colors = this.state.colors.slice() ;
    const symbols = ['♠','♣','♥','♦','🍉','🍌','🍒','🍓','🍍','👑','💩','💯','💲','💍','📖'] ;
    let newColors = [] ;
    let won = false ;
    let winnings = 0 ;

    for(let i=0;i<15;i++)
    {
      let randomNum = Math.floor(Math.random() * symbols.length)
      numArray.push(randomNum)
      squares[i] = symbols[randomNum];
    }
    [won, winnings,newColors] = this.calculateWinner(squares,formik.values.bet)
    for(let i=0;i<newColors.length;i++)
    {
      colors[i] = newColors[i] ;
    }
  
    this.setState({squares: squares,numArray: numArray, colors: colors});
  }

  renderSquare(i: number) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick()}
        bgColor={this.state.colors[i]}
      />
    );
  }

  render() {
    let visible = 'none' ;
    let [winner, winnings] = this.calculateWinner(this.state.squares,formik.values.bet)
    let status ;
    if(winner)
    {
      status = "Winner!"
      visible = 'block' ;
    }
    else
    {
      let phrases = ["Wow you're bad at this", "Better luck next time!", "It's time to stop", "Get help", "Sorry"]
      status = phrases[Math.floor(Math.random() * 5)]
    }

    useIsAuth() ;
    
    return (
      <>
      <Form onSubmit={formik.handleSubmit}>
        <h1>Slot Machine</h1>
          <p>Try to not lose your mortgage :)</p>
          <div>
            <div className="board-row">
              {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}{this.renderSquare(3)}{this.renderSquare(4)}
            </div>
            <div className="board-row">
            {this.renderSquare(5)}{this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}{this.renderSquare(9)}
            </div>
            <div className="board-row">
            {this.renderSquare(10)}{this.renderSquare(11)}{this.renderSquare(12)}{this.renderSquare(13)}{this.renderSquare(14)}
            </div>
          </div>
          <br></br>
          <label htmlFor="bet">How much would you like to bet?</label>
          <input id="bet" name="bet" type="number" onChange={formik.handleChange} value={formik.values.bet}></input>
          <button type="submit">Submit Bet</button>
          <button style={{fontSize:16, position:'relative', left:'42%'}} onClick={() => this.handleClick()}>Spin</button><br></br><br></br>
          <div>{status}</div><div style={{display: visible}}>Congrats, you won ${winnings}!</div>
        </Form>
      </>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

// ========================================

/*ReactDOM.render(
  <Game />,
  document.getElementById('root')
);*/

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