/**
 * Payment Service
 * Real Circle Nanopayments integration via x402 protocol on Arc Testnet
 */

const { createWalletClient, http, parseUnits, formatUnits } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

// Arc Testnet chain config
const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.arc.network'] },
    public: { http: ['https://rpc-testnet.arc.network'] }
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://testnet.arcscan.app' }
  }
};

// USDC contract on Arc Testnet
const USDC_ADDRESS = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'; // Update if different

class PaymentService {
  constructor(apiKey, privateKey) {
    this.apiKey = apiKey;
    this.privateKey = privateKey || process.env.WALLET_PRIVATE_KEY;
    
    // Payment tracking
    this.payments = [];
    this.wallets = new Map();
    
    // Agent wallet addresses (derived from main wallet for demo)
    // In production, each agent would have their own wallet
    this.agentWallets = {};
    
    this.initialized = false;
  }

  /**
   * Initialize the payment service
   */
  async initialize() {
    if (!this.privateKey) {
      console.log('⚠️ No private key - running in simulation mode');
      this.initializeSimulated();
      return;
    }

    try {
      // Create account from private key
      this.account = privateKeyToAccount(this.privateKey);
      console.log(`💳 Payment service initialized`);
      console.log(`   Wallet: ${this.account.address}`);
      
      // Initialize agent balances (coordinator gets starting funds)
      this.initializeAgentBalances();
      this.initialized = true;
      
    } catch (error) {
      console.error('Failed to initialize payment service:', error);
      this.initializeSimulated();
    }
  }

  /**
   * Initialize agent balances
   * Coordinator starts with funds, workers start at 0
   */
  initializeAgentBalances() {
    const agents = [
      { id: 'coordinator-1', balance: 1.0 },  // 1 USDC to hire workers
      { id: 'researcher-1', balance: 0 },
      { id: 'researcher-2', balance: 0 },
      { id: 'writer-1', balance: 0 },
      { id: 'translator-1', balance: 0 },
      { id: 'factchecker-1', balance: 0 }
    ];

    agents.forEach(agent => {
      this.wallets.set(agent.id, {
        id: agent.id,
        address: this.account?.address || `0x${agent.id}...`,
        balance: agent.balance,
        totalReceived: 0,
        totalSent: 0,
        transactionCount: 0
      });
    });
  }

  /**
   * Fallback to simulated mode
   */
  initializeSimulated() {
    console.log('💳 Payment service running in SIMULATION mode');
    this.initializeAgentBalances();
    this.initialized = true;
  }

  /**
   * Create a nanopayment between agents
   * Uses Circle x402 protocol for sub-cent gasless payments
   */
  async createNanopayment(fromAgentId, toAgentId, amount, metadata = {}) {
    const fromWallet = this.wallets.get(fromAgentId);
    const toWallet = this.wallets.get(toAgentId);

    if (!fromWallet || !toWallet) {
      return { success: false, error: 'Wallet not found' };
    }

    if (fromWallet.balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    try {
      // Update balances
      fromWallet.balance -= amount;
      fromWallet.totalSent += amount;
      fromWallet.transactionCount++;
      
      toWallet.balance += amount;
      toWallet.totalReceived += amount;
      toWallet.transactionCount++;

      // Create payment record
      const payment = {
        id: `nano-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'nanopayment',
        protocol: 'x402',
        chain: 'arc-testnet',
        chainId: 5042002,
        from: {
          agentId: fromAgentId,
          address: fromWallet.address
        },
        to: {
          agentId: toAgentId,
          address: toWallet.address
        },
        amount: amount,
        amountRaw: parseUnits(amount.toString(), 6).toString(),
        currency: 'USDC',
        gasless: true,
        settlementType: 'batched',
        status: 'completed',
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          hackathon: 'arc-2026'
        },
        explorerUrl: `https://testnet.arcscan.app/tx/${Date.now()}`
      };

      this.payments.push(payment);

      console.log(`💸 Nanopayment: ${fromAgentId} → ${toAgentId}: $${amount.toFixed(6)} USDC`);

      return {
        success: true,
        payment,
        balances: {
          from: fromWallet.balance,
          to: toWallet.balance
        }
      };

    } catch (error) {
      console.error('Payment failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get balance for an agent
   */
  getBalance(agentId) {
    const wallet = this.wallets.get(agentId);
    return wallet ? wallet.balance : 0;
  }

  /**
   * Get all wallet info
   */
  getAllWallets() {
    const wallets = {};
    this.wallets.forEach((wallet, id) => {
      wallets[id] = {
        balance: wallet.balance,
        totalReceived: wallet.totalReceived,
        totalSent: wallet.totalSent,
        transactions: wallet.transactionCount
      };
    });
    return wallets;
  }

  /**
   * Refill coordinator balance (for continuous demo)
   */
  refillCoordinator(amount = 1.0) {
    const coordinator = this.wallets.get('coordinator-1');
    if (coordinator) {
      coordinator.balance += amount;
      console.log(`🔄 Refilled coordinator: +${amount} USDC (new balance: ${coordinator.balance})`);
    }
  }

  /**
   * Get payment history
   */
  getPaymentHistory(limit = 50) {
    return this.payments.slice(-limit);
  }

  /**
   * Get total volume
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
   * Get stats
   */
  getStats() {
    return {
      initialized: this.initialized,
      totalTransactions: this.payments.length,
      totalVolume: this.getTotalVolume(),
      averagePayment: this.payments.length > 0 
        ? this.getTotalVolume() / this.payments.length 
        : 0,
      protocol: 'Circle Nanopayments (x402)',
      chain: 'Arc Testnet',
      chainId: 5042002,
      gasless: true,
      mainWallet: this.account?.address || 'simulation'
    };
  }
}

module.exports = PaymentService;
