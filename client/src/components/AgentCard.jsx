import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Wallet, CheckCircle, TrendingUp } from 'lucide-react';

const typeColors = {
  coordinator: 'from-purple-500 to-indigo-600',
  researcher: 'from-blue-500 to-cyan-500',
  writer: 'from-green-500 to-emerald-500',
  translator: 'from-yellow-500 to-orange-500',
  factchecker: 'from-red-500 to-pink-500'
};

const typeIcons = {
  coordinator: '🎯',
  researcher: '🔍',
  writer: '✍️',
  translator: '🌐',
  factchecker: '✅'
};

function AgentCard({ agent }) {
  const gradientClass = typeColors[agent.type] || 'from-gray-500 to-gray-600';
  const icon = typeIcons[agent.type] || '🤖';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="gradient-border p-4 rounded-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-xs text-gray-400 capitalize">{agent.type}</p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className={`status-${agent.status} w-3 h-3 rounded-full`} />
      </div>

      {/* Balance */}
      <div className="bg-black/30 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm flex items-center gap-1">
            <Wallet size={14} /> Balance
          </span>
          <span className="font-mono font-semibold text-usdc-blue">
            ${agent.balance.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-black/20 rounded p-2">
          <div className="text-gray-400 text-xs flex items-center gap-1">
            <CheckCircle size={12} /> Tasks
          </div>
          <div className="font-semibold">{agent.tasksCompleted}</div>
        </div>
        <div className="bg-black/20 rounded p-2">
          <div className="text-gray-400 text-xs flex items-center gap-1">
            <TrendingUp size={12} /> Earned
          </div>
          <div className="font-semibold text-green-400">
            ${agent.totalEarned.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Current task */}
      {agent.currentTask && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-2 bg-arc-purple/20 rounded-lg text-xs"
        >
          <span className="text-arc-purple">Working:</span>{' '}
          <span className="text-gray-300">{agent.currentTask.description}</span>
        </motion.div>
      )}

      {/* Status text */}
      <div className="mt-3 text-center">
        <span className={`text-xs px-2 py-1 rounded-full ${
          agent.status === 'idle' ? 'bg-gray-600/50 text-gray-300' :
          agent.status === 'working' ? 'bg-green-500/20 text-green-400' :
          agent.status === 'bidding' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-600/50 text-gray-300'
        }`}>
          {agent.status === 'idle' && '💤 Idle'}
          {agent.status === 'working' && '⚡ Working'}
          {agent.status === 'bidding' && '🏷️ Bidding'}
        </span>
      </div>
    </motion.div>
  );
}

export default AgentCard;
