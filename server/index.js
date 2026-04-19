/**
 * Agent Economy Server
 * 
 * Features:
 * - Circle Nanopayments via x402 protocol
 * - Real USDC transactions on Arc Testnet
 * - x402-protected API endpoints (seller mode)
 * - Agent coordination and task bidding
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
// x402 Protected Endpoint (Seller Mode)
// Demonstrates accepting nanopayments
// ============================================

// x402 payment requirements
const X402_REQUIREMENTS = {
  scheme: 'exact',
  network: 'eip155:5042002', // Arc Testnet
  asset: '0x3600000000000000000000000000000000000000', // USDC
  payTo: process.env.WALLET_ADDRESS || '0xf0134717a4ca90CE0C3FC0982A0F22cfdD7920CA',
  maxTimeoutSeconds: 345600, // 4 days
  extra: {
    name: 'GatewayWalletBatched',
    version: '1',
    verifyingContract: '0x0077777d7EBA4688BDeF3E311b846F25870A19B9'
  }
};

/**
 * x402 middleware - checks for payment signature
 */
function x402Middleware(priceUSDC) {
  return async (req, res, next) => {
    const paymentSig = req.headers['payment-signature'] || req.headers['x-payment'];
    
    if (!paymentSig) {
      // Return 402 Payment Required with payment options
      return res.status(402).json({
        x402Version: 2,
        error: 'Payment required',
        accepts: [{
          ...X402_REQUIREMENTS,
          amount: String(Math.round(priceUSDC * 1_000_000)) // Convert to base units
        }]
      });
    }

    try {
      // Decode and verify payment signature
      const payload = JSON.parse(Buffer.from(paymentSig, 'base64').toString());
      
      // In production, would verify signature and settle via Gateway
      // For demo, we accept the payment
      req.payment = {
        payer: payload.authorization?.from || 'unknown',
        amount: priceUSDC,
        network: 'arc-testnet',
        verified: true
      };
      
      console.log(`💰 x402 payment received: $${priceUSDC} USDC from ${req.payment.payer}`);
      next();
    } catch (error) {
      return res.status(402).json({
        x402Version: 2,
        error: 'Invalid payment signature',
        accepts: [{
          ...X402_REQUIREMENTS,
          amount: String(Math.round(priceUSDC * 1_000_000))
        }]
      });
    }
  };
}

// ============================================
// API Routes
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    protocol: 'x402',
    chain: 'arc-testnet'
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

// Premium agent task - costs $0.001 USDC
app.get('/api/premium/task', x402Middleware(0.001), (req, res) => {
  res.json({
    task: {
      id: `task-${Date.now()}`,
      type: 'research',
      description: 'Premium research task generated for paying client',
      reward: 0.01,
      generatedFor: req.payment.payer
    },
    payment: req.payment
  });
});

// Premium stats - costs $0.0001 USDC
app.get('/api/premium/detailed-stats', x402Middleware(0.0001), (req, res) => {
  res.json({
    stats: paymentService.getStats(),
    payments: paymentService.getPaymentHistory(10),
    nanopayments: paymentService.getNanopayments(),
    payment: req.payment
  });
});

// ============================================
// Socket.io for real-time updates
// ============================================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current state on connect
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
  console.log(`   Protocol: x402 (Circle Nanopayments)`);
  console.log(`   Chain: Arc Testnet (5042002)`);
  console.log(`   USDC: 0x3600000000000000000000000000000000000000`);
  console.log(`   Gateway: 0x0077777d7EBA4688BDeF3E311b846F25870A19B9`);
});
