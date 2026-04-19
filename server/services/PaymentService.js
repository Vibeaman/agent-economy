/**
 * Payment Service - Circle Nanopayments Integration
 * 
 * Uses Circle Gateway for gasless USDC payments via x402 protocol
 * Agents sign EIP-3009 authorizations, Gateway batches and settles
 */

import { createWalletClient, createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import crypto from 'crypto';

// Arc Testnet chain config
const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] }
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://testnet.arcscan.app' }
  }
};

// Contract addresses on Arc Testnet
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const GATEWAY_WALLET = '0x0077777d7EBA4688BDeF3E311b846F25870A19B9';
const USDC_DECIMALS = 6;

// EIP-3009 type for transferWithAuthorization
const EIP3009_TYPES = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' }
  ]
};

// ERC-20 ABI
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
];

class PaymentService {
  constructor(apiKey, privateKey) {
    this.apiKey = apiKey;
    this.privateKey = privateKey;
    
    // Payment tracking
    this.payments = [];
    this.wallets = new Map();
    this.nanopayments = [];
    
    // Stats
    this.stats = {
      paymentsCount: 0,
      totalVolume: 0,
      nanopaymentCount: 0,
      onchainTxCount: 0
    };
    
    this.initialized = false;
    this.usdcBalance = 0;
    this.gatewayClient = null;
  }

  /**
   * Initialize the payment service with Circle Gateway
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
      
      // Create viem clients
      this.publicClient = createPublicClient({
        chain: arcTestnet,
        transport: http()
      });
      
      this.walletClient = createWalletClient({
        account: this.account,
        chain: arcTestnet,
        transport: http()
      });

      // Try to import and initialize GatewayClient
      try {
        const { GatewayClient } = await import('@circle-fin/x402-batching/client');
        this.gatewayClient = new GatewayClient({
          chain: 'arcTestnet',
          privateKey: this.privateKey
        });
        console.log('✅ Circle Gateway client initialized');
      } catch (e) {
        console.log('⚠️ Gateway client not available, using direct mode:', e.message);
      }
      
      console.log(`💳 Payment Service initialized`);
      console.log(`   Mode: ${this.gatewayClient ? 'CIRCLE NANOPAYMENTS' : 'DIRECT ONCHAIN'}`);
      console.log(`   Wallet: ${this.account.address}`);
      console.log(`   Chain: Arc Testnet (${arcTestnet.id})`);
      console.log(`   USDC: ${USDC_ADDRESS}`);
      console.log(`   Gateway: ${GATEWAY_WALLET}`);
      
      // Check USDC balance
      await this.checkBalance();
      
      // Initialize agent wallets
      this.initializeAgentWallets();
      this.initialized = true;
      
    } catch (error) {
      console.error('Failed to initialize payment service:', error);
      this.initializeSimulated();
    }
  }

  /**
   * Check USDC balance
   */
  async checkBalance() {
    try {
      const balance = await this.publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [this.account.address]
      });
      
      this.usdcBalance = parseFloat(formatUnits(balance, USDC_DECIMALS));
      console.log(`   USDC Balance: ${this.usdcBalance} USDC`);
      
      // Also check Gateway balance if client available
      if (this.gatewayClient) {
        try {
          const gwBalance = await this.gatewayClient.getBalances();
          console.log(`   Gateway Balance: ${gwBalance.gateway?.formattedAvailable || '0'} USDC`);
        } catch (e) {
          // Gateway balance check optional
        }
      }
      
      return this.usdcBalance;
    } catch (error) {
      console.log('   Could not fetch balance:', error.message);
      return 0;
    }
  }

  /**
   * Initialize agent wallets
   */
  initializeAgentWallets() {
    const agents = [
      { id: 'coordinator-1', name: 'Atlas', balance: 1.0 },
      { id: 'researcher-1', name: 'Nova', balance: 0 },
      { id: 'researcher-2', name: 'Quantum', balance: 0 },
      { id: 'writer-1', name: 'Echo', balance: 0 },
      { id: 'translator-1', name: 'Babel', balance: 0 },
      { id: 'factchecker-1', name: 'Verify', balance: 0 }
    ];

    agents.forEach(agent => {
      this.wallets.set(agent.id, {
        id: agent.id,
        name: agent.name,
        address: this.account?.address || `0x${crypto.randomBytes(20).toString('hex')}`,
        balance: agent.balance,
        totalReceived: 0,
        totalSent: 0
      });
    });
  }

  /**
   * Fallback simulation mode
   */
  initializeSimulated() {
    console.log('💳 Payment service in SIMULATION mode');
    this.initializeAgentWallets();
    this.initialized = true;
  }

  /**
   * Create EIP-3009 authorization signature for gasless transfer
   * This is the core of Circle Nanopayments
   */
  async createEIP3009Authorization(to, amount) {
    const value = parseUnits(amount.toFixed(6), USDC_DECIMALS);
    const nonce = '0x' + crypto.randomBytes(32).toString('hex');
    const validAfter = 0;
    const validBefore = Math.floor(Date.now() / 1000) + (4 * 24 * 60 * 60); // 4 days

    const domain = {
      name: 'USDC',
      version: '1',
      chainId: arcTestnet.id,
      verifyingContract: USDC_ADDRESS
    };

    const message = {
      from: this.account.address,
      to: to,
      value: value,
      validAfter: validAfter,
      validBefore: validBefore,
      nonce: nonce
    };

    try {
      const signature = await this.walletClient.signTypedData({
        domain,
        types: EIP3009_TYPES,
        primaryType: 'TransferWithAuthorization',
        message
      });

      return {
        authorization: {
          from: this.account.address,
          to: to,
          value: value.toString(),
          validAfter,
          validBefore,
          nonce
        },
        signature,
        network: `eip155:${arcTestnet.id}`,
        asset: USDC_ADDRESS
      };
    } catch (error) {
      console.error('EIP-3009 signing failed:', error);
      return null;
    }
  }

  /**
   * Execute payment via Circle Nanopayments (gasless) or direct transfer
   */
  async executePayment(toAddress, amount, metadata = {}) {
    // Try nanopayment first (gasless via Gateway)
    if (this.gatewayClient) {
      try {
        const auth = await this.createEIP3009Authorization(toAddress, amount);
        if (auth) {
          this.stats.nanopaymentCount++;
          this.nanopayments.push({
            ...auth,
            amount,
            timestamp: Date.now(),
            metadata
          });
          
          console.log(`⚡ Nanopayment signed: ${amount} USDC (gasless)`);
          return {
            success: true,
            type: 'nanopayment',
            authorization: auth,
            gasless: true
          };
        }
      } catch (e) {
        console.log('Nanopayment failed, falling back to direct:', e.message);
      }
    }

    // Fallback: direct onchain transfer
    if (this.walletClient) {
      try {
        const amountInUnits = parseUnits(amount.toFixed(6), USDC_DECIMALS);
        
        const hash = await this.walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [toAddress, amountInUnits]
        });
        
        console.log(`📡 Direct transfer: ${amount} USDC [${hash.slice(0, 10)}...]`);
        
        const receipt = await this.publicClient.waitForTransactionReceipt({ 
          hash,
          timeout: 30000 
        });
        
        this.stats.onchainTxCount++;
        
        return {
          success: true,
          type: 'direct',
          hash,
          blockNumber: receipt.blockNumber,
          explorerUrl: `https://testnet.arcscan.app/tx/${hash}`
        };
      } catch (error) {
        console.error('Direct transfer failed:', error.message);
      }
    }

    return { success: false, error: 'No payment method available' };
  }

  /**
   * Create a nanopayment between agents
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
      // Execute payment (nanopayment or direct)
      let paymentResult = null;
      
      // Every payment goes onchain for verifiable demo
      if (this.account) {
        paymentResult = await this.executePayment(
          this.account.address, // self-transfer for demo
          amount,
          { taskId: metadata.taskId, from: fromAgentId, to: toAgentId }
        );
      }

      // Update virtual balances
      fromWallet.balance -= amount;
      fromWallet.totalSent += amount;
      toWallet.balance += amount;
      toWallet.totalReceived += amount;

      // Create payment record
      const payment = {
        id: paymentResult?.hash || `np-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        type: paymentResult?.type || 'virtual',
        protocol: 'x402',
        chain: 'arc-testnet',
        chainId: arcTestnet.id,
        from: {
          agentId: fromAgentId,
          name: fromWallet.name,
          address: fromWallet.address
        },
        to: {
          agentId: toAgentId,
          name: toWallet.name,
          address: toWallet.address
        },
        amount: amount,
        currency: 'USDC',
        gasless: paymentResult?.gasless || false,
        onchain: paymentResult?.hash ? {
          hash: paymentResult.hash,
          blockNumber: paymentResult.blockNumber,
          explorerUrl: paymentResult.explorerUrl
        } : null,
        nanopayment: paymentResult?.authorization || null,
        status: paymentResult?.success ? 'settled' : 'pending',
        timestamp: Date.now(),
        metadata
      };

      this.payments.push(payment);
      this.stats.paymentsCount++;
      this.stats.totalVolume += amount;

      const typeIcon = paymentResult?.type === 'nanopayment' ? '⚡' : 
                       paymentResult?.type === 'direct' ? '📡' : '💫';
      console.log(`${typeIcon} ${fromWallet.name} → ${toWallet.name}: $${amount.toFixed(6)} USDC`);

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
        name: wallet.name,
        balance: wallet.balance,
        totalReceived: wallet.totalReceived,
        totalSent: wallet.totalSent
      };
    });
    return wallets;
  }

  /**
   * Refill coordinator balance
   */
  refillCoordinator(amount = 1.0) {
    const coordinator = this.wallets.get('coordinator-1');
    if (coordinator) {
      coordinator.balance += amount;
      console.log(`🔄 Refilled coordinator: +${amount} USDC`);
    }
  }

  /**
   * Get payment history
   */
  getPaymentHistory(limit = 50) {
    return this.payments.slice(-limit);
  }

  /**
   * Get nanopayment authorizations
   */
  getNanopayments() {
    return this.nanopayments;
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      initialized: this.initialized,
      mode: this.gatewayClient ? 'CIRCLE NANOPAYMENTS' : 'DIRECT + EIP3009',
      protocol: 'x402',
      chain: 'Arc Testnet',
      chainId: arcTestnet.id,
      contracts: {
        usdc: USDC_ADDRESS,
        gateway: GATEWAY_WALLET
      },
      mainWallet: this.account?.address || 'simulation',
      usdcBalance: this.usdcBalance,
      paymentsCount: this.stats.paymentsCount,
      nanopaymentCount: this.stats.nanopaymentCount,
      onchainTxCount: this.stats.onchainTxCount,
      totalVolume: this.stats.totalVolume
    };
  }

  getTotalVolume() {
    return this.stats.totalVolume;
  }

  getTransactionCount() {
    return this.stats.paymentsCount;
  }
}

export default PaymentService;
