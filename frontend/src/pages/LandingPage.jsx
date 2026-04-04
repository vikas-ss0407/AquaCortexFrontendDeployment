import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Droplets, 
  CloudSun, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Zap,
  Waves,
  Settings,
  Database,
  LineChart,
  Trees,
  Leaf,
  Sprout
} from "lucide-react";
import Navbar from "../components/Navbar";

// Floating Nature Animation Component
const FloatingLeaves = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-emerald-300"
        initial={{ 
          opacity: 0, 
          y: Math.random() * 800 + 400, 
          x: Math.random() * 1200 - 600, 
          scale: Math.random() * 0.5 + 0.5,
          rotate: Math.random() * 360
        }}
        animate={{ 
          opacity: [0.1, 0.5, 0.1], 
          y: -200, 
          rotate: [0, 180, 360] 
        }}
        transition={{ 
          duration: Math.random() * 10 + 20, 
          repeat: Infinity, 
          ease: "linear",
          delay: Math.random() * 10
        }}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      >
        {i % 3 === 0 ? <Leaf size={40} /> : i % 3 === 1 ? <Trees size={35} /> : <Sprout size={30} />}
      </motion.div>
    ))}
  </div>
);

const LandingPage = () => {
  const [activeTech, setActiveTech] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const steps = [
    { 
      s: "01", 
      t: "Install", 
      d: "Mount the Ultrasonic sensor at the well head to track depth in real-time.",
      icon: <Settings className="text-amber-400" /> 
    },
    { 
      s: "02", 
      t: "Sync", 
      d: "Link your ThingSpeak API keys to stream live data to our AI engine.",
      icon: <Database className="text-white" /> 
    },
    { 
      s: "03", 
      t: "Analyze", 
      d: "Input tree count and variety to calculate specific irrigation needs.",
      icon: <Trees className="text-amber-400" /> 
    },
    { 
      s: "04", 
      t: "Predict", 
      d: "Receive water sufficiency ROI and automated irrigation schedules.",
      icon: <LineChart className="text-white" /> 
    }
  ];

  const techCards = [
    {
      icon: <Cpu />,
      title: "IoT Precision",
      d: "ESP32 depth nodes report live bore status with centimeter-level consistency.",
      metric: "1 cm sensing band",
      bullets: ["Continuous stream ingestion", "Signal smoothing against noise"],
      readiness: 96,
      latency: "42 ms"
    },
    {
      icon: <CloudSun />,
      title: "AI Forecasting",
      d: "Hyper-local weather context blends with ETo behavior to forecast irrigation readiness.",
      metric: "Hourly forecast fusion",
      bullets: ["Temperature and humidity aware", "Loss-aware sufficiency scoring"],
      readiness: 92,
      latency: "58 ms"
    },
    {
      icon: <Leaf />,
      title: "Nature Analysis",
      d: "Irrigation logic adapts by crop age, variety, and planned watering window.",
      metric: "Crop-aware rule engine",
      bullets: ["Per-tree demand profiling", "Minimal necessary volume targeting"],
      readiness: 94,
      latency: "49 ms"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] text-slate-100 font-sans selection:bg-amber-400/30 overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <header className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-32">
        <FloatingLeaves />
        <div className="absolute top-0 left-0 w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] bg-amber-400/20 rounded-full blur-[80px] lg:blur-[100px] animate-pulse" />
        
        <main className="relative mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 lg:mb-8 text-xs lg:text-sm font-bold text-amber-900 bg-amber-400 border border-amber-300 rounded-full shadow-lg">
              <Sprout size={16} className="fill-amber-900" />
              <span className="tracking-wide uppercase">Cultivating with AI</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-tight lg:leading-none mb-6 lg:mb-8 text-white">
              Sustaining <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-200">
                Growth
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-emerald-100 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
              Transform guesswork into growth. We merge Ultrasonic well data with predictive AI 
              to ensure your trees always have the optimal water they need.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
              <Link to="/signup" className="group px-8 py-4 lg:px-10 lg:py-5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-2xl font-black shadow-xl shadow-amber-500/30 transition-all duration-300 flex items-center justify-center gap-3">
                Optimize Your Farm <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 lg:mt-0"
          >
            <div className="relative group mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-[2rem] lg:rounded-[3rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 overflow-hidden shadow-2xl">
                <div className="flex justify-between items-start mb-8 lg:mb-12">
                  <div>
                    <p className="text-amber-400 font-bold uppercase tracking-widest text-[10px] lg:text-xs">Live Analytics</p>
                    <h3 className="text-2xl lg:text-3xl font-bold mt-1 text-white">Sensor Node A-1</h3>
                  </div>
                  <div className="h-12 w-12 lg:h-14 lg:w-14 bg-amber-400 rounded-2xl flex items-center justify-center border-4 border-amber-300 shadow-inner">
                    <Droplets className="text-amber-950" size={24} lg:size={30} />
                  </div>
                </div>
                
                <div className="space-y-6 lg:space-y-8">
                  <div>
                    <div className="flex justify-between mb-3 text-xs lg:text-sm">
                      <span className="text-emerald-100">Well Water Level</span>
                      <span className="text-amber-400 font-mono">84% Available</span>
                    </div>
                    <div className="h-3 w-full bg-emerald-950 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "84%" }} 
                        transition={{ duration: 2 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-cyan-300 rounded-full" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                     <div className="bg-emerald-900 p-4 lg:p-5 rounded-2xl border border-emerald-800">
                        <p className="text-[9px] lg:text-[10px] text-emerald-400 uppercase font-bold">Tree Limit</p>
                        <p className="text-xl lg:text-2xl font-bold text-white">1,240</p>
                     </div>
                     <div className="bg-emerald-900 p-4 lg:p-5 rounded-2xl border border-emerald-800">
                        <p className="text-[9px] lg:text-[10px] text-emerald-400 uppercase font-bold">Status</p>
                        <p className="text-xl lg:text-2xl font-bold text-amber-400">High</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </header>

      {/* 2. HOW IT WORKS */}
      <section className="py-20 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-16 lg:mb-24 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-6xl font-black mb-6 text-white leading-tight">Your Four Steps <br /> to <span className="text-amber-400">Certainty</span></h2>
            <p className="text-emerald-100 text-base lg:text-lg">Seamlessly connecting your field infrastructure to our predictive intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400/0 via-amber-400/50 to-amber-400/0 -translate-y-1/2" />
            
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative group bg-emerald-950/70 border border-emerald-800 p-8 rounded-[2rem] lg:rounded-[2.5rem] hover:border-amber-400 transition-all duration-500 shadow-lg"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center font-black z-20">
                  {step.s}
                </div>
                <div className="mt-4 mb-6 w-14 h-14 lg:w-16 lg:h-16 bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 shadow-inner">
                  {React.cloneElement(step.icon, { size: 28 })}
                </div>
                <h4 className="text-xl lg:text-2xl font-bold mb-4 text-white">{step.t}</h4>
                <p className="text-emerald-200 text-sm leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DESIGN & TECHNOLOGY */}
      <section className="py-14 sm:py-18 lg:py-32 bg-emerald-950/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300/70">Interactive Intelligence Stack</p>
            <h3 className="mx-auto mt-3 max-w-2xl text-xl font-black text-white sm:text-3xl">Tap or Hover To Inspect Live Capabilities</h3>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 lg:gap-10">
            {techCards.map((item, i) => (
              <motion.button
                key={i}
                {...fadeInUp}
                type="button"
                onMouseEnter={() => setActiveTech(i)}
                onFocus={() => setActiveTech(i)}
                onClick={() => setActiveTech(i)}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition-all duration-300 sm:rounded-[2rem] sm:p-7 lg:rounded-[2.5rem] lg:p-10 ${
                  activeTech === i
                    ? "bg-gradient-to-b from-emerald-800 to-emerald-900/40 border-amber-400 shadow-[0_14px_40px_rgba(251,191,36,0.18)]"
                    : "bg-gradient-to-b from-emerald-900 to-transparent border-emerald-800"
                }`}
              >
                <motion.div
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/15 blur-3xl"
                  animate={{ opacity: activeTech === i ? 0.8 : 0.25 }}
                  transition={{ duration: 0.35 }}
                />
                <div className="mb-5 flex justify-start text-amber-400">{React.cloneElement(item.icon, { size: 30 })}</div>
                <h3 className="mb-3 text-lg font-bold text-white sm:text-xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-emerald-200">{item.d}</p>
                <div className="mt-4 inline-flex items-center rounded-full border border-emerald-700 bg-emerald-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300 sm:mt-5">
                  {item.metric}
                </div>
                <div className="mt-4 space-y-2 text-left sm:mt-5">
                  {item.bullets.map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      <p className="text-xs text-emerald-100/85">{point}</p>
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            key={activeTech}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-[1.6rem] border border-emerald-700/70 bg-emerald-950/55 p-5 sm:mt-8 sm:rounded-[2rem] sm:p-6 md:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300/70">Focused Module</p>
                <h4 className="mt-2 text-xl font-black text-white sm:text-2xl">{techCards[activeTech].title}</h4>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300/70">Readiness Index</p>
                <p className="mt-2 text-xl font-black text-amber-300 sm:text-2xl">{techCards[activeTech].readiness}%</p>
                <div className="mt-2 h-2 rounded-full bg-emerald-900">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-lime-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${techCards[activeTech].readiness}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300/70">Avg Response</p>
                <p className="mt-2 text-xl font-black text-cyan-300 sm:text-2xl">{techCards[activeTech].latency}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. ADVANTAGES */}
      <section className="py-20 lg:py-32 relative">
        <FloatingLeaves />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="bg-amber-400 rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-20 lg:flex items-center gap-16 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 opacity-10 text-amber-950 hidden lg:block"><Waves size={500} /></div>
            <div className="lg:w-1/2 relative z-10 text-amber-950 text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-black mb-8 leading-tight">Cultivating a Smarter Future.</h2>
              <div className="space-y-4 font-bold text-sm lg:text-base">
                {["Increase yield by optimizing water.", "Protect water table health.", "Save hours of monitoring labor."].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 justify-center lg:justify-start">
                    <CheckCircle2 size={20} className="text-green-800 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0 relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-950 p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-4 border-green-900 text-white shadow-xl text-center">
                <p className="text-3xl lg:text-4xl font-black text-amber-400">100%</p>
                <p className="text-[10px] uppercase font-bold tracking-widest mt-2">Data Integrity</p>
              </div>
              <div className="bg-green-800 p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-green-700 text-amber-950 flex flex-col items-center justify-center text-center">
                <Droplets size={32} className="mb-2" />
                <p className="text-sm font-bold leading-tight">Zero Waste Irrigation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT */}
      <section id="contact" className="py-20 lg:py-32 border-t border-emerald-800">
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-black mb-6 lg:mb-8 text-white">Let's Connect your <br /> <span className="text-amber-400">Infrastructure</span></h2>
              <p className="text-emerald-100 text-base lg:text-lg mb-10">Contact our agritech specialists to map out your digital transformation.</p>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-amber-400 font-bold bg-emerald-950 p-4 rounded-full w-fit mx-auto lg:mx-0">
                <Mail size={20} />
                <span className="text-sm lg:text-base">support@agriwell-ai.com</span>
              </div>
            </div>
            
            <form className="bg-white p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] border border-slate-100 space-y-4 shadow-2xl">
              <p className="text-xs lg:text-sm font-bold text-amber-900 uppercase tracking-widest mb-2 text-center lg:text-left">Request technical support</p>
              <input type="text" placeholder="Name" className="w-full p-4 lg:p-5 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl focus:outline-none focus:border-amber-400 text-amber-950" />
              <input type="email" placeholder="Email" className="w-full p-4 lg:p-5 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl focus:outline-none focus:border-amber-400 text-amber-950" />
              <textarea placeholder="Your requirements..." rows="4" className="w-full p-4 lg:p-5 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl focus:outline-none focus:border-amber-400 text-amber-950"></textarea>
              <button className="w-full py-4 lg:py-5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl lg:rounded-2xl transition-all shadow-lg shadow-amber-500/20">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-emerald-400 border-t border-emerald-800 font-medium px-6">
        <p className="text-sm lg:text-base">© 2026 AquaCortex Irrigation Planner. Roots in Data.</p>
      </footer>
    </div>
  );
};

export default LandingPage;