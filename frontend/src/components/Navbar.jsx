import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Droplets, 
  LayoutDashboard, 
  LogOut, 
  User, 
  LogIn, 
  UserPlus,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#064e3b]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* LOGO SECTION */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group relative z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="bg-amber-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-amber-500/20">
            <Droplets size={20} className="text-amber-950 fill-amber-950 md:size-22" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white md:text-xl">
            AquaCortex
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-white/10"
                to="/login"
              >
                <LogIn size={16} />
                Login
              </Link>
              <Link
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-black text-emerald-950 shadow-xl shadow-black/10 transition hover:bg-emerald-50 active:scale-95"
                to="/signup"
              >
                <UserPlus size={16} />
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm font-medium text-emerald-100">
                <div className="bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                  <User size={14} />
                </div>
                <span className="max-w-[120px] truncate">{user?.fullName}</span>
              </div>

              <Link
                className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/30"
                to="/dashboard"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <button
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-100 transition hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30"
                onClick={onLogout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="relative z-50 p-2 text-emerald-100 md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MOBILE DROPDOWN */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-x-0 top-0 z-40 bg-emerald-950 border-b border-white/10 px-4 pb-8 pt-20 shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-4">
                {isAuthenticated && (
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
                    <div className="bg-amber-400 p-2 rounded-xl text-amber-950">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active Farmer</p>
                      <p className="text-lg font-bold text-white">{user?.fullName}</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        onClick={toggleMenu}
                        className="flex items-center gap-3 rounded-2xl p-4 text-lg font-bold text-white bg-white/5 border border-white/10"
                        to="/login"
                      >
                        <LogIn size={20} className="text-amber-400" /> Login
                      </Link>
                      <Link
                        onClick={toggleMenu}
                        className="flex items-center gap-3 rounded-2xl p-4 text-lg font-black text-emerald-950 bg-amber-400"
                        to="/signup"
                      >
                        <UserPlus size={20} /> Get Started
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        onClick={toggleMenu}
                        className="flex items-center gap-3 rounded-2xl p-4 text-lg font-bold text-white bg-white/5 border border-white/10"
                        to="/dashboard"
                      >
                        <LayoutDashboard size={20} className="text-emerald-400" /> Dashboard
                      </Link>
                      <button
                        onClick={onLogout}
                        className="flex items-center gap-3 rounded-2xl p-4 text-lg font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20"
                      >
                        <LogOut size={20} /> Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;