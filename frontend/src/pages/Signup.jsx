import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Sprout, User, Mail, Lock, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

// Consistent Nature Animation
const FloatingNature = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-emerald-300"
        initial={{ opacity: 0, y: 100, rotate: 0 }}
        animate={{ opacity: [0.1, 0.4, 0.1], y: -100, rotate: 360 }}
        transition={{ duration: Math.random() * 10 + 15, repeat: Infinity, ease: "linear" }}
        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
      >
        {i % 2 === 0 ? <Leaf size={30} /> : <Sprout size={25} />}
      </motion.div>
    ))}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signupUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signupUser(form);
      navigate("/add-hardware");
    } catch (apiError) {
      setError(apiError.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans relative flex flex-col overflow-x-hidden">
      <Navbar />
      <FloatingNature />

      <main className="flex-grow flex items-center justify-center px-4 py-10 md:py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Subtle internal glow */}
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8 text-center md:text-left">
                <div className="p-3.5 bg-amber-400 rounded-2xl shadow-lg shadow-amber-500/20 inline-block">
                  <UserPlus className="text-amber-950" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Get Started</h1>
                  <p className="text-emerald-100/70 text-sm mt-1">Join the future of agritech.</p>
                </div>
              </div>

              <form className="space-y-4 md:space-y-5" onSubmit={onSubmit}>
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-emerald-200 uppercase tracking-widest ml-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-amber-400 transition-colors" size={18} />
                    <input
                      className="w-full bg-emerald-950/40 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-emerald-700 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 text-base"
                      id="fullName"
                      name="fullName"
                      onChange={onChange}
                      placeholder="John Doe"
                      required
                      type="text"
                      value={form.fullName}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-emerald-200 uppercase tracking-widest ml-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-amber-400 transition-colors" size={18} />
                    <input
                      className="w-full bg-emerald-950/40 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-emerald-700 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 text-base"
                      id="email"
                      name="email"
                      onChange={onChange}
                      placeholder="farmer@example.com"
                      required
                      type="email"
                      value={form.email}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-emerald-200 uppercase tracking-widest ml-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-amber-400 transition-colors" size={18} />
                    <input
                      className="w-full bg-emerald-950/40 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-emerald-700 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 text-base"
                      id="password"
                      minLength={6}
                      name="password"
                      onChange={onChange}
                      placeholder="Min. 6 characters"
                      required
                      type="password"
                      value={form.password}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-rose-300 text-xs md:text-sm font-medium text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  className="group w-full bg-amber-400 hover:bg-amber-300 disabled:bg-emerald-800 text-amber-950 py-4 md:py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.98]"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-emerald-100/60 text-sm">
                  Already part of the farm?{" "}
                  <Link className="font-bold text-amber-400 hover:text-amber-300 transition-colors" to="/login">
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 text-center text-emerald-400/40 text-[10px] md:text-xs font-medium tracking-[0.2em]">
        © 2026 AQUACORTEX • PRECISION IRRIGATION
      </footer>
    </div>
  );
};

export default Signup;