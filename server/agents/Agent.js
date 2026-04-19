/**
 * Base Agent Class
 * Represents an AI agent in the economy
 */

class Agent {
  constructor(id, name, type, skills, walletAddress) {
    this.id = id;
    this.name = name;
    this.type = type; // 'coordinator', 'researcher', 'writer', 'translator', 'factchecker'
    this.skills = skills;
    this.walletAddress = walletAddress;
    this.balance = 0;
    this.tasksCompleted = 0;
    this.totalEarned = 0;
    this.totalSpent = 0;
    this.reputation = 100;
    this.status = 'idle'; // 'idle', 'working', 'bidding'
    this.currentTask = null;
  }

  /**
   * Generate a bid for a task based on agent's pricing strategy
   */
  generateBid(task) {
    // Base price depends on task complexity
    const basePrice = task.baseBudget || 0.005;
    
    // Add some randomness to simulate different agent strategies
    const variance = (Math.random() * 0.4) - 0.2; // -20% to +20%
    const bidPrice = basePrice * (1 + variance);
    
    // Agents with higher reputation might bid slightly higher
    const reputationMultiplier = this.reputation > 80 ? 1.05 : 1;
    
    return {
      agentId: this.id,
      agentName: this.name,
      price: parseFloat((bidPrice * reputationMultiplier).toFixed(6)),
      estimatedTime: Math.floor(Math.random() * 3000) + 1000, // 1-4 seconds
      timestamp: Date.now()
    };
  }

  /**
   * Simulate completing a task
   */
  async completeTask(task) {
    this.status = 'working';
    this.currentTask = task;
    
    // Simulate work time
    const workTime = Math.floor(Math.random() * 2000) + 500;
    await new Promise(resolve => setTimeout(resolve, workTime));
    
    // Task completed
    this.tasksCompleted++;
    this.status = 'idle';
    this.currentTask = null;
    
    return {
      success: true,
      taskId: task.id,
      agentId: this.id,
      result: `Completed ${task.type} task: ${task.description}`,
      completedAt: Date.now()
    };
  }

  /**
   * Receive payment for completed work
   */
  receivePayment(amount) {
    this.balance += amount;
    this.totalEarned += amount;
  }

  /**
   * Make payment for hiring another agent
   */
  makePayment(amount) {
    this.balance -= amount;
    this.totalSpent += amount;
  }

  /**
   * Get agent state for frontend
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      skills: this.skills,
      balance: parseFloat(this.balance.toFixed(6)),
      tasksCompleted: this.tasksCompleted,
      totalEarned: parseFloat(this.totalEarned.toFixed(6)),
      totalSpent: parseFloat(this.totalSpent.toFixed(6)),
      reputation: this.reputation,
      status: this.status,
      currentTask: this.currentTask
    };
  }
}

module.exports = Agent;
