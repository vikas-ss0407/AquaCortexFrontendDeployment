import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  LayoutDashboard, 
  Activity, 
  Trees
} from "lucide-react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getHardware } from "../api/hardwareApi";

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!user?.id) return;
      try {
        const data = await getHardware(user.id);
        setProducts(data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      }
    };
    loadProducts();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:py-12">
        {/* Sidebar: Top on mobile, Left on Desktop */}
        <div className="w-full lg:w-64 lg:sticky lg:top-8">
          <Sidebar />
        </div>

        <main className="flex-1">
          {/* 1. TOP STATS BAR: Grid adjusts for screens */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid grid-cols-1 gap-4"
          >
            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="rounded-2xl bg-amber-400 p-3 text-amber-950 shadow-lg shadow-amber-500/20">
                <LayoutDashboard size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Active Nodes</p>
                <p className="text-2xl font-black text-white">{products.length}</p>
              </div>
            </div>
          </motion.div>

          {/* 2. MAIN HEADER: Stacks on mobile */}
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">Your Farm</h1>
              <p className="text-emerald-100/60 mt-2 text-sm lg:text-base">Real-time water level data and predictive analysis.</p>
            </div>

            <Link
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 text-sm font-black text-amber-950 shadow-xl shadow-amber-500/20 transition hover:bg-amber-300 active:scale-95 md:w-auto"
              to="/add-hardware"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              Add New Product
            </Link>
          </div>

          {/* 3. CONTENT AREA */}
          {products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[2.5rem] border border-dashed border-emerald-400/30 bg-emerald-950/20 p-10 text-center lg:p-20"
            >
              <div className="mx-auto w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 border border-emerald-700">
                <Trees className="text-emerald-400" size={36} />
              </div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">No active sensors detected</h3>
              <p className="mt-3 text-emerald-100/50 max-w-sm mx-auto text-sm">
                Begin your journey by linking an ultrasonic sensor node to your dashboard.
              </p>
              <Link
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-emerald-950 shadow-xl transition hover:bg-emerald-50 active:scale-95"
                to="/add-hardware"
              >
                Connect Your First Well <Plus size={18} />
              </Link>
            </motion.div>
          ) : (
            /* RESPONSIVE GRID: 1 on mobile, 2 on tablet, 2 or 3 on large screens */
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </section>
          )}

          {/* 4. SYSTEM LOG */}
          <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl border border-white/5 bg-black/20 p-5 sm:flex-row sm:items-center">
            <Activity className="text-emerald-500 animate-pulse shrink-0" size={16} />
            <p className="text-[9px] uppercase font-bold tracking-[0.15em] text-emerald-100/40 leading-relaxed sm:text-[10px]">
              ThingSpeak API Latency: 42ms • AI Model Version 3.4 • End-to-End Encrypted
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;