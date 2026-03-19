import React from "react";
const Download = () => {
  const API = import.meta.env.VITE_API_URL;
  return (
    <div className="bg-linear-to-b from-black to-background-dark text-white pt-32 pb-20 min-h-screen w-full selection:bg-primary/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-8 pt-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,59,59,0.08)_0%,transparent_70%)] pointer-events-none"></div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
            Install the <br />
            <span className="text-primary italic font-serif font-normal">
              Telemetry Agent
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            Unleash the full power of real-time telemetry. Our lightweight agent
            is designed to run silently while providing massive performance
            insights.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              os: "Windows",
              desc: "Windows 10, 11 (64-bit)",
              icon: "grid_view",
              ext: ".exe",
              link: `${API}/download/ai-optimizer-agent-1.0.exe`,
              color: "text-blue-400",
            },
            {
              os: "MacOS",
              desc: "Apple Silicon & Intel",
              icon: "desktop_mac",
              ext: ".app",
              link: "#",
              color: "text-white",
            },
            {
              os: "Linux",
              desc: "Debian, Ubuntu (64-bit)",
              icon: "terminal",
              ext: ".deb",
              link: `${API}/download/ai-optimizer-agent-1.0.deb`,
              color: "text-[#FF3B3B]",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-background-dark  rounded-[40px] p-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-500 border border-white/5 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div
                className={`size-20 rounded-2xl bg-black flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform`}
              >
                <span
                  className={`material-symbols-outlined text-4xl ${item.color}`}
                >
                  {item.icon}
                </span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">{item.os}</h2>
              <p className="text-gray-500 font-bold mb-10 text-sm tracking-tight">
                {item.desc}
              </p>
              <a
                href={item.link}
                className="w-full h-16 bg-background-dark hover:bg-black text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group/btn overflow-hidden relative"
              >
                <span className="relative z-10 uppercase tracking-widest text-xs">
                  Download {item.ext}
                </span>
                <div className="relative z-10 size-8 rounded-lg bg-primary flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-white text-lg font-black">
                    arrow_downward
                  </span>
                </div>
              </a>
              <div className="mt-8 pt-8 border-t border-black/5 w-full flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <span>v1.0.4.stable</span>
                <span>~ 16 MB</span>
              </div>
            </div>
          ))}
        </div>
        <section className="mt-32 max-w-4xl mx-auto">
          <div className="bg-[#161726] rounded-[40px] p-12 md:p-16 shadow-2xl relative overflow-hidden border border-black/5">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(to_bottom_left,rgba(255,59,59,0.03),transparent)]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    data_object
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white leading-none">
                    CLI Installation
                  </h3>
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">
                    Preferred for Servers
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-white font-bold text-lg leading-relaxed">
                  Deploy the agent instantly across your Linux infrastructure
                  using our optimized debian package.
                </p>
                <div className="bg-background-dark rounded-2xl p-8 font-mono text-sm shadow-inner group relative">
                  <div className="flex gap-2 absolute top-4 right-6">
                    <div className="size-3 rounded-full bg-red-400 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                    <div className="size-3 rounded-full bg-yellow-400 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                    <div className="size-3 rounded-full bg-green-400 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-white flex items-center gap-3">
                        <span className="text-primary font-black">$</span>
                        <span>
                          sudo dpkg <span className="text-primary">-i</span>{" "}
                          ai-optimizer-v1.0.deb
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 pt-4">
                      <div className="text-white flex items-center gap-3">
                        <span className="text-primary font-black">$</span>
                        <span>
                          sudo apt-get{" "}
                          <span className="text-primary">install</span> -f
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Download;
