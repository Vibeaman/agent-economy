import React from 'react';
import { motion } from 'framer-motion';

function StatsBar({ stats }) {
  const statItems = [
    {
      value: stats.totalTransactions,
      label: 'Transactions',
      suffix: '',
      color: 'text-blue-400'
    },
    {
      value: stats.totalVolume.toFixed(4),
      label: 'Total Volume',
      suffix: ' USDC',
      color: 'text-purple-400'
    },
    {
      value: stats.tasksCompleted,
      label: 'Tasks Completed',
      suffix: '',
      color: 'text-green-400'
    },
    {
      value: stats.agentCount || 6,
      label: 'Active Agents',
      suffix: '',
      color: 'text-cyan-400'
    }
  ];

  return (
    <section className="py-12 border-y border-zinc-800/50 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div 
                key={item.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={`text-4xl md:text-5xl font-bold ${item.color} mb-2`}
              >
                {item.value}{item.suffix}
              </motion.div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsBar;
