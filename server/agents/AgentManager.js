/**
 * Agent Manager
 * Orchestrates the entire agent economy
 */

import Agent from './Agent.js';

class AgentManager {
  constructor(io, paymentService) {
    this.io = io;
    this.paymentService = paymentService;
    this.agents = new Map();
    this.taskQueue = [];
    this.completedTasks = [];
    this.transactions = [];
    this.isRunning = false;
    this.economyInterval = null;
    
    // Stats
    this.stats = {
      totalTransactions: 0,
      totalVolume: 0,
      tasksCompleted: 0,
      activeNegotiations: 0,
      economyStartTime: null
    };
    
    this.initializeAgents();
  }

  /**
   * Create the initial set of agents
   */
  initializeAgents() {
    const agentConfigs = [
      {
        id: 'coordinator-1',
        name: 'Atlas',
        type: 'coordinator',
        skills: ['task-decomposition', 'delegation', 'quality-check'],
        wallet: '0xCoord1...'
      },
      {
        id: 'researcher-1',
        name: 'Nova',
        type: 'researcher',
        skills: ['web-search', 'data-analysis', 'summarization'],
        wallet: '0xResearch1...'
      },
      {
        id: 'researcher-2',
        name: 'Quantum',
        type: 'researcher',
        skills: ['web-search', 'deep-dive', 'citation'],
        wallet: '0xResearch2...'
      },
      {
        id: 'writer-1',
        name: 'Echo',
        type: 'writer',
        skills: ['content-creation', 'editing', 'formatting'],
        wallet: '0xWriter1...'
      },
      {
        id: 'translator-1',
        name: 'Babel',
        type: 'translator',
        skills: ['multi-language', 'localization', 'cultural-adaptation'],
        wallet: '0xTranslator1...'
      },
      {
        id: 'factchecker-1',
        name: 'Verify',
        type: 'factchecker',
        skills: ['fact-verification', 'source-checking', 'accuracy'],
        wallet: '0xFactCheck1...'
      }
    ];

    agentConfigs.forEach(config => {
      const agent = new Agent(
        config.id,
        config.name,
        config.type,
        config.skills,
        config.wallet
      );
      // Give coordinator starting balance to hire others
      if (config.type === 'coordinator') {
        agent.balance = 1.0; // 1 USDC to start
      }
      this.agents.set(config.id, agent);
    });
  }

  /**
   * Get all agents as array
   */
  getAgents() {
    return Array.from(this.agents.values()).map(a => a.toJSON());
  }

  /**
   * Get economy stats
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      agentCount: this.agents.size,
      recentTransactions: this.transactions.slice(-20)
    };
  }

  /**
   * Start the economy simulation
   */
  startEconomy() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.stats.economyStartTime = Date.now();
    this.io.emit('economy-started');
    
    // Run economy loop
    this.economyInterval = setInterval(() => {
      this.runEconomyCycle();
    }, 2000); // New task every 2 seconds
    
    console.log('🏛️ Economy started');
  }

  /**
   * Stop the economy simulation
   */
  stopEconomy() {
    this.isRunning = false;
    if (this.economyInterval) {
      clearInterval(this.economyInterval);
      this.economyInterval = null;
    }
    this.io.emit('economy-stopped');
    console.log('🛑 Economy stopped');
  }

  /**
   * Run one cycle of the economy
   */
  async runEconomyCycle() {
    if (!this.isRunning) return;

    // Generate a new task
    const task = this.generateTask();
    this.io.emit('task-created', task);

    // Get coordinator
    const coordinator = this.agents.get('coordinator-1');
    
    // Find eligible workers for this task
    const eligibleAgents = this.findEligibleAgents(task);
    
    if (eligibleAgents.length === 0) return;

    // Collect bids
    this.stats.activeNegotiations++;
    this.io.emit('negotiation-started', { taskId: task.id, task });
    
    const bids = [];
    for (const agent of eligibleAgents) {
      agent.status = 'bidding';
      const bid = agent.generateBid(task);
      bids.push(bid);
      
      // Emit each bid with slight delay for visual effect
      await new Promise(resolve => setTimeout(resolve, 300));
      this.io.emit('bid-received', { taskId: task.id, bid });
      this.io.emit('agents', this.getAgents());
    }

    // Select winner (lowest bid)
    const winningBid = bids.reduce((min, bid) => 
      bid.price < min.price ? bid : min
    );
    
    this.io.emit('bid-accepted', { taskId: task.id, winningBid });
    
    // Reset bidding agents
    eligibleAgents.forEach(a => a.status = 'idle');
    
    // Winner does the work
    const winner = this.agents.get(winningBid.agentId);
    const result = await winner.completeTask(task);
    
    this.io.emit('task-completed', { taskId: task.id, result });
    this.io.emit('agents', this.getAgents());

    // Process payment
    await this.processPayment(coordinator, winner, winningBid.price, task);
    
    this.stats.activeNegotiations--;
    this.stats.tasksCompleted++;
    this.completedTasks.push({ ...task, result, payment: winningBid.price });
    
    // Emit updated stats
    this.io.emit('stats', this.getStats());
    this.io.emit('agents', this.getAgents());
  }

  /**
   * Generate a random task
   */
  generateTask() {
    const taskTypes = [
      { type: 'research', description: 'Research latest AI developments', requiredSkill: 'web-search', baseBudget: 0.005 },
      { type: 'research', description: 'Find market data on DeFi trends', requiredSkill: 'data-analysis', baseBudget: 0.006 },
      { type: 'writing', description: 'Write summary of blockchain news', requiredSkill: 'content-creation', baseBudget: 0.004 },
      { type: 'writing', description: 'Create product description', requiredSkill: 'editing', baseBudget: 0.003 },
      { type: 'translation', description: 'Translate article to Spanish', requiredSkill: 'multi-language', baseBudget: 0.005 },
      { type: 'translation', description: 'Localize content for Asian markets', requiredSkill: 'localization', baseBudget: 0.007 },
      { type: 'factcheck', description: 'Verify claims in news article', requiredSkill: 'fact-verification', baseBudget: 0.004 },
      { type: 'factcheck', description: 'Check sources and citations', requiredSkill: 'source-checking', baseBudget: 0.003 }
    ];

    const taskTemplate = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    
    return {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...taskTemplate,
      createdAt: Date.now(),
      status: 'pending'
    };
  }

  /**
   * Find agents that can complete a task
   */
  findEligibleAgents(task) {
    const typeMapping = {
      'research': 'researcher',
      'writing': 'writer',
      'translation': 'translator',
      'factcheck': 'factchecker'
    };

    const requiredType = typeMapping[task.type];
    
    return Array.from(this.agents.values())
      .filter(a => a.type === requiredType && a.status === 'idle');
  }

  /**
   * Process payment between agents using Circle Nanopayments
   * 
   * Why this works without gas:
   * - Circle Nanopayments use EIP-3009 signed authorizations
   * - Payments happen in Gateway layer (instant)
   * - Batched settlement to Arc blockchain
   * - Perfect for sub-cent agent-to-agent payments
   */
  async processPayment(from, to, amount, task) {
    // Use PaymentService for nanopayment
    const paymentResult = await this.paymentService.createNanopayment(
      from.id,
      to.id,
      amount,
      {
        taskId: task.id,
        taskType: task.type,
        taskDescription: task.description
      }
    );

    if (!paymentResult.success) {
      console.error('Payment failed:', paymentResult.error);
      return null;
    }

    const transaction = {
      id: paymentResult.payment.id,
      from: from.id,
      fromName: from.name,
      to: to.id,
      toName: to.name,
      amount: amount,
      currency: 'USDC',
      taskId: task.id,
      taskType: task.type,
      timestamp: Date.now(),
      status: 'completed',
      // Nanopayment specific
      protocol: 'x402',
      gasless: true,
      chain: 'arc'
    };

    // Update agent balances
    from.makePayment(amount);
    to.receivePayment(amount);

    // Update stats
    this.stats.totalTransactions++;
    this.stats.totalVolume += amount;
    
    // Store transaction
    this.transactions.push(transaction);
    
    // Emit payment event with nanopayment details
    this.io.emit('payment-processed', transaction);
    
    console.log(`💸 Nanopayment: ${from.name} → ${to.name}: $${amount.toFixed(6)} USDC (gasless, x402)`);
    
    return transaction;
  }
}

export default AgentManager;
