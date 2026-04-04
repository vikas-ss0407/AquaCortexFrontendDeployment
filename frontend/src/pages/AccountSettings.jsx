import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Fingerprint, KeyRound, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const fallback = "-";

const AccountSettings = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = user?.password || "";
  const maskedPassword = passwordValue ? "•".repeat(passwordValue.length) : "••••••••";

  const profileFields = [
    { label: "Full Name", value: user?.fullName || user?.displayName || fallback, icon: <User size={18} /> },
    { label: "Email", value: user?.email || fallback, icon: <Mail size={18} /> },
    { label: "User ID", value: user?.uid || user?.id || fallback, icon: <Fingerprint size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100 overflow-x-hidden">
      <Navbar />

      {/* Main Container: Stacked on mobile, side-by-side on LG screens */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:py-12">
        
        {/* Sidebar: Full width on mobile, fixed width on desktop */}
        <div className="w-full lg:w-64">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            /* Responsive padding: p-6 on mobile, p-10 on desktop */
            className="rounded-[2rem] lg:rounded-[2.5rem] border border-white/10 bg-white/10 p-6 lg:p-10 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-white">Account Settings</h1>
              <p className="mt-1 text-xs lg:text-sm text-emerald-100/70">Your current profile details.</p>
            </div>

            {/* Grid: 1 column on mobile, 2 columns on MD+ screens */}
            <div className="grid gap-4 md:grid-cols-2">
              {profileFields.map((field) => (
                <div
                  key={field.label}
                  className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-5 lg:p-6 transition-all hover:border-emerald-500/30"
                >
                  <div className="mb-3 flex items-center gap-2 text-emerald-300">
                    {field.icon}
                    <p className="text-[10px] font-bold uppercase tracking-widest">{field.label}</p>
                  </div>
                  <p className="break-all text-sm lg:text-base font-semibold text-white">
                    {field.value}
                  </p>
                </div>
              ))}

              {/* Password Field */}
              <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-5 lg:p-6 transition-all hover:border-emerald-500/30">
                <div className="mb-3 flex items-center gap-2 text-emerald-300">
                  <KeyRound size={18} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Password</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="break-all text-sm lg:text-base font-semibold text-white">
                    {showPassword ? passwordValue || "" : maskedPassword}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-700 bg-emerald-900/50 px-3 py-2 text-[10px] font-black uppercase tracking-tighter text-emerald-200 hover:border-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showPassword ? "Hide" : "View"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;