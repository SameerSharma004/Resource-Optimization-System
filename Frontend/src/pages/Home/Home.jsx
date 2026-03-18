import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  useHeroEntrance,
  useScrollFadeUp,
  useStaggerReveal,
  useCountUp,
  useParallax,
} from "../../lib/useAnimations";
const Home = () => {
  const howItWorksRef = useRef(null);
  const dashboardRef = useRef(null);
  const heroRef = useRef(null);
  const heroSectionRef = useRef(null);
  const featuresRef = useRef(null);
  const howHeaderRef = useRef(null);
  const teamRef = useRef(null);

  useHeroEntrance(heroRef);
  useScrollFadeUp(howHeaderRef);
  useStaggerReveal(teamRef, ".team-card");
  const teamHeaderRef = useRef(null);
  useScrollFadeUp(teamHeaderRef);

  const { scrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start center", "end center"],
  });

  const { scrollYProgress: dashScroll } = useScroll({
    target: dashboardRef,
    offset: ["start end", "end start"],
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const springScroll = useSpring(dashScroll, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const dashWidth = useTransform(springScroll, [0, 0.4], ["75%", "95%"]);
  const dashScale = useTransform(springScroll, [0, 0.4], [0.85, 1]);
  const dashRotate = useTransform(springScroll, [0, 0.4], [10, 0]);

  const { scrollYProgress: stackScroll } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end center"],
  });

  const smoothStack = useSpring(stackScroll, { stiffness: 100, damping: 30 });

  const stackYOut = useTransform(smoothStack, [0, 1], [0, 600]);
  const stackScaleOut = useTransform(smoothStack, [0, 1], [1, 0.9]);

  return (
    <div className="bg-background-dark min-h-screen selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section 
        ref={heroSectionRef}
        className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-between z-20"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 50 Q 25 45, 50 50 T 100 50"
              stroke="currentColor"
              fill="none"
              strokeWidth="0.1"
              className="text-primary"
            />
            <path
              d="M0 60 Q 25 55, 50 60 T 100 60"
              stroke="currentColor"
              fill="none"
              strokeWidth="0.1"
              className="text-secondary"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1
                ref={heroRef}
                className="text-6xl md:text-8xl lg:text-9xl text-white font-black leading-[0.85] tracking-tighter"
              >
                Automate. <br />
                Optimize.
                <br />
                <span className="text-primary italic font-serif font-normal">
                  Accelerate.
                </span>
              </h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-20 relative size-24 md:size-32 group cursor-pointer hidden md:flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-colors"></div>
                <div className="absolute inset-0 animate-spin-slow p-2">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full overflow-visible"
                  >
                    <path
                      id="circlePath"
                      d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                      fill="transparent"
                    />
                    <text className="text-[10px] font-black uppercase tracking-[0.2em] fill-white/40">
                      <textPath xlinkHref="#circlePath">
                        EXPLORE MORE • EXPLORE MORE •
                      </textPath>
                    </text>
                  </svg>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl group-hover:translate-y-2 transition-transform">
                  arrow_downward
                </span>
              </motion.div>
            </div>

            <div className="lg:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-md ml-auto"
              >
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
                  Performance should be easy. It's time to say goodbye to
                  bottlenecks & runaway processes that don't work for you.
                </p>
                <div className="flex items-center gap-6">
                  <Link
                    to="/dashboard"
                    className="bg-primary text-black px-10 py-5 rounded-full text-lg font-black tracking-tight hover:scale-105 transition-transform"
                  >
                    Start for free
                  </Link>
                  <Link to="/download" className="rounded-full  px-10 py-5 bg-white/5 border border-white/10 flex items-center justify-center group hover:bg-white/10 transition-colors">
                    <span className="text-white text-lg fill-1 group-hover:scale-110 transition-transform">
                      Download agent
                    </span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="relative -mt-20 lg:-mt-40 -mb-1 z-30 flex justify-center perspective-[3000px]">
          <div
            className="relative w-full max-w-lg aspect-[1.1/1]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {[
              {
                color: "from-[#6367FF] via-[#FFDBFD] to-[#8494FF]",
                label: "System Health",
                desc: "Real-time telemetry from every core and byte allocated, ensuring zero-latency monitoring.",
              },
              {
                color: "from-[#8494FF] via-[#C9BEFF] to-[#FFDBFD]",
                label: "AI Insights",
                desc: "Advanced neural pattern recognition to identify memory leaks and runaway threads before they crash.",
              },
              {
                color: "from-[#C9BEFF] via-[#FFDBFD] to-[#6367FF]",
                label: "Predictive Control",
                desc: "ML-based load forecasting that dynamically manages resources across your infrastructure.",
              },
            ].map((card, i) => {
              
              const xPos = useTransform(
                smoothStack,
                [0, 1],
                [i * 80, (i - 1) * 410],
              );
              const yPos = useTransform(smoothStack, [0, 1], [i * 140, 520]);
              const zPos = useTransform(smoothStack, [0, 1], [i * -350, 0]);
              const rx = useTransform(smoothStack, [0, 1], [55, 0]);
              const rz = useTransform(smoothStack, [0, 1], [-45, 0]);
              const scaleVal = useTransform(smoothStack, [0, 1], [1, 0.75]);

              return (
                <motion.div
                  key={i}
                  style={{
                    x: xPos,
                    y: yPos,
                    z: zPos,
                    rotateX: rx,
                    rotateZ: rz,
                    scale: scaleVal,
                    transformStyle: "preserve-3d",
                  }}
                  className={`absolute inset-0 bg-linear-to-br ${card.color} rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] p-10 flex flex-col justify-between border border-white/20 backdrop-blur-xl cursor-default overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/5 transition-opacity"></div>
                  <div
                    className="relative z-10 flex justify-between items-start"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <div className="text-white/60 font-black text-xs uppercase tracking-widest">
                      Feature 0{i + 1}
                    </div>
                    <span className="material-symbols-outlined text-white/40">
                      arrow_outward
                    </span>
                  </div>
                  <div
                    className="relative z-10 mt-auto"
                    style={{ transform: "translateZ(60px)" }}
                  >
                    <h3 className="text-4xl md:text-5xl font-black text-black leading-[0.9] mb-6 transition-all">
                      {card.label.split(" ").map((word, index) => (
                        <React.Fragment key={index}>
                          {word} <br />
                        </React.Fragment>
                      ))}
                    </h3>
                    <p className="opacity-80 mb-6 text-black/80 font-bold leading-relaxed transition-all duration-500 line-clamp-3">
                      {card.desc}
                    </p>
                    <div className="text-black/40 text-sm font-bold flex items-center gap-2 transition-all">
                      Explore Feature{" "}
                      <span className="material-symbols-outlined text-sm">
                        east
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section
        className="relative z-10 -mt-32 bg-white rounded-[40px] py-24 pt-60 pb-40 px-6 md:px-12"
        id="intelligence"
      >
        <div className="max-w-7xl pt-80 mx-auto" ref={featuresRef}>
          <div className="text-center mb-20">
            
            <h2 className="text-5xl md:text-7xl font-black text-background-dark mb-6 leading-tight">
              Precision <span className="text-primary italic font-serif font-normal text-6xl md:text-8xl">Optimization</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 text-xl font-medium">
              We've replaced traditional monitoring with neural-driven forecasting. 
              Our system identifies leaks and bottlenecks before they impact your performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Resource Recovery",
                val: "32%",
                desc: "Average reduction in idle CPU and memory consumption.",
                icon: "bolt",
              },
              {
                label: "Neural Precision",
                val: "99.4%",
                desc: "LSTM-based prediction accuracy for system anomalies.",
                icon: "psychology",
              },
              {
                label: "Response Speed",
                val: "40ms",
                desc: "Decrease in application latency through dynamic throttling.",
                icon: "speed",
              },
              {
                label: "Fault Shield",
                val: "100%",
                desc: "Automated isolation of runaway process threads.",
                icon: "security",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-8 rounded-[32px] bg-gray-50 border border-black/5 flex flex-col items-center text-center hover:bg-white hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="size-12 bg-background-dark rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {stat.icon}
                  </span>
                </div>
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                  {stat.label}
                </div>
                <div className="text-4xl font-black text-background-dark mb-4 group-hover:scale-110 transition-transform">
                  {stat.val}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-1 bg-linear-to-r from-primary/20 via-primary to-primary/20 rounded-[40px] shadow-2xl overflow-hidden">
            <div className="bg-background-dark rounded-[38px] p-8 md:p-12 overflow-hidden relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
                    Smart Infrastructure <br />
                    Management
                  </h3>
                  <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                    Deploy the agent in seconds and let our AI handle the heavy lifting. 
                    The more data it processes, the more efficient your infrastructure becomes.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-4 bg-primary text-black px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform"
                  >
                    Launch Core Engine
                    <span className="material-symbols-outlined font-black">
                      arrow_forward
                    </span>
                  </Link>
                </div>
                <div className="relative h-64 lg:h-80 bg-white/5 rounded-3xl border border-white/10 overflow-hidden group">
                  <div className="absolute inset-0 p-6 font-mono text-[10px] md:text-xs text-primary/80">
                    <div className="animate-pulse mb-4 opacity-50 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary"></span>
                      LSTM_FORECASTING_ACTIVE
                    </div>
                    {[
                      { t: "09:41:02", m: "ENGINE_SCAN: 32 Cores analyzed. [STABLE]", c: "text-white/40" },
                      { t: "09:41:05", m: "LSTM_ENGINE: Predicting load spike in T-4min.", c: "text-white/40" },
                      { t: "09:41:08", m: "ANOMALY: PID 1241 using excessive buffers.", c: "text-red-400" },
                      { t: "09:41:10", m: "ACTION: Applying predictive throttling...", c: "text-yellow-400" },
                      { t: "09:41:12", m: "SYSTEM_RECOVERY: Efficiency boosted by 14.2%.", c: "text-green-400 font-bold" },
                      { t: "09:41:15", m: "METRIC: Thermal load reduced by 3.1°C.", c: "text-primary" }
                    ].map((log, i) => (
                      <div key={i} className={`mb-2 ${log.c}`}>
                        <span className="opacity-30 mr-2">[{log.t}]</span>
                        {log.m}
                      </div>
                    ))}
                    <div className="absolute bottom-6 right-6 opacity-10">
                      <span className="material-symbols-outlined text-9xl">analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        ref={dashboardRef}
        className="py-32 px-6 bg-background-dark overflow-hidden flex flex-col items-center"
      >
        <motion.div
          style={{
            width: dashWidth,
            scale: dashScale,
            rotateX: dashRotate,
          }}
          className="relative rounded-[48px] bg-white/5 border border-white/10 p-4 md:p-12 overflow-hidden group backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-2 mb-8 px-4">
            <div className="ml-4 px-3 py-1 bg-white/10 rounded-full text-[10px] text-white/40 font-mono tracking-widest uppercase">
              Dashboard Preview
            </div>
          </div>

          <motion.div
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative rounded-[32px] overflow-hidden border border-white/10"
          >
            <img
              src="/src/assets/dashboard.png"
              alt="System Optimization Dashboard"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent pointer-events-none"></div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-1/2 -right-2 hidden lg:block bg-primary p-6 rounded-3xl shadow-2xl max-w-[200px] border border-white/20"
          >
            <span className="material-symbols-outlined text-black text-4xl mb-4 text-center block">
              analytics
            </span>
            <div className="text-black font-black text-xs uppercase tracking-widest mb-2 text-center">
              Live Accuracy
            </div>
            <div className="text-black text-3xl font-black text-center">
              97.4%
            </div>
          </motion.div>
        </motion.div>
        <div className="max-w-7xl mx-auto w-full">
          <div className="mt-20 grid md:grid-cols-3 gap-12 text-center">
            {[
              { label: "Design Language", val: "Bento Grid" },
              { label: "Real-time Update", val: "0.5s Latency" },
              { label: "AI Backend", val: "LSTM Neural" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] mb-3">
                  {stat.label}
                </div>
                <div className="text-white text-3xl font-black">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        ref={howItWorksRef}
        className="bg-white text-background-dark rounded-[40px] px-8 md:px-20 py-32 mt-0 relative overflow-hidden"
        id="how-it-works"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(99,103,255,0.08)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 max-w-7xl mx-auto">
          <div className="sticky top-32 h-fit">
            
            <h2
              ref={howHeaderRef}
              className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tight"
            >
              How it{" "}
              <span className="text-primary italic font-serif font-normal">
                Works
              </span>
            </h2>
            <p className="text-gray-500 mb-10 text-xl font-medium leading-relaxed max-w-md">
              Our system bridges the gap between raw hardware data and
              actionable AI intelligence.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-background-dark text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-black/10"
            >
              Launch Platform
            </Link>
          </div>
          <div className="relative pt-4">
            <div className="absolute left-[19px] top-[20px] bottom-[115px] w-[2px] bg-background-dark/10 hidden md:block"></div>
            <motion.div
              style={{ height: timelineHeight, top: "20px" }}
              className="absolute left-[19px] w-[2px] bg-primary origin-top shadow-[0_0_15px_rgba(99,103,255,0.5)] max-h-[calc(100%-135px)] hidden md:block"
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
                  <div className="relative z-10 size-10 min-w-10 rounded-full bg-primary flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(99,103,255,0.3)]">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 font-bold leading-relaxed text-balance">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-background-dark">
        <div className="max-w-7xl mx-auto" ref={teamRef}>
          <div className="text-center mb-16" ref={teamHeaderRef}>
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
              <div key={i} className="text-center group team-card">
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
