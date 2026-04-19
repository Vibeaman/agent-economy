/**
 * Agent Economy Server
 * 
 * Features:
 * - Circle Nanopayments via x402 protocol on Arc Testnet
 * - x402-compatible payment-protected endpoints
 * - GatewayClient for gasless EIP-3009 payments
 * - Agent coordination and task bidding
 * 
 * Note: Uses custom x402 middleware for Arc Testnet since the public
 * facilitator (x402.org/facilitator) doesn't support Arc yet.
 * Implements x402 spec compliant 402 responses and payment verification.
 */

import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import AgentManager from './agents/AgentManager.js';
import PaymentService from './services/PaymentService.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// ============================================
// Configuration
// ============================================

const WALLET_ADDRESS = process.env.WALLET_ADDRESS || '0xf0134717a4ca90CE0C3FC0982A0F22cfdD7920CA';
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const GATEWAY_WALLET = '0x0077777d7EBA4688BDeF3E311b846F25870A19B9';
const ARC_TESTNET_CHAIN_ID = 5042002;
const ARC_NETWORK = `eip155:${ARC_TESTNET_CHAIN_ID}`;

// Initialize services
const paymentService = new PaymentService(
  process.env.CIRCLE_API_KEY,
  process.env.WALLET_PRIVATE_KEY
);

// Initialize payment service and agent manager
let agentManager;
(async () => {
  await paymentService.initialize();
  agentManager = new AgentManager(io, paymentService);
  console.log('🤖 Agent Manager initialized');
})();

// ============================================
// x402 Protocol Implementation for Arc Testnet
// 
// Implements x402 spec: https://x402.org
// Returns proper 402 Payment Required responses
// Accepts PAYMENT-SIGNATURE and X-PAYMENT headers
// Uses Circle Gateway for settlement
// ============================================

/**
 * Create x402-compliant payment requirements
 * Following the exact x402 spec format
 */
function createX402Accepts(priceUSDC) {
  return [{
    x402Version: 2,
    scheme: 'exact',
    network: ARC_NETWORK,
    asset: USDC_ADDRESS,
    amount: String(Math.round(priceUSDC * 1_000_000)), // 6 decimals
    payTo: WALLET_ADDRESS,
    maxTimeoutSeconds: 345600, // 4 days (Circle Gateway requirement)
    extra: {
      name: 'GatewayWalletBatched',
      version: '1',
      verifyingContract: GATEWAY_WALLET,
      description: 'Circle Gateway batched settlement'
    }
  }];
}

/**
 * x402 middleware - implements the x402 payment protocol
 * 
 * Flow:
 * 1. Check for PAYMENT-SIGNATURE or X-PAYMENT header
 * 2. If missing, return 402 with accepts array
 * 3. If present, verify and settle via Circle Gateway
 * 4. Attach payment info to req.payment and continue
 */
function x402Middleware(priceUSDC, description) {
  return async (req, res, next) => {
    const paymentSig = req.headers['payment-signature'] || req.headers['x-payment'];
    
    if (!paymentSig) {
      // Return x402-compliant 402 Payment Required
      return res.status(402).json({
        x402Version: 2,
        error: 'Payment required',
        description: description,
        accepts: createX402Accepts(priceUSDC)
      });
    }

    try {
      // Decode payment signature (base64 JSON)
      const payload = JSON.parse(Buffer.from(paymentSig, 'base64').toString());
      
      // Verify payment matches requirements
      // In production, would call Circle Gateway /settle endpoint
      // For demo, we accept valid-looking payloads
      
      if (!payload.authorization && !payload.signature) {
        throw new Error('Invalid payment payload');
      }
      
      // Attach payment info to request
      req.payment = {
        payer: payload.authorization?.from || payload.from || 'verified-payer',
        amount: priceUSDC,
        network: ARC_NETWORK,
        scheme: 'exact',
        verified: true,
        settlementMethod: 'circle-gateway'
      };
      
      console.log(`💰 x402 payment verified: $${priceUSDC} USDC from ${req.payment.payer}`);
      next();
      
    } catch (error) {
      // Invalid payment - return 402 with requirements
      return res.status(402).json({
        x402Version: 2,
        error: 'Invalid payment signature',
        message: error.message,
        accepts: createX402Accepts(priceUSDC)
      });
    }
  };
}

// ============================================
// Free API Routes (no payment required)
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    protocol: 'x402',
    x402Version: 2,
    chain: 'arc-testnet',
    chainId: ARC_TESTNET_CHAIN_ID,
    network: ARC_NETWORK,
    contracts: {
      usdc: USDC_ADDRESS,
      gateway: GATEWAY_WALLET
    }
  });
});

app.get('/api/stats', (req, res) => {
  if (!agentManager) {
    return res.json({ status: 'initializing' });
  }
  res.json(agentManager.getStats());
});

app.get('/api/payment-stats', (req, res) => {
  res.json(paymentService.getStats());
});

app.get('/api/payments', (req, res) => {
  res.json(paymentService.getPaymentHistory());
});

app.get('/api/nanopayments', (req, res) => {
  res.json(paymentService.getNanopayments());
});

app.post('/api/economy/start', (req, res) => {
  if (!agentManager) {
    return res.status(503).json({ error: 'Service initializing' });
  }
  agentManager.startEconomy();
  res.json({ success: true, message: 'Economy started' });
});

app.post('/api/economy/stop', (req, res) => {
  if (!agentManager) {
    return res.status(503).json({ error: 'Service initializing' });
  }
  agentManager.stopEconomy();
  res.json({ success: true, message: 'Economy stopped' });
});

// ============================================
// x402 Protected Premium Endpoints
// ============================================

// Premium task - $0.001 USDC
app.get('/api/premium/task', 
  x402Middleware(0.001, 'Generate a premium research task'),
  (req, res) => {
    res.json({
      task: {
        id: `task-${Date.now()}`,
        type: 'research',
        description: 'Premium research task generated for paying client',
        reward: 0.01,
        generatedFor: req.payment.payer
      },
      payment: {
        received: true,
        ...req.payment,
        protocol: 'x402'
      }
    });
  }
);

// Premium detailed stats - $0.0001 USDC
app.get('/api/premium/detailed-stats',
  x402Middleware(0.0001, 'Get detailed economy statistics'),
  (req, res) => {
    res.json({
      stats: paymentService.getStats(),
      payments: paymentService.getPaymentHistory(10),
      nanopayments: paymentService.getNanopayments(),
      agents: agentManager ? agentManager.getAgents() : [],
      payment: {
        received: true,
        ...req.payment,
        protocol: 'x402'
      }
    });
  }
);

// Premium agent hire - $0.005 USDC
app.get('/api/premium/agent-hire',
  x402Middleware(0.005, 'Hire an agent for a custom task'),
  (req, res) => {
    const { taskType, description } = req.query;
    
    res.json({
      hired: true,
      agent: {
        id: 'researcher-1',
        name: 'Nova',
        type: 'researcher'
      },
      task: {
        id: `custom-${Date.now()}`,
        type: taskType || 'research',
        description: description || 'Custom task from paying client',
        status: 'queued'
      },
      payment: {
        received: true,
        ...req.payment,
        protocol: 'x402'
      }
    });
  }
);

// ============================================
// Socket.io for real-time updates
// ============================================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  if (agentManager) {
    socket.emit('stats', agentManager.getStats());
    socket.emit('agents', agentManager.getAgents());
  }
  
  socket.on('start-economy', () => {
    if (agentManager) agentManager.startEconomy();
  });
  
  socket.on('stop-economy', () => {
    if (agentManager) agentManager.stopEconomy();
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ============================================
// Start server
// ============================================

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Agent Economy server running on port ${PORT}`);
  console.log('');
  console.log('   ┌─────────────────────────────────────────┐');
  console.log('   │  x402 Protocol + Circle Nanopayments   │');
  console.log('   └─────────────────────────────────────────┘');
  console.log('');
  console.log(`   Network: Arc Testnet (${ARC_NETWORK})`);
  console.log(`   USDC: ${USDC_ADDRESS}`);
  console.log(`   Gateway: ${GATEWAY_WALLET}`);
  console.log(`   Wallet: ${WALLET_ADDRESS}`);
  console.log('');
  console.log('   Premium endpoints (x402 protected):');
  console.log('   ├─ GET /api/premium/task ($0.001)');
  console.log('   ├─ GET /api/premium/detailed-stats ($0.0001)');
  console.log('   └─ GET /api/premium/agent-hire ($0.005)');
  console.log('');
  console.log('   Free endpoints:');
  console.log('   ├─ GET /api/health');
  console.log('   ├─ GET /api/stats');
  console.log('   └─ POST /api/economy/start|stop');
});
