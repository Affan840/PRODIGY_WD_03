import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import Confetti from 'react-confetti';
import GameBoard from './components/GameBoard';
import GameMode from './components/GameMode';
import ScoreBoard from './components/ScoreBoard';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const [playWin] = useSound('/sounds/win.mp3', { 
    volume: 0.05,
    soundEnabled: isSoundEnabled 
  });

  function checkWinner(boardState) {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    if (boardState.every(cell => cell !== null)) return 'draw';
    return null;
  }

  const minimax = (boardState, depth, isMaximizing) => {
    const result = checkWinner(boardState);
    
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < boardState.length; i++) {
        if (!boardState[i]) {
          boardState[i] = 'O';
          const score = minimax(boardState, depth + 1, false);
          boardState[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < boardState.length; i++) {
        if (!boardState[i]) {
          boardState[i] = 'X';
          const score = minimax(boardState, depth + 1, true);
          boardState[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const handleCellClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner && gameWinner !== 'draw') {
      setWinner(gameWinner);
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
      playWin();
    } else if (gameWinner === 'draw') {
      setWinner('draw');
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const computerMove = (() => {
    if (winner || currentPlayer === 'X') return;

    const makeRandomMove = () => {
      const emptyCells = board
        .map((cell, index) => cell === null ? index : null)
        .filter(cell => cell !== null);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    };

    // 30% chance to make a random move instead of the optimal one
    if (Math.random() < 0.1) {
      const randomMove = makeRandomMove();
      setTimeout(() => handleCellClick(randomMove), 500);
      return;
    }

    // Use minimax algorithm to find the best move
    let bestScore = -Infinity;
    let bestMove = null;
    const newBoard = [...board];

    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'O';
        const score = minimax(newBoard, 0, false);
        newBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (bestMove !== null) {
      setTimeout(() => handleCellClick(bestMove), 500);
    }
  });

  useEffect(() => {
    if (gameMode === 'cpu' && currentPlayer === 'O') {
      computerMove();
    }
  }, [currentPlayer, gameMode]);


  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <GameMode onSelectMode={handleModeSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      {winner && winner !== 'draw' && <Confetti />}
      
      <div className="max-w-4xl mx-auto relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="absolute top-0 right-0 p-3 text-2xl bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-300"
          aria-label={isSoundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
          {isSoundEnabled ? '🔊' : '🔇'}
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-8 text-purple-800"
        >
          Tic Tac Toe
        </motion.h1>

        <ScoreBoard scores={scores} gameMode={gameMode} />

        <div className="flex flex-col items-center gap-8">
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-2xl font-bold text-center"
              >
                {winner === 'draw' ? (
                  <span className="text-gray-700">Its a draw!</span>
                ) : (
                  <span className="text-green-600">
                    {winner === 'X' ? 'Player X' : (gameMode === 'pvp' ? 'Player O' : 'Computer')} wins!
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!winner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-purple-600 mb-4"
            >
              Current Turn: {currentPlayer === 'X' ? 'Player X' : (gameMode === 'pvp' ? 'Player O' : 'Computer')}
            </motion.div>
          )}

          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            currentPlayer={currentPlayer}
            gameMode={gameMode}
            isSoundEnabled={isSoundEnabled}
          />

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold shadow-lg
                hover:bg-purple-600 transition-colors duration-300"
              onClick={resetGame}
            >
              New Game
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-bold shadow-lg
                hover:bg-gray-600 transition-colors duration-300"
              onClick={() => handleModeSelect(null)}
            >
              Change Mode
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;