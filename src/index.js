import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//  Me falta una mejor definición de qué es un estado

 // componente square
 // Un componente que no mantiene estados y que solo recibe e informa valores
 // como Square en este caso se le denomina compoenete controlado
 // (porque es controlado por su componente padre)
// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square"
//       // Aquí dice que al ejecutar la acción onClick del botón se llamará
//       // a la función onClick del componente padre
//       // En react existe una convención de que hice que un método que representan eventos
//       // debe comenzar con on[NombreDelEvento] y la que maneja un evento handle[NombreDelEvento]
//               onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
// Componente tipo función, forma más simple de escribir componentes que solo poseen
// un método render, cambia la sintaxis de onClick={() => this.props.onClick()} a
//  onClick={props.onClick}
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
  );
}
 // componente board
class Board extends React.Component {

  // retorna un componente llamado Square al que le entregan datos, estos datos entregados
  //  se denominan props, el primer valor será el nombre que recibirán dentro del Componente
  // El segundo corresponde a una variable, stado u método correspondiente al componente actual
  renderSquare(i) {
    return (
      // Los estados de un componente son privados, se pueden entregar sus valores a componentes hijos
      //  Pero no editarlos desde un componente hijo, es por eso que se entrega una función del padre
      // Al llamar la función esta actualizará el state desde el componente padre.
      <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // Render return es el código que transforma en el contenido del DOM
    //  está escrito en una sintaxis llamada JSX
    // this.renderSquare(0) llama al método renderSquare dentro del componente
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// Componente game
class Game extends React.Component {
  // Todas los componentes de React dónde se declare un constructor, deben contener
  //  el parámetro props y empezar con una llamada a super(props)
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  // En react existe una convención de que hice que un método que representan eventos
  // debe comenzar con on[NombreDelEvento] y la que maneja un evento handle[NombreDelEvento]
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move # ' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
           squares={current.squares}// Aquí le entregamos un state
           onClick={(i) => this.handleClick(i)}// Aquí le entregamos la función handleClick
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
