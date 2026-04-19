import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Languages, CheckCircle, Target, Wallet } from 'lucide-react';

const typeConfig = {
  coordinator: { 
    icon: Target, 
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    emoji: '🎯'
  },
  researcher: { 
    icon: Search, 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    emoji: '🔍'
  },
  writer: { 
    icon: PenTool, 
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    emoji: '✍️'
  },
  translator: { 
    icon: Languages, 
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    emoji: '🌐'
  },
  factchecker: { 
    icon: CheckCircle, 
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    emoji: '✅'
  }
};

function AgentCard({ agent, isActive }) {
  const config = typeConfig[agent.type] || typeConfig.researcher;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`relative p-6 rounded-2xl border transition-all ${
        isActive 
          ? `${config.bgColor} ${config.borderColor} glow-purple` 
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <div className={`status-dot ${
          agent.status === 'working' ? 'status-working' :
          agent.status === 'bidding' ? 'status-bidding' :
          'status-idle'
        }`} />
      </div>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-4`}>
        <Icon size={24} className="text-white" />
      </div>

      {/* Info */}
      <h3 className="text-xl font-semibold text-white mb-1">{agent.name}</h3>
      <p className="text-sm text-zinc-500 capitalize mb-4">{agent.type}</p>

      {/* Balance */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 mb-4">
        <Wallet size={16} className="text-zinc-500" />
        <span className="text-sm text-zinc-400">Balance</span>
        <span className="ml-auto font-mono font-semibold text-purple-400">
          ${agent.balance.toFixed(4)}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-2 rounded-lg bg-zinc-800/30">
          <div className="text-zinc-500 text-xs mb-1">Tasks</div>
          <div className="font-semibold text-white">{agent.tasksCompleted}</div>
        </div>
        <div className="p-2 rounded-lg bg-zinc-800/30">
          <div className="text-zinc-500 text-xs mb-1">Earned</div>
          <div className="font-semibold text-green-400">${agent.totalEarned.toFixed(4)}</div>
        </div>
      </div>

      {/* Current task */}
      {agent.currentTask && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
        >
          <div className="text-xs text-purple-400 mb-1">Working on</div>
          <div className="text-sm text-zinc-300 truncate">{agent.currentTask.description}</div>
        </motion.div>
      )}

      {/* Status label */}
      <div className="mt-4 text-center">
        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${
          agent.status === 'idle' ? 'bg-zinc-800 text-zinc-400' :
          agent.status === 'working' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          agent.status === 'bidding' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
          'bg-zinc-800 text-zinc-400'
        }`}>
          {agent.status === 'idle' && '💤 Idle'}
          {agent.status === 'working' && '⚡ Working'}
          {agent.status === 'bidding' && '🏷️ Bidding'}
        </span>
      </div>
    </motion.div>
  );
}

function AgentsSection({ agents, currentNegotiation }) {
  const activeAgentIds = currentNegotiation?.bids?.map(b => b.agentId) || [];

  return (
    <section id="agents" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Meet the Agents
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto"
          >
            Specialized AI agents that compete for tasks, negotiate prices, and get paid instantly via Circle Nanopayments
          </motion.p>
        </div>

        {/* Agents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <AgentCard 
              key={agent.id} 
              agent={agent}
              isActive={activeAgentIds.includes(agent.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AgentsSection;
