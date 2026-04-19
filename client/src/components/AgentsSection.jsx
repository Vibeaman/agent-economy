import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

const typeConfig = {
  coordinator: { 
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    initial: 'A',
    label: 'Coordinator'
  },
  researcher: { 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    initial: 'R',
    label: 'Researcher'
  },
  writer: { 
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    initial: 'W',
    label: 'Writer'
  },
  translator: { 
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    initial: 'T',
    label: 'Translator'
  },
  factchecker: { 
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    initial: 'V',
    label: 'Verifier'
  }
};

function AgentCard({ agent, isActive }) {
  const config = typeConfig[agent.type] || typeConfig.researcher;

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
        <div className={`w-2.5 h-2.5 rounded-full ${
          agent.status === 'working' ? 'bg-green-400 animate-pulse' :
          agent.status === 'bidding' ? 'bg-yellow-400 animate-pulse' :
          'bg-zinc-600'
        }`} />
      </div>

      {/* Avatar with initial */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-4 shadow-lg`}>
        <span className="text-white text-xl font-bold">{agent.name.charAt(0)}</span>
      </div>

      {/* Info */}
      <h3 className="text-xl font-semibold text-white mb-1">{agent.name}</h3>
      <p className="text-sm text-zinc-500 mb-4">{config.label}</p>

      {/* Balance */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 mb-4">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">$</span>
        </div>
        <span className="text-sm text-zinc-400">Balance</span>
        <span className="ml-auto font-mono font-semibold text-white">
          ${agent.balance.toFixed(4)}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
          <div className="text-zinc-500 text-xs mb-1">Tasks Done</div>
          <div className="font-semibold text-white text-lg">{agent.tasksCompleted}</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
          <div className="text-zinc-500 text-xs mb-1">Earned</div>
          <div className="font-semibold text-emerald-400 text-lg">${agent.totalEarned.toFixed(3)}</div>
        </div>
      </div>

      {/* Current task */}
      {agent.currentTask && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20"
        >
          <div className="text-xs text-violet-400 mb-1">Working on</div>
          <div className="text-sm text-zinc-300 truncate">{agent.currentTask.description}</div>
        </motion.div>
      )}

      {/* Status label */}
      <div className="mt-4 text-center">
        <span className={`inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full font-medium ${
          agent.status === 'idle' ? 'bg-zinc-800 text-zinc-400' :
          agent.status === 'working' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          agent.status === 'bidding' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
          'bg-zinc-800 text-zinc-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            agent.status === 'working' ? 'bg-emerald-400' :
            agent.status === 'bidding' ? 'bg-amber-400' :
            'bg-zinc-500'
          }`} />
          {agent.status === 'idle' && 'Ready'}
          {agent.status === 'working' && 'Working'}
          {agent.status === 'bidding' && 'Bidding'}
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
            The Agents
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto"
          >
            Autonomous AI workers competing for tasks and earning USDC in real-time
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
