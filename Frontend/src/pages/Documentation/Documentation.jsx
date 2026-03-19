import React from "react";
const Documentation = () => {
  return (
    <div className="bg-black text-white pt-32 pb-20 min-h-screen w-full selection:bg-primary/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-8 pt-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,59,59,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
            Technical <br />
            <span className="text-primary italic font-serif font-normal">
              Documentation
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            A comprehensive guide to the AI Resource Intelligence Platform.
            Explore the architecture, AI prediction engine, and API integration.
          </p>
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[40px] p-12 text-background-dark shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="size-16 rounded-2xl bg-black flex items-center justify-center mb-8 shadow-xl">
                <span className="material-symbols-outlined text-3xl text-primary">
                  analytics
                </span>
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">
                Project Overview
              </h3>
              <p className="text-gray-500 font-bold leading-relaxed text-lg">
                The platform is a real-time system monitoring solution that
                collects device-level telemetry. It analyzes user activity
                patterns using an LSTM-based deep learning model and provides
                intelligent optimization recommendations to improve power
                efficiency.
              </p>
            </div>
            <div className="bg-background-dark rounded-[40px] p-12 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="size-16 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-xl">
                <span className="material-symbols-outlined text-3xl text-white">
                  psychology
                </span>
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">
                AI Engine
              </h3>
              <ul className="space-y-4 text-gray-400 font-bold">
                {[
                  "LSTM (Long Short-Term Memory) Architecture",
                  "Sliding window sequence input processing",
                  "Real-time idle probability forecasting",
                  "Dynamic resource reallocation logic",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-primary"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-[40px] p-12 md:p-16 text-background-dark shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
              <div>
                <h3 className="text-4xl font-black tracking-tight mb-2">
                  System Architecture
                </h3>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                  End-to-End Data Flow
                </p>
              </div>
              <div className="bg-black text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest">
                Distributed System
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-1/3 -translate-y-1/2 w-1/3 h-px border-t-2 border-dashed border-gray-200"></div>
              {[
                {
                  label: "Telemetry Agent",
                  tech: "Python / psutil",
                  icon: "terminal",
                  tech_desc: "Collects system metrics and sends to backend.",
                },
                {
                  label: "AI Analysis API",
                  tech: "Flask / LSTM",
                  icon: "dns",
                  tech_desc:
                    "Centralized engine processing real-time telemetry.",
                },
                {
                  label: "Control Hub",
                  tech: "React / Vite",
                  icon: "dashboard",
                  tech_desc: "High-fidelity visualization and optimization UI.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative z-10 bg-gray-50 rounded-[32px] p-8 border border-black/5 hover:border-primary/20 transition-all group"
                >
                  <div className="size-14 rounded-xl bg-background-dark flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-white text-2xl">
                      {step.icon}
                    </span>
                  </div>
                  <h4 className="text-xl font-black mb-2">{step.label}</h4>
                  <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">
                    {step.tech}
                  </p>
                  <p className="text-gray-500 font-bold text-sm leading-relaxed">
                    {step.tech_desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid lg:grid-cols-1 gap-6">
            <div className="bg-background-dark rounded-[40px] p-12 text-white border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-12">
                <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    api
                  </span>
                </div>
                <h3 className="text-3xl font-black tracking-tight">
                  API Reference
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/10 uppercase tracking-[0.2em] text-[10px] text-gray-500">
                    <tr>
                      <th className="pb-6">Endpoint</th>
                      <th className="pb-6">Method</th>
                      <th className="pb-6">Scope</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold divide-y divide-white/5">
                    {[
                      {
                        path: "/status",
                        method: "GET",
                        scope: "Backend health pulse",
                      },
                      {
                        path: "/analyze",
                        method: "POST",
                        scope: "Primary telemetry ingestion",
                      },
                      {
                        path: "/client-system",
                        method: "GET",
                        scope: "Real-time hardware metrics",
                      },
                      {
                        path: "/predicted",
                        method: "GET",
                        scope: "AI engine predictions",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="group hover:bg-white/5 transition-colors"
                      >
                        <td className="py-6 font-mono text-primary text-sm">
                          {row.path}
                        </td>
                        <td className="py-6">
                          <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {row.method}
                          </span>
                        </td>
                        <td className="py-6 text-gray-400 text-sm">
                          {row.scope}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-6 justify-center">
              {[
                "Python",
                "Flask",
                "TensorFlow",
                "LSTM",
                "React",
                "Tailwind",
                "Docker",
                "AWS EC2",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-primary transition-all cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Documentation;
