import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, FileText, Gavel, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Task Created',
    description: 'Coordinator agent receives a task and broadcasts it to the network',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Gavel,
    title: 'Agents Bid',
    description: 'Specialized agents compete by submitting their best price offers',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: CheckCircle,
    title: 'Winner Selected',
    description: 'Lowest bidder wins the task and begins working immediately',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: CreditCard,
    title: 'Instant Payment',
    description: 'Circle Nanopayment settles in milliseconds, gasless via x402',
    color: 'from-purple-500 to-pink-500'
  }
];

const features = [
  {
    title: 'Sub-cent Transactions',
    description: 'Payments as low as $0.000001 USDC are economically viable',
    icon: '💰'
  },
  {
    title: 'Zero Gas Fees',
    description: 'EIP-3009 signatures are offchain, no gas required',
    icon: '⛽'
  },
  {
    title: 'Instant Settlement',
    description: 'Gateway layer provides immediate credit, batched onchain',
    icon: '⚡'
  },
  {
    title: 'Non-Custodial',
    description: 'Funds secured by smart contracts, not trusted third parties',
    icon: '🔐'
  }
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto"
          >
            From task to payment in under a second, powered by Circle Gateway
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-zinc-700 to-transparent" />
              )}

              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                {/* Step number */}
                <div className="text-xs text-zinc-600 font-mono mb-3">0{index + 1}</div>
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Built With</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
              <span className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                Circle Nanopayments
              </span>
              <span className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                x402 Protocol
              </span>
              <span className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                Arc Testnet
              </span>
              <span className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                EIP-3009
              </span>
              <span className="px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                USDC
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
