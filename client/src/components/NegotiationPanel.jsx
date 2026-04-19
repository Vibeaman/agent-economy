import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, TrendingDown, CheckCircle2 } from 'lucide-react';

function NegotiationPanel({ negotiation }) {
  if (!negotiation) {
    return (
      <div className="bg-black/30 rounded-xl p-4 border border-white/5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Gavel size={18} className="text-yellow-400" />
          Live Negotiation
        </h3>
        <p className="text-gray-500 text-sm text-center py-8">
          Waiting for next task...
        </p>
      </div>
    );
  }

  const { task, bids, winner } = negotiation;
  const sortedBids = [...bids].sort((a, b) => a.price - b.price);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/30 rounded-xl p-4 border border-yellow-500/30 glow-purple"
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Gavel size={18} className="text-yellow-400" />
        Live Negotiation
        <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full animate-pulse">
          LIVE
        </span>
      </h3>

      {/* Task info */}
      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <div className="text-xs text-gray-400 mb-1">Task</div>
        <div className="text-sm font-medium">{task.description}</div>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="text-gray-400">
            Type: <span className="text-white capitalize">{task.type}</span>
          </span>
          <span className="text-gray-400">
            Budget: <span className="text-usdc-blue">${task.baseBudget?.toFixed(4)}</span>
          </span>
        </div>
      </div>

      {/* Bids */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <TrendingDown size={12} />
          Bids (lowest wins)
        </div>
        
        <AnimatePresence>
          {sortedBids.map((bid, index) => {
            const isWinner = winner && winner.agentId === bid.agentId;
            const isLowest = index === 0;
            
            return (
              <motion.div
                key={bid.agentId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isWinner 
                    ? 'bg-green-500/20 border border-green-500/50' 
                    : isLowest
                    ? 'bg-arc-purple/20 border border-arc-purple/30'
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isWinner && <CheckCircle2 size={16} className="text-green-400" />}
                  <span className={`font-medium ${isWinner ? 'text-green-400' : ''}`}>
                    {bid.agentName}
                  </span>
                </div>
                <span className={`font-mono ${
                  isWinner ? 'text-green-400' : isLowest ? 'text-arc-purple' : 'text-gray-400'
                }`}>
                  ${bid.price.toFixed(4)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {bids.length === 0 && (
          <div className="text-center py-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-2xl"
            >
              🏷️
            </motion.div>
            <p className="text-sm text-gray-400 mt-2">Waiting for bids...</p>
          </div>
        )}
      </div>

      {/* Winner announcement */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-500/20 rounded-lg text-center"
        >
          <span className="text-green-400 font-semibold">
            🎉 {winner.agentName} wins at ${winner.price.toFixed(4)} USDC!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default NegotiationPanel;
