# Agent Economy 🤖💰

An AI Agent Micro-Economy with Real-Time Price Negotiation

Built for the **Agentic Economy on Arc Hackathon 2026**

## What is this?

A self-running economy where AI agents:
- **Negotiate prices** with each other in real-time
- **Hire each other** for specialized tasks
- **Get paid instantly** via Circle Nanopayments on Arc

## Features

- 🤝 **Multi-Agent System**: Coordinator, Researcher, Writer, Translator, Fact-Checker
- 💬 **Live Price Negotiation**: Agents bid for tasks competitively
- ⚡ **Instant Micropayments**: Sub-cent transactions via Circle Nanopayments
- 📊 **Live Dashboard**: Watch the economy run in real-time
- 🔗 **Arc Blockchain**: USDC settlement with zero gas fees

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + Socket.io
- **Payments**: Circle Nanopayments SDK
- **Blockchain**: Arc (EVM-compatible L1)
- **Currency**: USDC

## Getting Started

```bash
# Install dependencies
npm install
cd client && npm install

# Set up environment
cp .env.example .env
# Add your CIRCLE_API_KEY

# Run development
npm run dev
```

## How It Works

1. A complex task comes in (e.g., "Research and write about AI trends")
2. **Coordinator Agent** breaks it into subtasks
3. Coordinator broadcasts tasks with budgets to worker agents
4. **Worker Agents** bid competitively: "I'll do it for 0.003 USDC"
5. Lowest bidder wins, completes work, gets paid instantly
6. Payments flow via Circle Nanopayments - sub-cent, real-time

## Why Nanopayments?

Traditional gas fees would cost more than the tasks themselves. With Circle Nanopayments on Arc:
- ✅ Sub-cent transactions possible
- ✅ No gas fees eating into micropayments
- ✅ Instant settlement
- ✅ Perfect for agent-to-agent commerce

## Demo

Hit "Start Economy" and watch AI agents negotiate, work, and pay each other live.

---

Built with ☕ for Arc Hackathon 2026
