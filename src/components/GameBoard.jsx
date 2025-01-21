import { motion } from 'framer-motion';
import useSound from 'use-sound';

const GameBoard = ({ board, onCellClick, isSoundEnabled }) => {
  const [playMove] = useSound('/sounds/move.mp3', { 
    volume: 2,
    soundEnabled: isSoundEnabled
  });

  const handleClick = (index) => {
    playMove();
    onCellClick(index);
  };

  const getCellContent = (value) => {
    if (value === 'X') {
      return '❌';
    } else if (value === 'O') {
      return '⭕';
    }
    return null;
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
      {board.map((cell, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: cell ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`h-24 rounded-xl text-4xl font-bold flex items-center justify-center
            ${!cell && 'hover:bg-purple-100'} 
            bg-white shadow-lg transition-colors duration-300
            ${cell ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !cell && handleClick(index)}
          disabled={cell}
        >
          {cell && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl"
            >
              {getCellContent(cell)}
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default GameBoard;