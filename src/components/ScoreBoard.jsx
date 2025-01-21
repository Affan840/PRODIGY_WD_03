import { motion } from 'framer-motion';

const ScoreBoard = ({ scores, gameMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center gap-8 mb-8"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-purple-600">Player X</h3>
        <p className="text-3xl font-bold">{scores.X}</p>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-blue-600">
          {gameMode === 'pvp' ? 'Player O' : 'Computer'}
        </h3>
        <p className="text-3xl font-bold">{scores.O}</p>
      </div>
    </motion.div>
  );
};

export default ScoreBoard;