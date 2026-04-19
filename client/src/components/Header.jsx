import React from 'react';
import { Cpu } from 'lucide-react';

function Header({ connected }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Agent Economy</h1>
              <p className="text-xs text-zinc-500">Powered by Circle</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#agents" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Agents
            </a>
            <a href="#activity" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Activity
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
              How It Works
            </a>
          </nav>

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              connected 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
              {connected ? 'Live' : 'Offline'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
