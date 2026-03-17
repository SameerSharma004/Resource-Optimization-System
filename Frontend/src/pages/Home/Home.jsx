import React, { useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const Home = () => {
  const howItWorksRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start center", "end center"],
  });
  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div className="bg-black min-h-screen p-4 md:p-6 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section className="bg-white rounded-[40px] min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-50 via-white to-orange-50 opacity-70"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(circle_at_center,rgba(255,59,59,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl pt-10">
          <div className="inline-flex items-center gap-2 text-black px-4 py-1.5 mb-8 text-sm font-medium bg-gray-100/80 backdrop-blur-sm border border-black/5 rounded-full shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            AI-Driven Optimization Now Available ✦
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-background-dark font-black leading-[1.1] tracking-tight">
            Build Faster <br />
            Optimize with{" "}
            <span className="text-primary italic font-serif">Confidence</span>
          </h1>
          <p className="text-gray-500 mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Eliminate system bottlenecks with predictive AI. Monitor
            kernel-level performance and let our neural engine suggest
            optimizations before they become critical.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex rounded-full overflow-hidden shadow-2xl shadow-primary/20 group hover:scale-105 transition-transform duration-300">
              <Link
                to="/dashboard"
                className="bg-background-dark  text-white text-base font-bold flex items-center"
              >
                <div className="px-8 py-4 bg-primary rounded-full">
                  Get Started
                </div>
                <div className="px-5 py-4 flex items-center group-hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-white text-lg group-hover:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </div>
              </Link>
            </div>
            <NavLink
              to="/download"
              className="px-8 py-4 text-base font-bold text-background-dark border border-black/5 rounded-full hover:bg-gray-50 transition-colors"
            >
              Download Agent
            </NavLink>
          </div>
        </div>
      </section>
      <section
        className="mt-6 bg-white rounded-[40px] py-24 px-6 md:px-12"
        id="features"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-background-dark mb-6">
              Features Built for Scale
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
            {[
              {
                icon: "developer_board",
                title: "Kernel Monitoring",
                desc: "Granular real-time tracking of every core and byte allocated with zero-overhead collection.",
              },
              {
                icon: "psychology",
                title: "Neural Prediction",
                desc: "AI analysis of your system patterns to identify leaks and runaway threads before they crash.",
              },
              {
                icon: "bar_chart",
                title: "Deep Analysis",
                desc: "Deep-dive into stack traces of hungry applications. Know exactly what line drains your power.",
              },
              {
                icon: "timeline",
                title: "Predictive Load",
                desc: "ML-based forecasting that predicts usage spikes based on historical trends and triggers.",
              },
              {
                icon: "notifications_active",
                title: "Instant Alerts",
                desc: "Configurable triggers that push to Slack, Discord, or Webhooks when thresholds are crossed.",
              },
              {
                icon: "dashboard_customize",
                title: "Live Dashboard",
                desc: "Customizable high-fidelity visualization panels that give you the full picture of health.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group p-10 rounded-[32px] bg-gray-50 border border-black/5 hover:border-primary/30 hover:bg-white hover:shadow-2xl transition-all duration-300"
              >
                <div className="size-14 bg-background-dark rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-white transition-colors text-3xl">
                    {f.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        ref={howItWorksRef}
        className="bg-background-dark text-white rounded-[40px] px-8 md:px-20 py-32 mt-6 relative overflow-hidden"
        id="how-it-works"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,59,59,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 max-w-7xl mx-auto">
          <div className="sticky top-32 h-fit">
            <div className="inline-flex items-center gap-2 text-primary px-4 py-1.5 mb-6 text-xs font-black tracking-widest uppercase bg-primary/10 rounded-full border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Workflow
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tight">
              How it{" "}
              <span className="text-primary italic font-serif font-normal">
                Works
              </span>
            </h2>
            <p className="text-gray-400 mb-10 text-xl font-medium leading-relaxed max-w-md">
              Our system bridges the gap between raw hardware data and
              actionable AI intelligence.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-white/5"
            >
              Launch Platform
            </Link>
          </div>
          <div className="relative pt-4">
            <div className="absolute left-[19px] top-[20px] bottom-[115px] w-[2px] bg-white/10 hidden md:block"></div>
            <motion.div
              style={{ height: timelineHeight, top: "20px" }}
              className="absolute left-[19px] w-[2px] bg-primary origin-top shadow-[0_0_15px_rgba(255,59,59,0.5)] max-h-[calc(100%-135px)] hidden md:block"
            />
            <div className="space-y-24 relative">
              {[
                {
                  step: 1,
                  title: "Agent Deployment",
                  desc: "Install our lightweight Python-based agent on your local or remote systems. It securely collects hardware telemetry including CPU thermals, memory allocation, and disk I/O throughput with near-zero system overhead.",
                },
                {
                  step: 2,
                  title: "Neural Processing",
                  desc: "Data is streamed to our centralized engine where the LSTM (Long Short-Term Memory) models process historical trends. The AI identifies performance anomalies and predicts potential system failures before they occur.",
                },
                {
                  step: 3,
                  title: "Optimization Logic",
                  desc: "Receive proactive alerts and AI-driven recommendations via the high-fidelity dashboard. Reallocate resources dynamically or manage runaway processes to maintain peak system efficiency automatically.",
                },
                {
                  step: 4,
                  title: "Enterprise Scaling",
                  desc: "Deploy across massive server clusters with ease. Our architecture supports horizontal scaling, allowing you to manage thousands of nodes while maintaining ultra-low latency in monitoring and AI feedback loops.",
                },
              ].map((item) => (
                <div key={item.step} className="relative flex gap-10">
                  <div className="relative z-10 size-10 min-w-10 rounded-full bg-primary flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(255,59,59,0.3)]">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 font-bold leading-relaxed text-balance">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Meet the Project Team
            </h2>
            <p className="text-gray-500">
              The minds behind the optimization engine.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
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
            ].map((p, i) => (
              <div key={i} className="text-center group">
                <div className="size-20 md:size-24 bg-[#1a1c25] rounded-full mx-auto overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors duration-300">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110"
                  />
                </div>
                <div className="mt-4">
                  <div className="text-white font-bold">{p.name}</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {p.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default Home;
