import React from "react";

const Documentation = () => {
  return (
    <div className="bg-black text-white min-h-[calc(100vh-100px)] w-full">
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-size-[40px_40px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl text-primary mb-6 border border-primary/20">
            <span className="material-symbols-outlined mr-2 text-xl">book_4</span>
            <span className="text-sm font-bold uppercase tracking-widest">Documentation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Platform <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-400">
              Reference Guide
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Real-Time AI-Based System Monitoring & Optimization Platform
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10 space-y-24">
        {/* Grids section */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Project Overview */}
          <div className="group bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
            <span className="material-symbols-outlined text-4xl text-primary mb-6">info</span>
            <h3 className="text-2xl font-bold mb-4">Project Overview</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The AI Resource Intelligence Platform is a real-time system monitoring solution that collects device-level telemetry data. It analyzes user activity patterns using an LSTM-based deep learning model and provides intelligent optimization recommendations to improve power efficiency and performance.
            </p>
          </div>

          {/* Machine Learning Model */}
          <div className="group bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-300 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
            <span className="material-symbols-outlined text-4xl text-blue-400 mb-6">neurology</span>
            <h3 className="text-2xl font-bold mb-4">Machine Learning Engine</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                LSTM (Long Short-Term Memory) Neural Network
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                Uses sliding window sequence input
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                Predicts user idle probability
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                Generates optimization recommendations
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                Estimates battery gain improvement
              </li>
            </ul>
          </div>
          
          {/* System Architecture */}
          <div className="group bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all duration-300 relative overflow-hidden shadow-2xl md:col-span-2">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
            <span className="material-symbols-outlined text-4xl text-purple-400 mb-6">architecture</span>
            <h3 className="text-2xl font-bold mb-8">System Architecture</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-6 text-center w-full">
                 <span className="material-symbols-outlined text-3xl text-purple-400 mb-3">laptop_mac</span>
                 <p className="font-bold">User Device</p>
                 <p className="text-xs text-slate-500 mt-1">Telemetry Agent</p>
              </div>
              <div className="flex items-center text-slate-600">
                <span className="material-symbols-outlined hidden md:block text-3xl">arrow_right_alt</span>
                <span className="material-symbols-outlined md:hidden text-3xl">arrow_downward</span>
              </div>
              <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-6 text-center w-full">
                 <span className="material-symbols-outlined text-3xl text-purple-400 mb-3">dns</span>
                 <p className="font-bold">Flask Backend</p>
                 <p className="text-xs text-slate-500 mt-1">Docker + AWS EC2</p>
              </div>
              <div className="flex items-center text-slate-600">
                <span className="material-symbols-outlined hidden md:block text-3xl">arrow_right_alt</span>
                <span className="material-symbols-outlined md:hidden text-3xl">arrow_downward</span>
              </div>
              <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-6 text-center w-full">
                 <span className="material-symbols-outlined text-3xl text-purple-400 mb-3">dashboard</span>
                 <p className="font-bold">React Dashboard</p>
                 <p className="text-xs text-slate-500 mt-1">Live Monitoring (Vite)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
             <span className="material-symbols-outlined text-orange-400">integration_instructions</span>
             Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {["Python", "Flask", "TensorFlow (LSTM)", "Scikit-learn", "React (Vite)", "Tailwind CSS", "Docker", "AWS EC2"].map(tech => (
               <div key={tech} className="bg-slate-900/40 border border-white/10 rounded-xl p-6 flex justify-center items-center text-sm font-semibold text-slate-300 hover:border-white/30 hover:text-white transition-colors cursor-default">
                  {tech}
               </div>
             ))}
          </div>
        </div>

        {/* Endpoints */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
             <span className="material-symbols-outlined text-green-400">api</span>
             Backend API Endpoints
          </h2>
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/80 text-slate-300 uppercase text-xs font-bold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-primary">/status</td>
                  <td className="px-6 py-4"><span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded text-xs font-bold">GET</span></td>
                  <td className="px-6 py-4 text-slate-400">Backend health check</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-primary">/analyze</td>
                  <td className="px-6 py-4"><span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded text-xs font-bold">POST</span></td>
                  <td className="px-6 py-4 text-slate-400">Receives telemetry data</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-primary">/client-system</td>
                  <td className="px-6 py-4"><span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded text-xs font-bold">GET</span></td>
                  <td className="px-6 py-4 text-slate-400">Returns latest system metrics</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-primary">/predicted</td>
                  <td className="px-6 py-4"><span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded text-xs font-bold">GET</span></td>
                  <td className="px-6 py-4 text-slate-400">Returns AI prediction results</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Documentation;
