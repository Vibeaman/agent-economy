import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Zap, Users, DollarSign, Activity, ArrowRight } from 'lucide-react';
import AgentCard from './components/AgentCard';
import TransactionFeed from './components/TransactionFeed';
import StatsPanel from './components/StatsPanel';
import NegotiationPanel from './components/NegotiationPanel';

const SOCKET_URL = import.meta.env.PROD 
  ? 'https://agent-economy-api.onrender.com' 
  : 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: 0,
    tasksCompleted: 0,
    activeNegotiations: 0,
    recentTransactions: []
  });
  const [currentNegotiation, setCurrentNegotiation] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('agents', (data) => {
      setAgents(data);
    });

    newSocket.on('stats', (data) => {
      setStats(data);
      setIsRunning(data.isRunning);
    });

    newSocket.on('economy-started', () => {
      setIsRunning(true);
      addNotification('🚀 Economy started!', 'success');
    });

    newSocket.on('economy-stopped', () => {
      setIsRunning(false);
      addNotification('🛑 Economy stopped', 'info');
    });

    newSocket.on('task-created', (task) => {
      addNotification(`📋 New task: ${task.description}`, 'info');
    });

    newSocket.on('negotiation-started', ({ taskId, task }) => {
      setCurrentNegotiation({ taskId, task, bids: [] });
    });

    newSocket.on('bid-received', ({ taskId, bid }) => {
      setCurrentNegotiation(prev => {
        if (!prev || prev.taskId !== taskId) return prev;
        return { ...prev, bids: [...prev.bids, bid] };
      });
    });

    newSocket.on('bid-accepted', ({ taskId, winningBid }) => {
      setCurrentNegotiation(prev => {
        if (!prev || prev.taskId !== taskId) return prev;
        return { ...prev, winner: winningBid };
      });
      addNotification(`✅ ${winningBid.agentName} won with $${winningBid.price.toFixed(4)}`, 'success');
    });

    newSocket.on('payment-processed', (tx) => {
      addNotification(`💸 ${tx.fromName} → ${tx.toName}: $${tx.amount.toFixed(4)} USDC`, 'payment');
      setTimeout(() => setCurrentNegotiation(null), 1000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const toggleEconomy = () => {
    if (socket) {
      socket.emit(isRunning ? 'stop-economy' : 'start-economy');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-arc-blue via-arc-purple to-usdc-blue bg-clip-text text-transparent">
              Agent Economy
            </h1>
            <p className="text-gray-400 mt-1">
              AI Micro-Economy with Real-Time Nanopayments
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
              {connected ? 'Connected' : 'Disconnected'}
            </div>
            
            {/* Start/Stop button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleEconomy}
              disabled={!connected}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-arc-blue to-arc-purple hover:opacity-90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRunning ? (
                <>
                  <Square size={20} /> Stop Economy
                </>
              ) : (
                <>
                  <Play size={20} /> Start Economy
                </>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsPanel stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Agents Column */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users size={20} className="text-arc-purple" />
            Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Right Column - Negotiations & Transactions */}
        <div className="space-y-6">
          {/* Active Negotiation */}
          <NegotiationPanel negotiation={currentNegotiation} />
          
          {/* Transaction Feed */}
          <TransactionFeed transactions={stats.recentTransactions} />
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`px-4 py-2 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-500/90' :
                notification.type === 'payment' ? 'bg-arc-purple/90' :
                notification.type === 'error' ? 'bg-red-500/90' :
                'bg-gray-700/90'
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Built with Circle Nanopayments on Arc • Hackathon 2026</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            <Zap size={14} /> Sub-cent transactions
          </span>
          <span className="flex items-center gap-1">
            <Activity size={14} /> Real-time settlement
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={14} /> USDC native
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
