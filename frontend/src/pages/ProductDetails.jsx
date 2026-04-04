import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Database, 
  Ruler, 
  Maximize, 
  MapPin, 
  Zap, 
  Waves, 
  Cpu, 
  ChevronRight,
  Loader2,
  Wifi,
  WifiOff,
  Clock3,
  Activity,
  Pencil,
  Trash2,
  Save,
  X
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  deleteHardwareById,
  getHardwareById,
  getSensorStatusByHardwareId,
  updateHardwareById
} from "../api/hardwareApi";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [sensorStatus, setSensorStatus] = useState(null);
  const [showAllReadings, setShowAllReadings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [editForm, setEditForm] = useState({
    productName: "",
    wellName: "",
    thingSpeakChannelId: "",
    thingSpeakReadApiKey: "",
    thingSpeakField: "",
    wellDepth: "",
    wellWidth: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!user?.id || !id) return;
      setFetching(true);
      try {
        const data = await getHardwareById(id, user.id);
        setProduct(data);
        setEditForm({
          productName: data?.productName ?? "",
          wellName: data?.wellName ?? "",
          thingSpeakChannelId: data?.thingSpeakChannelId ?? "",
          thingSpeakReadApiKey: data?.thingSpeakReadApiKey ?? "",
          thingSpeakField: data?.thingSpeakField ?? "",
          wellDepth: data?.wellDepth ?? "",
          wellWidth: data?.wellWidth ?? "",
          latitude: data?.latitude ?? "",
          longitude: data?.longitude ?? ""
        });
        const detailSensor = await getSensorStatusByHardwareId(id, 12);
        setSensorStatus(detailSensor || data?.sensor || null);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id, user?.id]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#064e3b] flex items-center justify-center">
        <Loader2 className="text-amber-400 animate-spin" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-white/10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Node Not Found</h2>
            <p className="text-emerald-100/60 mb-8">This hardware may have been decommissioned or moved.</p>
            <Link className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-8 py-3 rounded-2xl font-bold transition-transform active:scale-95" to="/dashboard">
              <ArrowLeft size={18} /> Return to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const specCards = [
    { label: "ThingSpeak ID", value: product.thingSpeakChannelId, icon: <Database size={20} />, color: "text-blue-400" },
    { label: "Data Field", value: `Field ${product.thingSpeakField}`, icon: <Cpu size={20} />, color: "text-purple-400" },
    { label: "Well Depth", value: `${product.wellDepth} ft`, icon: <Ruler size={20} />, color: "text-amber-400" },
    { label: "Well Width", value: `${product.wellWidth} ft`, icon: <Maximize size={20} />, color: "text-emerald-400" },
  ];

  const sensorOn = Boolean(sensorStatus?.on);
  const latestValue = sensorStatus?.latestValue;
  const latestValueText = latestValue !== null && latestValue !== undefined ? `${latestValue}` : "--";
  const updatedAt = sensorStatus?.lastUpdatedAt ? new Date(sensorStatus.lastUpdatedAt) : null;
  const updatedAtText = updatedAt && !Number.isNaN(updatedAt.getTime())
    ? updatedAt.toLocaleString()
    : "No recent update";
  const history = Array.isArray(sensorStatus?.history) ? sensorStatus.history : [];
  const orderedHistory = history.slice().reverse();
  const visibleReadings = showAllReadings ? orderedHistory : orderedHistory.slice(0, 5);

  const onEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSaveEdit = async (e) => {
    e.preventDefault();
    if (!user?.id || !product?.id) {
      return;
    }

    setActionError("");
    setSaving(true);

    try {
      const payload = {
        productName: editForm.productName,
        wellName: editForm.wellName,
        thingSpeakChannelId: editForm.thingSpeakChannelId,
        thingSpeakReadApiKey: editForm.thingSpeakReadApiKey,
        thingSpeakField: editForm.thingSpeakField,
        wellDepth: Number(editForm.wellDepth),
        wellWidth: Number(editForm.wellWidth),
        latitude: Number(editForm.latitude),
        longitude: Number(editForm.longitude)
      };

      const updated = await updateHardwareById(product.id, payload, user.id);
      setProduct(updated);
      setSensorStatus((prev) => updated?.sensor || prev);
      setEditMode(false);
    } catch (error) {
      setActionError(error?.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteProduct = async () => {
    if (!user?.id || !product?.id) {
      return;
    }

    const confirmed = window.confirm("Delete this product? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setActionError("");
    setDeleting(true);

    try {
      await deleteHardwareById(product.id, user.id);
      navigate("/dashboard");
    } catch (error) {
      setActionError(error?.message || "Unable to delete product.");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:py-12">
        <div className="w-full lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1">
          {/* Breadcrumb - Hidden on very small screens or made scrollable */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300/60 mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
            <Link to="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
            <ChevronRight size={10} className="shrink-0" />
            <span className="text-white">Product Specs</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:rounded-[2.5rem] md:p-12"
          >
            {/* Background Decorative Element - Scaled down for mobile */}
            <Waves className="absolute -bottom-20 -right-20 text-white/5 w-40 h-40 md:w-80 md:h-80 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl break-words">{product.productName}</h1>
                  <div className="flex items-center gap-2 mt-3 text-emerald-200">
                    <MapPin size={18} className="text-amber-400" />
                    <span className="text-base font-medium">{product.wellName}</span>
                  </div>
                </div>
                {product.latitude && (
                  <div className="inline-flex w-fit bg-black/20 px-4 py-2 rounded-xl border border-white/5 font-mono text-[10px] md:text-xs text-amber-400">
                    GPS: {Number(product.latitude).toFixed(4)}, {Number(product.longitude).toFixed(4)}
                  </div>
                )}
              </div>

              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActionError("");
                      setEditMode(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-300 transition hover:bg-amber-500/20"
                  >
                    <Pencil size={14} />
                    Update Product
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setActionError("");
                      setEditForm({
                        productName: product?.productName ?? "",
                        wellName: product?.wellName ?? "",
                        thingSpeakChannelId: product?.thingSpeakChannelId ?? "",
                        thingSpeakReadApiKey: product?.thingSpeakReadApiKey ?? "",
                        thingSpeakField: product?.thingSpeakField ?? "",
                        wellDepth: product?.wellDepth ?? "",
                        wellWidth: product?.wellWidth ?? "",
                        latitude: product?.latitude ?? "",
                        longitude: product?.longitude ?? ""
                      });
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/30 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-200 transition hover:bg-white/10"
                  >
                    <X size={14} />
                    Cancel Edit
                  </button>
                )}

                <button
                  type="button"
                  disabled={deleting}
                  onClick={onDeleteProduct}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Delete Product
                </button>
              </div>

              {actionError && (
                <div className="mb-8 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
                  {actionError}
                </div>
              )}

              {editMode && (
                <form onSubmit={onSaveEdit} className="mb-10 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/20 p-5 md:grid-cols-2">
                  <input
                    name="productName"
                    value={editForm.productName}
                    onChange={onEditChange}
                    required
                    placeholder="Device Label"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <input
                    name="wellName"
                    value={editForm.wellName}
                    onChange={onEditChange}
                    required
                    placeholder="Well Name"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <input
                    name="thingSpeakChannelId"
                    value={editForm.thingSpeakChannelId}
                    onChange={onEditChange}
                    required
                    placeholder="ThingSpeak Channel ID"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <input
                    name="thingSpeakField"
                    value={editForm.thingSpeakField}
                    onChange={onEditChange}
                    required
                    placeholder="ThingSpeak Field"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <input
                    name="thingSpeakReadApiKey"
                    value={editForm.thingSpeakReadApiKey}
                    onChange={onEditChange}
                    placeholder="ThingSpeak Read API Key"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400 md:col-span-2"
                  />
                  <input
                    name="wellDepth"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.wellDepth}
                    onChange={onEditChange}
                    required
                    placeholder="Well Depth"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <input
                    name="wellWidth"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.wellWidth}
                    onChange={onEditChange}
                    required
                    placeholder="Well Width"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <input
                    name="latitude"
                    type="number"
                    step="0.000001"
                    value={editForm.latitude}
                    onChange={onEditChange}
                    required
                    placeholder="Latitude"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <input
                    name="longitude"
                    type="number"
                    step="0.000001"
                    value={editForm.longitude}
                    onChange={onEditChange}
                    required
                    placeholder="Longitude"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/60 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />

                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-black text-amber-950 transition hover:bg-amber-300 disabled:opacity-70 md:col-span-2"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </button>
                </form>
              )}

              {/* Specs Grid: 2 columns on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
                {specCards.map((card, i) => (
                  <div key={i} className="rounded-2xl md:rounded-3xl border border-emerald-800/50 bg-emerald-950/40 p-4 transition-all hover:border-emerald-400/30 hover:bg-emerald-950/60">
                    <div className={`${card.color} mb-3`}>{card.icon}</div>
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-emerald-100/40 tracking-widest">{card.label}</p>
                    <p className="mt-1 text-base font-bold text-white md:text-xl">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-10 rounded-[2rem] border border-white/10 bg-black/20 p-6 md:p-8">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/60">Sensor Detail View</p>
                    <h3 className="mt-1 text-xl font-black text-white">Live Sensor Status</h3>
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${sensorOn ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30" : "bg-rose-500/15 text-rose-300 border border-rose-400/30"}`}>
                    {sensorOn ? <Wifi size={14} /> : <WifiOff size={14} />}
                    {sensorOn ? "SENSOR ON" : "SENSOR OFF"}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/40">Latest Sensor Value</p>
                    <p className="mt-2 text-2xl font-black text-white">{latestValueText}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/40">Last Updated</p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-100">
                      <Clock3 size={14} className="text-emerald-300/70" />
                      {updatedAtText}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2 lg:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/40">Data Source</p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
                      <Activity size={14} className="text-amber-300" />
                      ThingSpeak Field {product.thingSpeakField}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/45">Recent Readings</p>
                  {history.length === 0 ? (
                    <p className="text-sm text-emerald-100/60">No recent sensor readings available.</p>
                  ) : (
                    <div className="space-y-2">
                      {visibleReadings.map((entry, idx) => {
                        const entryTime = entry?.timestamp ? new Date(entry.timestamp) : null;
                        const entryTimeText = entryTime && !Number.isNaN(entryTime.getTime())
                          ? entryTime.toLocaleString()
                          : "Unknown time";
                        return (
                          <div key={`${entry.timestamp || "unknown"}-${idx}`} className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2">
                            <span className="text-xs text-emerald-100/70">{entryTimeText}</span>
                            <span className="text-sm font-bold text-white">{entry?.value ?? "--"}</span>
                          </div>
                        );
                      })}

                      {orderedHistory.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setShowAllReadings((prev) => !prev)}
                          className="mt-2 w-full rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-200 transition hover:bg-emerald-500/20"
                        >
                          {showAllReadings ? "Show Less" : "View More"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis CTA - Reorganized for vertical stacking on mobile */}
              <div className="bg-gradient-to-br from-emerald-600/40 to-teal-600/40 border border-emerald-400/30 rounded-[2rem] p-6 md:p-10 flex flex-col lg:flex-row items-center gap-6 md:gap-8">
                <div className="bg-amber-400 p-4 rounded-2xl text-amber-950 shadow-xl shadow-amber-500/20 shrink-0">
                  <Zap size={32} className="fill-amber-950" />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">Predictive Water Intelligence</h3>
                  <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed max-w-xl">
                    Our AI models are synced with your real-time depth sensors and local weather data. 
                    Check if your current water reserves can sustain your next irrigation cycle.
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/product/${product.id}/analysis`)}
                  className="w-full lg:w-auto bg-white hover:bg-emerald-50 text-emerald-950 px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl active:scale-95"
                >
                  Analyze Sufficiency <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex justify-center px-4 text-center">
             <p className="text-[9px] md:text-[10px] text-emerald-100/20 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
               Hardware Link Verified • End-to-End Encrypted Node: {product.id}
             </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;