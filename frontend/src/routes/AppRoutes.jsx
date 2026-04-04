import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AddHardware from "../pages/AddHardware";
import AccountSettings from "../pages/AccountSettings";
import Dashboard from "../pages/Dashboard";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import Signup from "../pages/Signup";
import WaterAnalysis from "../pages/WaterAnalysis";
import { useAuth } from "../context/AuthContext";

const AuthLoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center text-sm font-semibold text-slate-600">
      Checking your login session...
    </div>
  );
};

const ProtectedRoute = () => {
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = () => {
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-hardware" element={<AddHardware />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/product/:id/analysis" element={<WaterAnalysis />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
