"use client";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/20">
          {/* Brand */}
          <div>
            <h3 className="masthead text-2xl mb-4">The Fact Checker</h3>
            <p className="text-sm text-paper/70 font-body leading-relaxed">
              The world&apos;s first decentralized fact-checking protocol. Powered by GenLayer AI
              validators, we provide transparent, immutable, and trustless verification of claims.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Protocol</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="text-paper/70 hover:text-paper transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#stats" className="text-paper/70 hover:text-paper transition-colors">
                  Statistics
                </a>
              </li>
              <li>
                <a href="#leaderboard" className="text-paper/70 hover:text-paper transition-colors">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="#" className="text-paper/70 hover:text-paper transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://discord.gg/genlayer" className="text-paper/70 hover:text-paper transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://twitter.com/GenLayer" className="text-paper/70 hover:text-paper transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/genlayerlabs" className="text-paper/70 hover:text-paper transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://docs.genlayer.com" className="text-paper/70 hover:text-paper transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-paper/50">
          <p className="font-body">
            &copy; 2026 The Fact Checker Protocol. Built on GenLayer.
          </p>
          <p className="font-body mt-2 md:mt-0">
            Powered by Intelligent Contracts & Optimistic Democracy
          </p>
        </div>
      </div>
    </footer>
  );
}
