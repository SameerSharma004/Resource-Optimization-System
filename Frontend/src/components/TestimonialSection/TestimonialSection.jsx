import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SagarBhati from "../../assets/sagarbhati.jpeg";
import SagarSaini from "../../assets/sagarsaini.jpeg";
import SachitKohli from "../../assets/sachitkohli.jpeg";
import SameerSharma from "../../assets/sameersharma.jpeg";

const TESTIMONIALS = [
  {
    name: "Sagar Bhati",
    role: "Team Leader & ML Specialist",
    workDetails: "Project oversight and LSTM Model development. Spearheaded the training and fine-tuning of neural networks for predictive system anomaly detection and behavioral forecasting.",
    highlights: ["Neural Processing", "Predictive Analytics", "System Architecture"],
    img: SagarBhati,
  },
  {
    name: "Sameer Sharma",
    role: "Frontend Lead",
    workDetails: "UI/UX & Branding architect. Crafted the high-fidelity design system and dashboard implementation using React, Tailwind CSS v4, and complex Framer Motion orchestrations.",
    highlights: ["Interactive Design", "Component Library", "UX Strategy"],
    img: SameerSharma,
  },
  {
    name: "Sagar Saini",
    role: "Frontend Supporter",
    workDetails: "Frontend interaction and data visualization expert. Developed the real-time telemetry charting engine and the cross-platform system agent user interface.",
    highlights: ["Data Viz", "Framer Motion", "Real-time UI"],
    img: SagarSaini,
  },
  {
    name: "Sachit Kohli",
    role: "Backend Architect",
    workDetails: "Engineered the core data ingestion pipeline and high-throughput kernel hooks. Focused on zero-latency data streaming and backend performance optimization.",
    highlights: ["Kernel Level", "Data Ingestion", "API Scaling"],
    img: SachitKohli,
  },
  {
    name: "Ravi Kumar",
    role: "Backend Supporter",
    workDetails: "Optimized complex database schemas and telemetry flux protocols. Implemented the horizontal scaling strategy for massive server cluster deployments.",
    highlights: ["DB Optimization", "Telemetry Flux", "Scalability"],
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop",
  },
];

const AUTO_PLAY_DURATION = 8000;

const TestimonialSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTO_PLAY_DURATION);
    return () => clearInterval(timer);
  }, [activeTab, isPaused]);

  return (
    <section className="bg-black py-32 px-6 overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-12 md:mb-24 tracking-tight px-4">
          Project Team Members
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20 lg:mb-32 px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-12 min-h-48 order-2 lg:order-1">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveTab(i)}
                className={`relative cursor-pointer transition-all duration-500 hover:scale-110 ${
                  activeTab === i
                    ? "z-20 scale-110 md:scale-125"
                    : "z-10 grayscale opacity-40 hover:opacity-100 hover:grayscale-0"
                }`}
              >
                <div className="relative size-16 sm:size-20 md:size-28 flex items-center justify-center">
                  {activeTab === i && !isPaused && (
                    <svg className="absolute inset-0 size-full -rotate-90 pointer-events-none z-10">
                      <motion.circle
                        key={`timer-${i}-${activeTab}`}
                        cx="50%"
                        cy="50%"
                        r="48%"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        className="text-primary"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: AUTO_PLAY_DURATION / 1000,
                          ease: "linear",
                        }}
                      />
                    </svg>
                  )}
                  
                  <div
                    className={`size-[90%] rounded-full p-1 transition-colors duration-500 ${
                      activeTab === i ? "bg-transparent" : "bg-white/10"
                    }`}
                  >
                    <div className="size-full rounded-full border-2 border-black overflow-hidden bg-gray-900 shadow-2xl">
                      <img
                        src={t.img}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {activeTab === i && (
                  <motion.div 
                    layoutId="glow"
                    className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-10"
                  />
                )}
              </motion.div>
            ))}
          </div>
          <motion.div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative h-auto min-h-[480px] md:h-[500px] flex flex-col justify-center px-6 md:px-12 bg-white/5 rounded-[32px] md:rounded-[40px] border border-white/10 p-8 md:p-10 backdrop-blur-sm group/card hover:border-primary/40 transition-all duration-500 order-1 lg:order-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">
                       Team Expertise
                    </div>
                    
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-4 group-hover/card:text-primary transition-colors">
                    {TESTIMONIALS[activeTab].name}
                  </h3>
                  <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                    {TESTIMONIALS[activeTab].role}
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-xl text-gray-400 font-medium leading-relaxed">
                  {TESTIMONIALS[activeTab].workDetails}
                </p>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                    Core Contributions
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {TESTIMONIALS[activeTab].highlights.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-2 text-white/80 text-[10px] md:text-sm font-bold bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/10">
                        <span className="size-1 bg-primary rounded-full"></span>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-20 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700 pt-12 border-t border-white/5">
          {[
             { name: "React + Tailwind", icon: "code" },
             { name: "Python Flask", icon: "terminal" },
             { name: "LSTM Neural Model", icon: "psychology" },
             { name: "System Optimization", icon: "bolt" }
          ].map((tech, i) => (
            <div key={i} className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary text-xl">{tech.icon}</span>
               <span className="text-lg md:text-xl font-bold text-white tracking-tighter">
                  {tech.name}
               </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

