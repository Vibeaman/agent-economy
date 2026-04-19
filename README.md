# Agent Economy 🤖💰

**An AI Agent Micro-Economy with Real-Time Price Negotiation**

Built for **ETHGlobal HackMoney 2026** - Arc/Circle Track

🏆 **Track: Agent-to-Agent Payment Loop**

> "Create autonomous agents that pay and receive value in real time, proving machine-to-machine commerce without batching or custodial control."

---

## 🎯 What We Built

A self-running economy where **6 AI agents** autonomously:
- **Negotiate prices** via competitive bidding
- **Hire each other** for specialized tasks
- **Pay instantly** via Circle Nanopayments on Arc
- **Operate 24/7** without human intervention

This is **machine-to-machine commerce** - agents making economic decisions and settling payments in real-time.

---

## 💸 Per-Action Pricing

| Action | Price (USDC) |
|--------|-------------|
| Research task | $0.005 - $0.006 |
| Writing task | $0.003 - $0.004 |
| Translation task | $0.005 - $0.007 |
| Fact-checking task | $0.003 - $0.004 |

**All transactions are ≤ $0.01** as required by the hackathon.

---

## 📊 Why This Model FAILS With Traditional Gas Costs

This is the economic proof that Nanopayments are necessary:

### The Math

| Scenario | Payment | Gas Cost | Overhead | Viable? |
|----------|---------|----------|----------|---------|
| **Ethereum Mainnet** | $0.005 | ~$2.00 | 40,000% | ❌ NO |
| **Polygon** | $0.005 | ~$0.01 | 200% | ❌ NO |
| **Optimism** | $0.005 | ~$0.05 | 1,000% | ❌ NO |
| **Arc + Nanopayments** | $0.005 | $0.00 | 0% | ✅ YES |

### Why Traditional Chains Fail

1. **$0.005 payment on Ethereum**
   - Gas: ~$2.00 for a token transfer
   - You'd pay **400x the payment amount** in fees
   - Agent economy is impossible

2. **$0.005 payment on L2s**
   - Gas: $0.01 - $0.05
   - Still **2-10x the payment** in overhead
   - Margins destroyed, economy collapses

3. **$0.005 payment on Arc with Nanopayments**
   - Gas: $0.00 (gasless via EIP-3009)
   - Circle Gateway batches settlements
   - **100% of payment goes to the worker**
   - Micro-economy becomes viable

### The Killer Insight

Agent-to-agent commerce requires **high frequency, low value** transactions. If gas costs exceed the transaction value, the entire economic model breaks.

Circle Nanopayments solve this by:
- **EIP-3009 signed authorizations** (no gas to sign)
- **Gateway batched settlement** (amortized costs)
- **Arc's USDC-native chain** (optimized for stablecoin transfers)

**This agent economy is only possible because of Nanopayments.**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    React + Vite + Tailwind                      │
│         Live dashboard showing agents, bids, payments           │
└─────────────────────────────────────────────────────────────────┘
                              │ Socket.io
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                │
│                   Node.js + Express + Socket.io                 │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Agent     │  │    Task     │  │    Payment Service      │ │
│  │  Manager    │  │  Generator  │  │  (Circle Nanopayments)  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CIRCLE GATEWAY                              │
│            GatewayClient + EIP-3009 Authorizations              │
│                  Gasless batched settlement                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ARC TESTNET                                │
│                     Chain ID: 5042002                           │
│          USDC: 0x3600000000000000000000000000000000             │
│         Gateway: 0x0077777d7EBA4688BDeF3E311b846F25870A19B9     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 The Agents

| Agent | Role | Skills |
|-------|------|--------|
| **Atlas** (Coordinator) | Decomposes tasks, hires workers, manages payments | task-decomposition, delegation |
| **Nova** (Researcher) | Web research, data analysis | web-search, data-analysis |
| **Quantum** (Researcher) | Deep research, citations | deep-dive, citation |
| **Echo** (Writer) | Content creation, editing | content-creation, editing |
| **Babel** (Translator) | Multi-language translation | multi-language, localization |
| **Verify** (Fact-Checker) | Verifies claims, checks sources | fact-verification, source-checking |

---

## 🔄 How It Works

```
1. TASK CREATED
   └─> Coordinator broadcasts: "Research AI trends" ($0.006 budget)

2. BIDDING PHASE
   ├─> Nova bids: $0.0052
   └─> Quantum bids: $0.0048  ← LOWEST

3. WINNER SELECTED
   └─> Quantum wins the task

4. WORK COMPLETED
   └─> Quantum: "Research complete"

5. PAYMENT SETTLED
   └─> Atlas → Quantum: $0.0048 USDC (gasless, instant)

6. REPEAT
   └─> New task every 8 seconds
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Socket.io-client |
| Backend | Node.js, Express, Socket.io |
| Payments | @circle-fin/x402-batching, viem |
| Protocol | x402 (HTTP 402 Payment Required) |
| Blockchain | Arc Testnet (EVM L1) |
| Currency | USDC (native gas token on Arc) |

---

## 📦 Installation

```bash
# Clone
git clone https://github.com/Vibeaman/agent-economy.git
cd agent-economy

# Install dependencies
npm install
cd client && npm install && cd ..

# Configure
cp .env.example .env
# Add WALLET_PRIVATE_KEY and CIRCLE_API_KEY

# Run
npm run dev
```

---

## 🌐 Live Demo

- **Frontend**: [Vercel deployment URL]
- **Backend**: [Railway deployment URL]
- **Explorer**: https://testnet.arcscan.app

---

## 📈 Transaction Data

The demo generates **50+ onchain transactions** showing:
- Real USDC transfers between agents
- Verifiable on Arc Testnet explorer
- Per-action pricing under $0.01
- Gasless execution via Circle Gateway

---

## 🔗 Links

- **GitHub**: https://github.com/Vibeaman/agent-economy
- **Arc Docs**: https://docs.arc.network
- **Circle Nanopayments**: https://developers.circle.com/gateway/nanopayments
- **x402 Protocol**: https://x402.org

---

## 👥 Team

Built by **Timmy** (@miracle390) for ETHGlobal HackMoney 2026

---

## 📝 License

MIT

---

*This agent economy is only possible because of Circle Nanopayments on Arc. Traditional gas costs would make sub-cent machine-to-machine commerce economically impossible.*
