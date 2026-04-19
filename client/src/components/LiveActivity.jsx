import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Gavel, Clock, TrendingDown, CheckCircle2, Zap } from 'lucide-react';

function TransactionItem({ tx, index }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
        <Zap size={18} className="text-purple-400" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-blue-400">{tx.fromName}</span>
          <ArrowRight size={14} className="text-zinc-600" />
          <span className="font-medium text-green-400">{tx.toName}</span>
        </div>
        <div className="text-xs text-zinc-500 capitalize">{tx.taskType}</div>
      </div>

      {/* Amount & Time */}
      <div className="text-right flex-shrink-0">
        <div className="font-mono font-semibold text-purple-400">
          ${tx.amount.toFixed(4)}
        </div>
        <div className="text-xs text-zinc-500">{formatTime(tx.timestamp)}</div>
      </div>
    </motion.div>
  );
}

function NegotiationCard({ negotiation }) {
  if (!negotiation) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
          <Gavel size={24} className="text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-2">No Active Negotiation</h3>
        <p className="text-sm text-zinc-600">Start the economy to see agents bidding in real-time</p>
      </div>
    );
  }

  const { task, bids, winner } = negotiation;
  const sortedBids = [...bids].sort((a, b) => a.price - b.price);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-purple-500/30 glow-purple"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gavel size={18} className="text-yellow-400" />
          <h3 className="font-semibold text-white">Live Bidding</h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Task */}
      <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 mb-4">
        <div className="text-xs text-zinc-500 mb-1">Task</div>
        <div className="text-sm font-medium text-white mb-2">{task.description}</div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-zinc-500">
            Type: <span className="text-zinc-300 capitalize">{task.type}</span>
          </span>
          <span className="text-zinc-500">
            Budget: <span className="text-purple-400">${task.baseBudget?.toFixed(4)}</span>
          </span>
        </div>
      </div>

      {/* Bids */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
          <TrendingDown size={12} />
          <span>Bids (lowest wins)</span>
        </div>
        
        <div className="space-y-2">
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
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    isWinner 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : isLowest
                      ? 'bg-purple-500/10 border border-purple-500/20'
                      : 'bg-zinc-800/50 border border-zinc-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isWinner && <CheckCircle2 size={16} className="text-green-400" />}
                    <span className={`font-medium ${isWinner ? 'text-green-400' : 'text-white'}`}>
                      {bid.agentName}
                    </span>
                  </div>
                  <span className={`font-mono ${
                    isWinner ? 'text-green-400' : isLowest ? 'text-purple-400' : 'text-zinc-400'
                  }`}>
                    ${bid.price.toFixed(4)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {bids.length === 0 && (
            <div className="text-center py-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-3xl mb-2"
              >
                🏷️
              </motion.div>
              <p className="text-sm text-zinc-500">Waiting for bids...</p>
            </div>
          )}
        </div>
      </div>

      {/* Winner */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <span className="text-green-400 font-semibold">
            🎉 {winner.agentName} wins at ${winner.price.toFixed(4)} USDC!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

function LiveActivity({ transactions, negotiation }) {
  const recentTx = [...transactions].reverse().slice(0, 10);

  return (
    <section id="activity" className="py-20 px-6 bg-zinc-900/20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Live Activity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto"
          >
            Watch real-time negotiations and nanopayment transactions as they happen
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Negotiation */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Gavel size={18} className="text-yellow-400" />
              Current Negotiation
            </h3>
            <NegotiationCard negotiation={negotiation} />
          </div>

          {/* Transactions */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Clock size={18} className="text-purple-400" />
              Recent Transactions
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {recentTx.length === 0 ? (
                <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                  <p className="text-zinc-500">No transactions yet. Start the economy!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {recentTx.map((tx, index) => (
                    <TransactionItem key={tx.id} tx={tx} index={index} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveActivity;
