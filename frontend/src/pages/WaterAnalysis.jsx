import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, 
  Trees, 
  Calendar, 
  CloudSun, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Waves, 
  Loader2,
  ChevronLeft
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getHardwareById } from "../api/hardwareApi";
import { getPrediction } from "../api/predictionApi";

const getLocalDateTimeMin = () => {
  const now = new Date();
  const nextMinute = new Date(now.getTime() + 60 * 1000);
  nextMinute.setSeconds(0, 0);

  const year = nextMinute.getFullYear();
  const month = String(nextMinute.getMonth() + 1).padStart(2, "0");
  const day = String(nextMinute.getDate()).padStart(2, "0");
  const hours = String(nextMinute.getHours()).padStart(2, "0");
  const minutes = String(nextMinute.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const WaterAnalysis = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    irrigationStart: "",
    treeCount: "",
    litersPerTree: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const minIrrigationStart = getLocalDateTimeMin();

  useEffect(() => {
    const load = async () => {
      if (!user?.id || !id) return;
      const data = await getHardwareById(id, user.id);
      setProduct(data);
    };
    load();
  }, [id, user?.id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "irrigationStart") {
      setError("");
    }
  };

  const onAnalyze = async (e) => {
    e.preventDefault();
    if (!product) return;

    if (!form.irrigationStart || form.irrigationStart < minIrrigationStart) {
      setError("Select today or a future date and time.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const prediction = await getPrediction({
        ...form,
        treeCount: Number(form.treeCount),
        litersPerTree: Number(form.litersPerTree),
        wellDepth: product.wellDepth,
        wellWidth: product.wellWidth,
        latitude: product.latitude,
        longitude: product.longitude,
        thingSpeakChannelId: product.thingSpeakChannelId,
        thingSpeakReadApiKey: product.thingSpeakReadApiKey,
        thingSpeakField: product.thingSpeakField
      });
      setResult(prediction);
    } catch (apiError) {
      setError(apiError.message || "Prediction engine offline.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#064e3b] flex items-center justify-center p-6 text-center">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-sm w-full">
          <p className="text-emerald-100/60 mb-6">Device synchronization failed.</p>
          <Link className="block w-full bg-amber-400 text-amber-950 px-6 py-3 rounded-xl font-bold" to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:py-10 lg:flex-row">
        <div className="w-full lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link to={`/product/${id}`} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-black leading-tight text-white sm:text-2xl md:text-3xl">Sufficiency Analysis</h1>
              <p className="text-[10px] md:text-xs text-emerald-100/60 uppercase tracking-widest mt-0.5">
                Node: <span className="text-amber-400">{product.productName}</span>
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Input Form Card */}
            <div className="lg:col-span-5 order-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:rounded-[2.5rem] md:p-8">
                <h3 className="text-base md:text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="text-amber-400" size={20} /> Irrigation Schedule
                </h3>
                
                <form className="space-y-5" onSubmit={onAnalyze}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Planned Start</label>
                    <input className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-amber-400 transition-all text-sm" 
                      name="irrigationStart" onChange={onChange} required type="datetime-local" min={minIrrigationStart} step="60" value={form.irrigationStart} />
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Tree Count</label>
                      <div className="relative">
                        <Trees className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-11 pr-4 py-3.5 text-white outline-none focus:border-amber-400 text-sm" 
                          name="treeCount" onChange={onChange} required type="number" placeholder="40" value={form.treeCount} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Liters / Tree</label>
                      <div className="relative">
                        <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-11 pr-4 py-3.5 text-white outline-none focus:border-amber-400 text-sm" 
                          name="litersPerTree" onChange={onChange} required type="number" placeholder="50" value={form.litersPerTree} />
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-amber-950 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 disabled:opacity-50 mt-2"
                    disabled={loading} type="submit">
                    {loading ? <Loader2 className="animate-spin" /> : <>Run AI Analysis <ArrowRight size={18} /></>}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Results Display Area */}
            <div className="lg:col-span-7 order-2">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 md:space-y-6">
                    {/* Main Verdict Hero */}
                    <div className={`relative overflow-hidden rounded-[2rem] border p-6 md:rounded-[2.5rem] md:p-8 ${result.isSufficient ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'}`}>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          {result.isSufficient ? <CheckCircle size={28} className="md:size-32" /> : <AlertTriangle size={28} className="md:size-32" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">AI Verdict</span>
                        </div>
                        <h2 className="mb-2 text-xl font-black leading-tight sm:text-2xl md:text-3xl">{result.message}</h2>
                        <p className="text-xs md:text-sm opacity-90">Based on current storage and predicted environmental losses.</p>
                      </div>
                      <Waves className="absolute -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 opacity-20 rotate-12 pointer-events-none" />
                    </div>

                    {/* Intelligence Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Weather Card */}
                      <div className="bg-sky-500/10 border border-sky-500/20 rounded-[1.5rem] md:rounded-3xl p-5 md:p-6">
                        <div className="flex items-center gap-2 text-sky-400 mb-4">
                          <CloudSun size={18} />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest">Climate Forecast</h4>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xl md:text-2xl font-black">{result.temperature}°C</p>
                            <p className="text-[9px] text-sky-400/60 uppercase font-bold tracking-tighter">Local Temp</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl md:text-2xl font-black">{result.humidity}%</p>
                            <p className="text-[9px] text-sky-400/60 uppercase font-bold tracking-tighter">Air Humidity</p>
                          </div>
                        </div>
                      </div>

                      {/* Loss Factors Card */}
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-[1.5rem] md:rounded-3xl p-5 md:p-6">
                        <div className="flex items-center gap-2 text-amber-400 mb-4">
                          <AlertTriangle size={18} />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest">Predicted Losses</h4>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs md:text-sm">
                             <span className="text-amber-100/60">Evaporation</span>
                             <span className="font-bold text-amber-400">{result.evaporationLoss} L</span>
                           </div>
                           <div className="flex justify-between text-xs md:text-sm">
                             <span className="text-amber-100/60">Leakage</span>
                             <span className="font-bold text-amber-400">{result.leakageLoss} L</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Data Table */}
                    <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-3xl p-5 md:p-6 backdrop-blur-md">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/60 mb-5">Volumetric Inventory</h4>
                      <div className="space-y-3">
                        <div className="flex flex-col items-start justify-between gap-1 rounded-xl md:rounded-2xl bg-white/5 p-4 sm:flex-row sm:items-center">
                          <span className="text-xs md:text-sm font-medium">Available Supply</span>
                          <span className="text-base md:text-lg font-black text-emerald-400">
                            {result.availableWaterL || Math.round(result.currentStorageLiters || 0)} 
                            <span className="ml-1 text-[9px] font-normal opacity-60">LITERS</span>
                          </span>
                        </div>
                        <div className="flex flex-col items-start justify-between gap-1 rounded-xl md:rounded-2xl border-l-4 border-rose-500 bg-white/5 p-4 sm:flex-row sm:items-center">
                          <span className="text-xs md:text-sm font-medium text-rose-100">Demand Requirement</span>
                          <span className="text-base md:text-lg font-black text-rose-400">
                            {result.requiredWaterL || Math.round(result.requiredLiters || 0)} 
                            <span className="ml-1 text-[9px] font-normal opacity-60">LITERS</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[300px] h-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/10 p-8 text-center text-emerald-100/30 md:rounded-[2.5rem] md:p-12">
                    <Waves size={40} className="mb-4 animate-pulse md:size-48" />
                    <p className="max-w-xs font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Enter irrigation parameters to begin AI computation</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WaterAnalysis;