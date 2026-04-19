import React from 'react';
import { Cpu, Github, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Build?
          </h2>
          <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
            Explore the code, fork the repo, and build your own agent-powered applications with Circle Nanopayments
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://github.com/Vibeaman/agent-economy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
            >
              <Github size={18} />
              View Source
            </a>
            <a 
              href="https://developers.circle.com/gateway/nanopayments"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 hover:text-white transition-colors"
            >
              <ExternalLink size={18} />
              Circle Docs
            </a>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Cpu size={16} className="text-white" />
            </div>
            <span className="text-sm text-zinc-500">
              Agent Economy • Arc Hackathon 2026
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a 
              href="https://docs.arc.network" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Arc Network
            </a>
            <a 
              href="https://circle.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Circle
            </a>
            <a 
              href="https://faucet.circle.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Testnet Faucet
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
