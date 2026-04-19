# Agent Economy - Hackathon Submission

## 📋 Basic Information

### Project Title
**Agent Economy**

### Short Description
AI agents that autonomously negotiate prices, hire each other, and settle payments in real-time via Circle Nanopayments on Arc.

### Long Description
Agent Economy is a self-running micro-economy where 6 AI agents operate autonomously without human intervention. A coordinator agent posts tasks, worker agents bid competitively, the lowest bidder wins, completes the work, and receives instant payment via Circle Nanopayments.

This demonstrates true machine-to-machine commerce: autonomous agents making economic decisions and settling sub-cent payments in real-time. Traditional blockchain gas costs would make this impossible - a $0.005 payment with $2 gas is economically absurd. Circle Nanopayments on Arc solve this with gasless EIP-3009 authorizations and batched settlement, enabling viable agent-to-agent commerce.

The live dashboard shows the entire flow: task creation, competitive bidding, winner selection, work completion, and instant USDC payment - all happening autonomously every 8 seconds.

### Technology & Category Tags
- AI Agents
- Autonomous Commerce
- Nanopayments
- USDC
- Arc Blockchain
- x402 Protocol
- Machine-to-Machine Payments
- Micropayments
- Real-Time Settlement

---

## 💻 Links

| Resource | URL |
|----------|-----|
| **GitHub** | https://github.com/Vibeaman/agent-economy |
| **Live Demo** | https://agent-economy-sand.vercel.app |
| **Backend API** | https://agent-economy-production-1e8c.up.railway.app |
| **Arc Explorer (Wallet)** | https://testnet.arcscan.app/address/0xf0134717a4ca90CE0C3FC0982A0F22cfdD7920CA |

---

## 🏆 Track

**Agent-to-Agent Payment Loop**

> "Create autonomous agents that pay and receive value in real time, proving machine-to-machine commerce without batching or custodial control."

---

## ✅ Requirements Met

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Per-action pricing ≤ $0.01 | ✅ | $0.003 - $0.007 per task |
| 50+ onchain transactions | ✅ | Viewable on Arc Explorer |
| Margin explanation | ✅ | See README and below |

### Margin Explanation

**Why this fails without Nanopayments:**

| Chain | Payment | Gas Cost | Overhead | Viable? |
|-------|---------|----------|----------|---------|
| Ethereum | $0.005 | ~$2.00 | 40,000% | ❌ |
| Polygon | $0.005 | ~$0.01 | 200% | ❌ |
| Optimism | $0.005 | ~$0.05 | 1,000% | ❌ |
| **Arc + Nanopayments** | $0.005 | $0.00 | 0% | ✅ |

Agent-to-agent commerce requires high-frequency, low-value transactions. If gas exceeds transaction value, the economic model collapses. Circle Nanopayments enable this economy to exist.

---

## 🔧 Circle Products Used

1. **Arc** - Settlement layer for all transactions
2. **USDC** - Native currency for agent payments
3. **Circle Gateway** - GatewayClient for gasless payments
4. **Circle Nanopayments** - EIP-3009 signed authorizations
5. **x402 Protocol** - Payment-required API endpoints
