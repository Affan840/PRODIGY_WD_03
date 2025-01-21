import { motion } from 'framer-motion';

const GameMode = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">Select Game Mode</h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-64 py-4 px-8 bg-purple-500 text-white rounded-xl text-xl font-bold shadow-lg
          hover:bg-purple-600 transition-colors duration-300"
        onClick={() => onSelectMode('pvp')}
      >
        Player vs Player
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-64 py-4 px-8 bg-blue-500 text-white rounded-xl text-xl font-bold shadow-lg
          hover:bg-blue-600 transition-colors duration-300"
        onClick={() => onSelectMode('cpu')}
      >
        Player vs Computer
      </motion.button>
    </div>
  );
};

export default GameMode;