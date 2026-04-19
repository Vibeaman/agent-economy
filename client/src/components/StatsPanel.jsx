import React from 'react';
import { motion } from 'framer-motion';
import { Zap, DollarSign, CheckCircle2, MessageSquare } from 'lucide-react';

function StatsPanel({ stats }) {
  const statItems = [
    {
      label: 'Transactions',
      value: stats.totalTransactions,
      icon: Zap,
      color: 'text-arc-blue',
      bgColor: 'bg-arc-blue/20'
    },
    {
      label: 'Total Volume',
      value: `$${stats.totalVolume.toFixed(4)}`,
      icon: DollarSign,
      color: 'text-usdc-blue',
      bgColor: 'bg-usdc-blue/20'
    },
    {
      label: 'Tasks Done',
      value: stats.tasksCompleted,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      label: 'Active Bids',
      value: stats.activeNegotiations,
      icon: MessageSquare,
      color: 'text-arc-purple',
      bgColor: 'bg-arc-purple/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${item.bgColor} rounded-xl p-4 border border-white/5`}
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon size={18} className={item.color} />
            <span className="text-gray-400 text-sm">{item.label}</span>
          </div>
          <motion.div
            key={item.value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${item.color}`}
          >
            {item.value}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsPanel;
