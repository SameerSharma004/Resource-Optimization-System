import React from "react";

const Download = () => {
  const API = import.meta.env.VITE_API_URL;
  return (
    <div className="bg-black text-white pt-24 min-h-[calc(100vh-100px)] w-full">
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-16 space-y-6 pt-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            Download the{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-400">
              Agent
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Install our lightweight monitoring agent on your system to start
            streaming advanced telemetry to your dashboard. Available on all
            major operating systems.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="group bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>

            <span className="material-symbols-outlined text-[80px] text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              window
            </span>
            <h2 className="text-2xl font-bold mb-2">Windows</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Windows 10, 11 (64-bit)
            </p>

            <a
              href={`${API}/download/ai-optimizer-agent-1.0.exe`}
              className="mt-auto w-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold py-4 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              <span className="material-symbols-outlined text-xl">
                download
              </span>
              Download .exe
            </a>

            <div className="mt-6 text-xs text-slate-600 font-mono tracking-wider">
              v1.0.0 • 15 MB
            </div>
          </div>
          <div className="group bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>

            <span className="material-symbols-outlined text-[80px] text-slate-200 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              desktop_mac
            </span>
            <h2 className="text-2xl font-bold mb-2">MacOS</h2>
            <p className="text-slate-500 mb-8 text-sm">Apple Silicon & Intel</p>

            <button className="mt-auto w-full bg-slate-800 text-slate-200 border border-slate-700 font-bold py-4 rounded-xl group-hover:bg-slate-200 group-hover:text-slate-900 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <span className="material-symbols-outlined text-xl">
                download
              </span>
              Download .app
            </button>

            <div className="mt-6 text-xs text-slate-600 font-mono tracking-wider">
              v1.0.0 • 18 MB
            </div>
          </div>
          <div className="group bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500"></div>

            <span className="material-symbols-outlined text-[80px] text-orange-400 mb-6 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
              terminal
            </span>
            <h2 className="text-2xl font-bold mb-2">Linux</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Debian, Ubuntu (64-bit)
            </p>

            <a
              href={`${API}/download/ai-optimizer-agent-1.0.deb`}
              className="mt-auto w-full bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold py-4 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              <span className="material-symbols-outlined text-xl">
                download
              </span>
              Download .deb
            </a>

            <div className="mt-6 text-xs text-slate-600 font-mono tracking-wider">
              v1.0.0 • 15 MB
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-24 bg-primary/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">code</span>
            Installation Setup (Linux)
          </h3>
          <p className="text-slate-400 mb-6 text-sm">
            For Debian-based distributions, you can easily install the agent via
            dpkg & apt system:
          </p>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 font-mono text-sm text-slate-300 relative group shadow-inner">
            <div className="text-primary/50 select-none mb-2">
              # 1. Install the downloaded package
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-green-400">$</span>
              <span className="text-white">
                sudo dpkg -i agent_1.0-1_amd64.deb
              </span>
            </div>

            <div className="text-primary/50 select-none mb-2">
              # 2. Fix potential missing dependencies
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-green-400">$</span>
              <span className="text-white">sudo apt-get install -f</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
