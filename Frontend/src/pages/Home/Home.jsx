import React from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="dark bg-black text-white selection:bg-primary/30 min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:40px_40px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tighter dark:text-white">
              AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Resource Optimization
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Eliminate system bottlenecks with predictive AI. Monitor
              kernel-level performance in real-time and let our neural engine
              suggest optimizations before they become critical.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
              >
                <span className="material-symbols-outlined">rocket_launch</span>
                Get Started Free
              </Link>
              <NavLink to="/download" className="bg-white/5 border cursor-pointer border-white/10 dark:text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3">
                Download Agent
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  System Monitor v1.0.1
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-lg p-4 border border-white/5">
                  <div className="text-xs text-slate-500 mb-1">CPU LOAD</div>
                  <div className="text-2xl font-mono text-primary font-bold">
                    14.2%
                  </div>
                  <div className="mt-4 h-12 w-full bg-primary/5 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 h-full w-1/3 blur-sm"></div>
                    <div className="flex items-end h-full gap-0.5 px-1">
                      <div className="flex-1 bg-primary/40 h-[20%]"></div>
                      <div className="flex-1 bg-primary/40 h-[40%]"></div>
                      <div className="flex-1 bg-primary/40 h-[35%]"></div>
                      <div className="flex-1 bg-primary/40 h-[60%]"></div>
                      <div className="flex-1 bg-primary/60 h-[80%]"></div>
                      <div className="flex-1 bg-primary/40 h-[45%]"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-white/5">
                  <div className="text-xs text-slate-500 mb-1">MEMORY</div>
                  <div className="text-2xl font-mono text-blue-400 font-bold">
                    4.8 GB
                  </div>
                  <div className="mt-4 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-3/4"></div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500">
                    75% capacity reached
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary text-xl">
                    auto_awesome
                  </span>
                  <div>
                    <div className="text-xs font-bold text-primary uppercase">
                      AI Suggestion
                    </div>
                    <div className="text-sm text-slate-300 mt-1">
                      Found zombie process "indexer_v3". Terminating could free
                      1.2GB RAM.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-24 relative bg-slate-900/20" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold dark:text-white mb-4">
              Intelligent Optimization
            </h2>
            <p className="text-slate-500 max-w-2xl">
              Advanced tools built for high-performance cloud infrastructure and
              edge computing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-primary mb-6 text-3xl">
                developer_board
              </span>
              <h3 className="text-xl font-bold dark:text-white mb-3">
                CPU/Memory Monitoring
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Granular real-time tracking of every core, cache hit, and byte
                allocated with zero-overhead collection.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-primary mb-6 text-3xl">
                psychology
              </span>
              <h3 className="text-xl font-bold dark:text-white mb-3">
                AI Recommendations
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Neural analysis of your system patterns to identify memory leaks
                and runaway threads before they cause a crash.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-primary mb-6 text-3xl">
                bar_chart
              </span>
              <h3 className="text-xl font-bold dark:text-white mb-3">
                Process Analysis
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Deep-dive into the stack traces of resource-hungry applications.
                Know exactly what line of code is draining power.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-primary mb-6 text-3xl">
                timeline
              </span>
              <h3 className="text-xl font-bold dark:text-white mb-3">
                Predictive Load
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ML-based forecasting that predicts usage spikes based on
                historical trends and external triggers.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-primary mb-6 text-3xl">
                notifications_active
              </span>
              <h3 className="text-xl font-bold dark:text-white mb-3">
                Smart Alerts
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Configurable triggers that push to Slack, Discord, or Webhooks
                when critical thresholds are crossed.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-primary mb-6 text-3xl">
                dashboard_customize
              </span>
              <h3 className="text-xl font-bold dark:text-white mb-3">
                Interactive Dashboard
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Customizable high-fidelity visualization panels that give you
                the full picture of your infrastructure health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" id="how-it-works">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold dark:text-white mb-4">
              How It Works
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"></div>
            <div className="space-y-24">
              <div className="flex flex-col md:flex-row items-center gap-12 group">
                <div className="md:w-1/2 text-center md:text-right">
                  <h3 className="text-2xl font-bold dark:text-white mb-4">
                    Data Collection
                  </h3>
                  <p className="text-slate-400">
                    Our lightweight binary agent gathers low-level telemetry
                    from the kernel without affecting performance.
                  </p>
                </div>
                <div className="relative z-10 flex-shrink-0 size-12 rounded-full bg-slate-900 border-4 border-primary/20 flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="">
                  <div className="bg-slate-900/50 p-6  flex justify-center items-center rounded-xl border border-white/5">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      cloud_download
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
                <div className="md:w-1/2 text-center md:text-left">
                  <h3 className="text-2xl font-bold dark:text-white mb-4">
                    Stream Processing
                  </h3>
                  <p className="text-slate-400">
                    Data is streamed to our edge nodes for low-latency cleanup
                    and normalization before the AI kicks in.
                  </p>
                </div>
                <div className="relative z-10 flex-shrink-0 size-12 rounded-full bg-slate-900 border-4 border-primary/20 flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="md:w-1/2 flex justify-end">
                  <div className="bg-slate-900/50 p-6  flex justify-center items-center rounded-xl border border-white/5 w-full md:w-auto">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      sync_alt
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-12 group">
                <div className="md:w-1/2 text-center md:text-right">
                  <h3 className="text-2xl font-bold dark:text-white mb-4">
                    AI Analysis Engine
                  </h3>
                  <p className="text-slate-400">
                    Our proprietary neural engine identifies anomalies and
                    cross-references them with million-point datasets.
                  </p>
                </div>
                <div className="relative z-10 flex-shrink-0 size-12 rounded-full bg-slate-900 border-4 border-primary/20 flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="">
                  <div className="bg-slate-900/50 p-6  flex justify-center items-center rounded-xl border border-white/5">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      neurology
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
                <div className="md:w-1/2 text-center md:text-left">
                  <h3 className="text-2xl font-bold dark:text-white mb-4">
                    Actionable Insights
                  </h3>
                  <p className="text-slate-400">
                    Receive precise optimization commands that can be executed
                    manually or automatically via CI/CD.
                  </p>
                </div>
                <div className="relative z-10 flex-shrink-0 size-12 rounded-full bg-slate-900 border-4 border-primary/20 flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                  4
                </div>
                <div className="md:w-1/2 flex justify-end">
                  <div className="bg-slate-900/50  flex justify-center items-center p-6 rounded-xl border border-white/5 w-full md:w-auto">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      auto_fix_high
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold dark:text-white mb-4">
              Meet the Project Team
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                name: "Sachit Kohli",
                role: "Backend Developer",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOhkfB1P3rwFHFuGh0Hodcwrg04-QEYQgyuaO0uAaN1fueNwgiehpvuLKzJRM-ZgcmWcGwwoDKZpRFXldZnEJX7w301Udrqy8kr68gxMTUwoqJiHtNJWXOWEsNUPFt0UK9XJFe6-UPSIc5jZPKaE0vksVOkkuYIRrPGuF3AaDwG5bZ7l4TsABHOBMgZfJRV9uKfiS8f_EeYBo31ErY3hVmm5yci3vyYgPw5o-GKQi_MN0H4OCE2cwYOQfsPc6fj_VBI-JdmmQeFmc",
              },
              {
                name: "Ravi Kumar",
                role: "Backend Developer",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx484pQBLg43fpA4lRKxPNgv9_KqI4yziNwnGl49n8WTKUbiOhZZ0Zn9I9JPdlYlz9dpvxrZMbtyrTe3t259MqCF_h3uqu6sqEVhGEOEeaZfv58VcQN3IGo4PXKKWGmgwDNZpaZQpaPFP6Xz8vb8qYhHqnvq645uyczmy5rNxeUt9ljOxVpEjvtFCYzzL4wG0EZlbnMNnOvMmQusrydM_CAlgkJEbt9_m_PWOthdrW-irB6ffbNy_hsYnSMPPUfkyRpALJr-NTFFA",
              },
              {
                name: "Sameer Sharma",
                role: "Frontend Developer",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx484pQBLg43fpA4lRKxPNgv9_KqI4yziNwnGl49n8WTKUbiOhZZ0Zn9I9JPdlYlz9dpvxrZMbtyrTe3t259MqCF_h3uqu6sqEVhGEOEeaZfv58VcQN3IGo4PXKKWGmgwDNZpaZQpaPFP6Xz8vb8qYhHqnvq645uyczmy5rNxeUt9ljOxVpEjvtFCYzzL4wG0EZlbnMNnOvMmQusrydM_CAlgkJEbt9_m_PWOthdrW-irB6ffbNy_hsYnSMPPUfkyRpALJr-NTFFA",
              },
              {
                name: "Sagar Saini",
                role: "Frontend Developer",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUgndHChHgZ-QYUVHWzfl4WR3QwPy0HL161mIPHGuIAe_pIdvqOd72Y_KDkLESMQdM-1ykISlZN70kHS2Hish2ZSIlcGjLCsmnW9z2VUWMWlDfRbJ9UAYuHZaFkP4Uoz7iDyxAVTfgPWnSWmI2fq-TZc9UlhuRBa4fUoLGXezVA0vAGt2BuCm0BT0eKMfgh6mzsG5QLbRXaibiGG483U9benX9R31Q3EuUDKwnH-I-eQfywR1emn6zIOLF3Q7EiBD1i7w0iTU_7Yw",
              },
              {
                name: "Sagar Bhati",
                role: "LSTM Model Developer",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlwFvYiI_3lRUozp6fFAimHtRR3aiyTcP8HTYTgMXZg7rxRoSaqPk2MftnvuUuSLPFWY-j4HsQe3vy1qhqYUy_4r5F68y9Cpol1UOjrY_BxUXTeoTa-YZrXQIXP71XIFkoWypeQZQbST9OsdfmZmaTIlO2zft_0fjBdtSj1TFENmXNjLpSGF9LFLD_f3YVvKcgrBxxjX-nTzgMZpQvyPfiVMQUk3Jm27jL26-N-pkua7Rcafuj2nvUFifwWTSUk8RFmx68qsOIVfc",
              },
            ].map((person) => (
              <div key={person.name} className="text-center space-y-4">
                <div className="size-24 bg-slate-800 rounded-full mx-auto overflow-hidden relative border-2 border-primary/20">
                  <img
                    alt={person.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    src={person.img}
                  />
                </div>
                <div>
                  <div className="font-bold text-white">{person.name}</div>
                  <div className="text-xs text-slate-500">{person.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-primary p-12 lg:p-20 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:40px_40px]"></div>
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Optimize Your System <br /> with Artificial Intelligence
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 cursor-pointer relative z-20">
              <Link
                to="/dashboard"
                className="bg-white text-primary font-bold px-10 py-5 rounded-2xl hover:bg-slate-100 transition-all text-lg shadow-2xl inline-block"
              >
                Download Agent Now
              </Link>
              <Link to="/signup" className="bg-primary/50 text-white border border-white/20 font-bold px-10 py-5 rounded-2xl hover:bg-primary/60 transition-all text-lg backdrop-blur-md">
                Register Now
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-1/2 bg-primary/20 blur-[120px] rounded-[100%] -z-0"></div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
