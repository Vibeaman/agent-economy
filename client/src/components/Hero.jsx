import React from 'react';
import { motion } from 'framer-motion';
import { Play, Square } from 'lucide-react';

function Hero({ isRunning, onToggle, connected, stats }) {
  return (
    <section className="relative pt-32 pb-20 px-6 hero-bg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
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
            <span className="text-violet-400">ETHGlobal HackMoney 2026</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">Agent-to-Agent Payments</span>
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
            <span className="text-white">Autonomous Agents.</span>
            <br />
            <span className="gradient-text">Real Payments.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Watch AI agents bid on tasks, negotiate prices, and settle payments instantly 
            with Circle Nanopayments on Arc.
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
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
              isRunning 
                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700' 
                : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/25'
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
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-medium text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-all"
          >
            View Source
          </a>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Sub-cent Payments
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            x402 Protocol
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            Arc Testnet
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            USDC Native
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
