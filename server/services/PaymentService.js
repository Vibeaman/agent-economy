/**
 * Payment Service
 * Handles Circle Nanopayments integration via x402 protocol
 * 
 * Circle Nanopayments flow:
 * 1. Agents have Gateway Wallets with deposited USDC
 * 2. Payments are gasless EIP-3009 signed authorizations
 * 3. Sub-cent transactions possible without gas fees
 */

const axios = require('axios');

class PaymentService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.isTestnet = apiKey.startsWith('TEST_');
    
    // Circle Gateway endpoints
    this.gatewayUrl = this.isTestnet 
      ? 'https://gateway-testnet.circle.com'
      : 'https://gateway.circle.com';
    
    // For demo, track payments locally
    // In production with full SDK, these would be actual onchain transactions
    this.payments = [];
    this.wallets = new Map();
    
    // Initialize agent wallets with test balances
    this.initializeWallets();
  }

  /**
   * Initialize simulated Gateway Wallets for agents
   * In production, these would be real Circle Gateway Wallets
   */
  initializeWallets() {
    const agents = [
      { id: 'coordinator-1', balance: 1.0 },
      { id: 'researcher-1', balance: 0 },
      { id: 'researcher-2', balance: 0 },
      { id: 'writer-1', balance: 0 },
      { id: 'translator-1', balance: 0 },
      { id: 'factchecker-1', balance: 0 }
    ];

    agents.forEach(agent => {
      this.wallets.set(agent.id, {
        id: agent.id,
        address: `0x${agent.id.replace(/-/g, '')}...`,
        balance: agent.balance,
        deposited: agent.balance,
        withdrawn: 0
      });
    });
  }

  /**
   * Create a nanopayment between two agents
   * Using x402 protocol for sub-cent gasless payments
   * 
   * @param {string} fromAgentId - Paying agent
   * @param {string} toAgentId - Receiving agent
   * @param {number} amount - Amount in USDC (can be sub-cent like 0.001)
   * @param {object} metadata - Task info
   */
  async createNanopayment(fromAgentId, toAgentId, amount, metadata = {}) {
    try {
      const fromWallet = this.wallets.get(fromAgentId);
      const toWallet = this.wallets.get(toAgentId);

      if (!fromWallet || !toWallet) {
        throw new Error('Wallet not found');
      }

      if (fromWallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // In production with Circle SDK:
      // 1. Sign EIP-3009 authorization offchain (gasless)
      // 2. Submit to Gateway for batched settlement
      // 3. Funds transfer instantly in Gateway layer
      // 4. Periodic onchain settlement to Arc

      // Simulate the payment
      fromWallet.balance -= amount;
      toWallet.balance += amount;

      const payment = {
        id: `nano-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'nanopayment',
        protocol: 'x402',
        from: {
          agentId: fromAgentId,
          wallet: fromWallet.address
        },
        to: {
          agentId: toAgentId,
          wallet: toWallet.address
        },
        amount: amount,
        currency: 'USDC',
        chain: 'arc-testnet',
        // Nanopayment specific fields
        gasless: true,
        settlementType: 'batched',
        authorizationType: 'EIP-3009',
        status: 'completed',
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          hackathon: 'arc-agentic-economy-2026'
        }
      };

      this.payments.push(payment);

      console.log(`💸 Nanopayment: ${fromAgentId} → ${toAgentId}: $${amount.toFixed(6)} USDC (gasless)`);

      return {
        success: true,
        payment,
        newBalances: {
          from: fromWallet.balance,
          to: toWallet.balance
        }
      };
    } catch (error) {
      console.error('Nanopayment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Deposit USDC to agent's Gateway Wallet
   */
  async deposit(agentId, amount) {
    const wallet = this.wallets.get(agentId);
    if (!wallet) throw new Error('Wallet not found');

    wallet.balance += amount;
    wallet.deposited += amount;

    return {
      success: true,
      newBalance: wallet.balance
    };
  }

  /**
   * Get agent's Gateway Wallet balance
   */
  getBalance(agentId) {
    const wallet = this.wallets.get(agentId);
    return wallet ? wallet.balance : 0;
  }

  /**
   * Get all wallet balances
   */
  getAllBalances() {
    const balances = {};
    this.wallets.forEach((wallet, id) => {
      balances[id] = wallet.balance;
    });
    return balances;
  }

  /**
   * Get payment history
   */
  getPaymentHistory(limit = 50) {
    return this.payments.slice(-limit);
  }

  /**
   * Get total volume processed
   */
  getTotalVolume() {
    return this.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  /**
   * Get transaction count
   */
  getTransactionCount() {
    return this.payments.length;
  }

  /**
   * Get stats for display
   */
  getStats() {
    return {
      totalTransactions: this.payments.length,
      totalVolume: this.getTotalVolume(),
      averagePayment: this.payments.length > 0 
        ? this.getTotalVolume() / this.payments.length 
        : 0,
      walletsActive: this.wallets.size,
      protocol: 'Circle Nanopayments (x402)',
      chain: 'Arc Testnet',
      gasless: true
    };
  }
}

module.exports = PaymentService;
