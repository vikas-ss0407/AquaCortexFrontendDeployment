import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  HelpCircle,
  Leaf,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Add Hardware", to: "/add-hardware", icon: <PlusCircle size={18} /> }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full lg:w-64 lg:sticky lg:top-24 lg:self-start">
      {/* Sidebar Header - Hidden on small screens to save space */}
      <div className="hidden lg:flex items-center gap-2 mb-6 px-2">
        <div className="bg-amber-400/10 p-1.5 rounded-lg">
          <Leaf className="text-amber-400" size={16} />
        </div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/40">
          Farmer Management
        </h2>
      </div>

      <nav className="flex flex-col">
        {/* Main Navigation Grid/List */}
        <ul className="grid grid-cols-1 gap-2 pb-4 sm:grid-cols-2 md:gap-3 lg:flex lg:pb-0 lg:flex-col lg:space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            
            return (
              <li key={item.to} className="relative">
                <Link
                  className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-3 py-3.5 text-xs font-bold transition-all duration-200 active:scale-95 sm:text-sm lg:justify-start lg:gap-3 lg:px-5 lg:py-4 ${
                    active
                      ? "bg-amber-400 text-amber-950 shadow-lg shadow-amber-500/20"
                      : "bg-white/5 text-emerald-100/60 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                  to={item.to}
                >
                  <span className={active ? "text-amber-950" : "text-amber-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                  
                  {/* Desktop Active Indicator */}
                  {active && (
                    <motion.div 
                      layoutId="activeSide"
                      className="hidden lg:block absolute right-2 w-1.5 h-1.5 rounded-full bg-amber-950"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Support Section - Simplified for mobile */}
        <div className="mt-2 grid grid-cols-1 gap-2 border-t border-white/5 pt-4 sm:grid-cols-2 lg:mt-8 lg:block lg:space-y-1 lg:pt-8">
           <Link 
            to="/settings" 
            className={`flex items-center justify-center gap-2 rounded-xl border border-white/5 px-3 py-3 text-[10px] md:text-xs font-bold transition-colors lg:justify-start lg:rounded-xl lg:border-0 lg:px-5 lg:py-3 ${
              location.pathname === "/settings"
                ? "bg-emerald-500/10 text-amber-400"
                : "text-emerald-100/40 hover:text-white hover:bg-white/5"
            }`}
           >
             <Settings size={14} className="sm:size-16" /> Account
           </Link>
           <a
            href="/#contact"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/5 px-3 py-3 text-[10px] md:text-xs font-bold text-emerald-100/40 transition-colors hover:text-white hover:bg-white/5 lg:justify-start lg:rounded-xl lg:border-0 lg:px-5 lg:py-3"
           >
             <HelpCircle size={14} className="sm:size-16" /> Support
           </a>
        </div>
      </nav>

      {/* System Health Card - Desktop Only */}
      <div className="hidden lg:block mt-10 px-2">
        <div className="rounded-3xl bg-emerald-950/40 p-5 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Health</p>
            <Activity size={14} className="text-emerald-500/40" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-[11px] font-bold text-white/70">Cloud Sync Active</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                className="h-full bg-emerald-500/40"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;