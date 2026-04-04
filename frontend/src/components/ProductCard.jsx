import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Droplets, 
  Ruler, 
  MapPin, 
  Zap, 
  ChevronRight, 
  Database,
  Wifi,
  WifiOff,
  Clock
} from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const sensor = product?.sensor || {};
  const sensorOn = Boolean(sensor.on);
  const latestValue = sensor.latestValue;
  const lastUpdated = sensor.lastUpdatedAt ? new Date(sensor.lastUpdatedAt) : null;
  const lastUpdatedText = lastUpdated && !Number.isNaN(lastUpdated.getTime())
    ? lastUpdated.toLocaleString()
    : "No data";
  const readingText = latestValue !== null && latestValue !== undefined
    ? `${latestValue}`
    : "--";

  // Robust navigation handlers
  const goToDetails = () => navigate(`/product/${product.id}`);
  const goToAnalysis = (e) => {
    e.stopPropagation(); 
    navigate(`/product/${product.id}/analysis`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#064e3b]/40 backdrop-blur-md transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-900/30"
    >
      {/* Decorative Glow - Desktop Only */}
      <div className="absolute -right-10 -top-10 h-32 w-32 bg-amber-400/5 blur-3xl group-hover:bg-amber-400/10 transition-colors" />

      {/* Top Section: Branding & Channel */}
      <div className="p-5 md:p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Database size={12} className="text-emerald-400" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-300">
              CH {product.thingSpeakChannelId}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest hidden md:inline ${
                sensorOn ? "text-emerald-400/70" : "text-rose-300/70"
              }`}
            >
              {sensorOn ? "Sensor On" : "Sensor Off"}
            </span>
            <div
              className={`h-2 w-2 rounded-full ${
                sensorOn
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"
                  : "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.55)]"
              }`}
            />
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {product.productName}
        </h3>
        <p className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-emerald-100/40 uppercase tracking-tighter mt-1.5">
          <MapPin size={12} className="text-emerald-500/60" /> {product.wellName}
        </p>
      </div>

      {/* Middle Section: Specs Grid */}
      <div className="grid grid-cols-2 gap-px bg-white/5 mt-6 border-y border-white/5">
        <div className="p-4 flex flex-col items-center justify-center border-r border-white/5 bg-[#064e3b]/20">
          <Ruler size={16} className="text-amber-400 mb-1" />
          <span className="text-[9px] md:text-[10px] font-bold text-emerald-100/30 uppercase tracking-widest">Depth</span>
          <p className="text-base md:text-lg font-black text-white">
            {product.wellDepth}
            <span className="text-[10px] font-normal opacity-50 ml-1">FT</span>
          </p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center bg-[#064e3b]/20">
          <Droplets size={16} className="text-cyan-400 mb-1" />
          <span className="text-[9px] md:text-[10px] font-bold text-emerald-100/30 uppercase tracking-widest">Width</span>
          <p className="text-base md:text-lg font-black text-white">
            {product.wellWidth}
            <span className="text-[10px] font-normal opacity-50 ml-1">FT</span>
          </p>
        </div>
      </div>

      <div className="px-4 py-3 md:px-5 bg-black/15 border-b border-white/5 space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-100/50">
            {sensorOn ? <Wifi size={12} /> : <WifiOff size={12} />}
            Status
          </span>
          <span className={`text-xs font-black ${sensorOn ? "text-emerald-300" : "text-rose-300"}`}>
            {sensorOn ? "ON" : "OFF"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-100/40">Latest Value</p>
            <p className="mt-1 text-sm font-black text-white">{readingText}</p>
          </div>
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-100/40">Last Update</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-100/80">
              <Clock size={11} className="text-emerald-300/70" />
              {lastUpdatedText}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="flex p-3 gap-2 bg-black/20">
        <button 
          onClick={goToDetails}
          className="flex-1 flex items-center justify-center rounded-xl bg-white/5 py-3 md:py-3.5 text-xs font-bold text-white transition hover:bg-white/10 active:scale-95"
        >
          Details
        </button>
        
        <button 
          onClick={goToAnalysis}
          className="flex-[1.2] flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 md:py-3.5 text-xs font-black text-amber-950 transition hover:bg-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/10"
        >
          <Zap size={14} className="fill-amber-950" />
          Analyze
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;