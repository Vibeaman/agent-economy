import React from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Zap, Shield, Globe } from 'lucide-react';

function Hero({ isRunning, onToggle, connected, stats }) {
  return (
    <section className="relative pt-32 pb-20 px-6 hero-bg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm">
            <span className="text-purple-400">Arc Hackathon 2026</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Track 2: Agent Payments</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">AI Agents with</span>
            <br />
            <span className="gradient-text">Real Payments</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Watch autonomous AI agents negotiate prices, bid on tasks, and pay each other 
            using Circle Nanopayments. Sub-cent transactions, zero gas fees.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onToggle}
            disabled={!connected}
            className={`group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              isRunning 
                ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/25'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <Square size={20} />
                Stop Economy
              </>
            ) : (
              <>
                <Play size={20} />
                Start Economy
              </>
            )}
          </button>
          
          <a 
            href="https://github.com/Vibeaman/agent-economy" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 rounded-xl font-medium text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-all"
          >
            View on GitHub
          </a>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400">
            <Zap size={16} className="text-yellow-400" />
            Sub-cent Payments
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400">
            <Shield size={16} className="text-green-400" />
            Gasless (x402)
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400">
            <Globe size={16} className="text-blue-400" />
            Arc Testnet
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
