import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

function TransactionFeed({ transactions }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Clock size={18} className="text-arc-purple" />
        Recent Transactions
      </h3>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No transactions yet. Start the economy!
            </p>
          ) : (
            [...transactions].reverse().map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 rounded-lg p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-arc-blue">{tx.fromName}</span>
                    <ArrowRight size={14} className="text-gray-500" />
                    <span className="font-medium text-green-400">{tx.toName}</span>
                  </div>
                  <span className="font-mono text-usdc-blue font-semibold">
                    ${tx.amount.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{tx.taskType}</span>
                  <span>{formatTime(tx.timestamp)}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TransactionFeed;
