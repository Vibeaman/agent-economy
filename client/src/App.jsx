import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import AgentsSection from './components/AgentsSection';
import LiveActivity from './components/LiveActivity';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

const SOCKET_URL = import.meta.env.PROD 
  ? 'https://agent-economy-production-1e8c.up.railway.app' 
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
      addNotification('Economy started!', 'success');
    });

    newSocket.on('economy-stopped', () => {
      setIsRunning(false);
      addNotification('Economy paused', 'info');
    });

    newSocket.on('task-created', (task) => {
      // Silent - shows in activity feed
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
    });

    newSocket.on('payment-processed', (tx) => {
      addNotification(`${tx.fromName} paid ${tx.toName} $${tx.amount.toFixed(4)}`, 'payment');
      setTimeout(() => setCurrentNegotiation(null), 1500);
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header connected={connected} />
      
      <main>
        <Hero 
          isRunning={isRunning} 
          onToggle={toggleEconomy} 
          connected={connected}
          stats={stats}
        />
        
        <StatsBar stats={stats} />
        
        <AgentsSection 
          agents={agents} 
          currentNegotiation={currentNegotiation}
        />
        
        <LiveActivity 
          transactions={stats.recentTransactions}
          negotiation={currentNegotiation}
        />
        
        <HowItWorks />
        
        <Footer />
      </main>

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`px-4 py-3 rounded-xl backdrop-blur-sm border ${
                notification.type === 'success' 
                  ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                  : notification.type === 'payment' 
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' 
                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
              }`}
            >
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
