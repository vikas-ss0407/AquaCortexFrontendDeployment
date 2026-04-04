import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  MapPin, 
  Maximize2, 
  Ruler, 
  Database, 
  Activity, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Globe
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { addHardware } from "../api/hardwareApi";
import { getLocationDetailsByCoords } from "../api/weatherApi";

const initialForm = {
  productName: "",
  wellName: "",
  thingSpeakChannelId: "",
  thingSpeakReadApiKey: "",
  thingSpeakField: "",
  wellDepth: "",
  wellWidth: "",
  latitude: "",
  longitude: ""
};

const AddHardware = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("idle"); 
  const [locationDetails, setLocationDetails] = useState(null);

  useEffect(() => {
    setLocationStatus("detecting");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude.toFixed(6);
          const longitude = position.coords.longitude.toFixed(6);

          setForm((prev) => ({ ...prev, latitude, longitude }));
          const details = await getLocationDetailsByCoords(latitude, longitude);
          setLocationDetails(details);
          setLocationStatus("success");
        },
        () => setLocationStatus("error")
      );
    } else {
      setLocationStatus("error");
    }
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const created = await addHardware(form, user.id);
      navigate(`/product/${created.id}`);
    } catch (apiError) {
      setError(apiError.message || "Unable to add hardware.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:py-12">
        {/* Responsive Sidebar Container */}
        <div className="w-full lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[2.5rem] sm:p-8 lg:p-10"
          >
            <div className="mb-8">
              <h1 className="flex items-center gap-3 text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                <Cpu className="text-amber-400 shrink-0" size={32} />
                Link New Hardware
              </h1>
              <p className="text-emerald-100/70 mt-2 text-sm lg:text-base">Connect your IoT node and well dimensions to the AI network.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 lg:space-y-8">
              {/* SECTION 1: IDENTITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Device Label</label>
                  <div className="relative group">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-amber-400" size={18} />
                    <input name="productName" value={form.productName} onChange={onChange} required placeholder="e.g., North Sector Node"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all placeholder:text-emerald-100/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Well Identity</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-amber-400" size={18} />
                    <input name="wellName" value={form.wellName} onChange={onChange} required placeholder="e.g., Main Borewell"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all placeholder:text-emerald-100/20" />
                  </div>
                </div>
              </div>

              {/* SECTION 2: THINGSPEAK CONFIG */}
              <div className="rounded-3xl border border-emerald-800/50 bg-emerald-950/40 p-5 lg:p-8">
                <h3 className="text-amber-400 font-bold mb-6 flex items-center gap-2 text-sm lg:text-base">
                  <Database size={18} /> IoT Cloud Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="thingSpeakChannelId" value={form.thingSpeakChannelId} onChange={onChange} required placeholder="Channel ID"
                    className="w-full bg-emerald-900/30 border border-emerald-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none" />
                  <input name="thingSpeakReadApiKey" value={form.thingSpeakReadApiKey} onChange={onChange} placeholder="Read API Key"
                    className="w-full bg-emerald-900/30 border border-emerald-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none" />
                  <input name="thingSpeakField" value={form.thingSpeakField} onChange={onChange} required placeholder="Field (1-8)"
                    className="w-full bg-emerald-900/30 border border-emerald-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none" />
                </div>
              </div>

              {/* SECTION 3: PHYSICAL SPECS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Depth (ft)</label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <input name="wellDepth" type="number" value={form.wellDepth} onChange={onChange} required placeholder="30"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Width (ft)</label>
                  <div className="relative">
                    <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <input name="wellWidth" type="number" value={form.wellWidth} onChange={onChange} required placeholder="10"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: GEOLOCATION CARD */}
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="flex flex-col items-start justify-between gap-4 bg-white/5 p-5 lg:flex-row lg:items-center lg:p-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${locationStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      <MapPin size={22} className={locationStatus === 'detecting' ? 'animate-bounce' : ''} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm lg:text-base">Farm Geolocation</h4>
                      <p className="text-[10px] lg:text-xs text-emerald-100/50 uppercase tracking-wider">Predictive Weather Data Point</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border border-emerald-800">
                    {locationStatus === 'detecting' && <Loader2 className="animate-spin text-amber-400" size={12} />}
                    {locationStatus === 'success' && <CheckCircle2 className="text-emerald-400" size={12} />}
                    {locationStatus === 'error' && <AlertCircle className="text-rose-400" size={12} />}
                    <span className={locationStatus === 'success' ? 'text-emerald-400' : 'text-amber-400'}>{locationStatus}</span>
                  </div>
                </div>
                
                {form.latitude && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-white/5 p-5 lg:p-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs lg:text-sm border-b border-white/10 pb-3">
                        <span className="text-emerald-100/50 font-medium">Latitude:</span>
                        <span className="font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">{form.latitude}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs lg:text-sm border-b border-white/10 pb-3">
                        <span className="text-emerald-100/50 font-medium">Longitude:</span>
                        <span className="font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">{form.longitude}</span>
                      </div>
                      {locationDetails && (
                        <div className="mt-4 p-5 rounded-2xl bg-emerald-900/40 text-[11px] lg:text-xs leading-relaxed border border-emerald-800/50 shadow-inner">
                          <p className="text-amber-400 font-black uppercase tracking-widest mb-1">Detected Region</p>
                          <span className="text-white">{locationDetails.village}, {locationDetails.district}, {locationDetails.state}</span>
                        </div>
                      )}
                    </div>
                    <div className="h-48 lg:h-full min-h-[180px] rounded-2xl overflow-hidden border border-emerald-800 shadow-2xl relative">
                      <iframe className="w-full h-full grayscale invert opacity-60" frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(form.longitude)-0.005},${Number(form.latitude)-0.005},${Number(form.longitude)+0.005},${Number(form.latitude)+0.005}&layer=mapnik&marker=${form.latitude},${form.longitude}`} />
                      <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/20 rounded-2xl" />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="text-rose-400 text-sm flex items-center gap-3 bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20 animate-pulse">
                  <AlertCircle size={18} className="shrink-0" /> {error}
                </div>
              )}

              <button disabled={loading} type="submit"
                className="group w-full bg-amber-400 hover:bg-amber-300 disabled:bg-emerald-900 disabled:text-emerald-700 text-amber-950 py-5 rounded-3xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 active:scale-95">
                {loading ? <Loader2 className="animate-spin" /> : <>Deploy Node to Network <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></>}
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AddHardware;