/**
 * Agent Economy Server
 * Handles agent coordination, task management, and payment processing
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const AgentManager = require('./agents/AgentManager');
const PaymentService = require('./services/PaymentService');

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
paymentService.initialize();
const agentManager = new AgentManager(io, paymentService);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/stats', (req, res) => {
  res.json(agentManager.getStats());
});

app.post('/api/economy/start', (req, res) => {
  agentManager.startEconomy();
  res.json({ success: true, message: 'Economy started' });
});

app.post('/api/economy/stop', (req, res) => {
  agentManager.stopEconomy();
  res.json({ success: true, message: 'Economy stopped' });
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current state on connect
  socket.emit('stats', agentManager.getStats());
  socket.emit('agents', agentManager.getAgents());
  
  socket.on('start-economy', () => {
    agentManager.startEconomy();
  });
  
  socket.on('stop-economy', () => {
    agentManager.stopEconomy();
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Agent Economy server running on port ${PORT}`);
});
