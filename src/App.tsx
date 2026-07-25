import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { fetchChalets } from './store/slices/chaletsSlice';
import { tryRefreshToken } from './store/slices/authSlice';
import { Toaster } from 'react-hot-toast';
import AOS from "aos";
import 'aos/dist/aos.css';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/Home';
import { Chalets } from './pages/Chalets';
import { ChaletDetail } from './pages/ChaletDetail';
import { Booking } from './pages/Booking';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { MyBookings } from './pages/MyBookings';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageBookings } from './pages/admin/ManageBookings';
import { ManageChalets } from './pages/admin/ManageChalets';
import { ManagePricing } from './pages/admin/ManagePricing';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManagePromotions } from './pages/admin/ManagePromotions';
import { ManageReviews } from './pages/admin/ManageReviews';
import { ManageVerification } from './pages/admin/ManageVerification';
import { Brands } from './pages/Brands';
import { Contact } from './pages/Contact';
import { Reviews } from './pages/Reviews';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { NotFound } from './pages/NotFound';

// Redirects unauthenticated users (including guests) to /login.
// Saves the page they tried to visit so Login can send them back after success.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

function AppRouter() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchChalets());
  }, [dispatch]);

  // Proactively refresh the access token every 10 minutes so photos and API
  // calls never fail mid-session due to token expiration.
  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(() => { void tryRefreshToken(); }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 120,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    AOS.refresh();
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chalets" element={<Chalets />} />
        <Route path="/chalets/:id" element={<ChaletDetail />} />
        <Route path="/booking/:chaletId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/confirmation/:bookingId" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="chalets" element={<ManageChalets />} />
        <Route path="pricing" element={<ManagePricing />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="promotions" element={<ManagePromotions />} />
        <Route path="reviews" element={<ManageReviews />} />
        <Route path="verification" element={<ManageVerification />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'inherit' },
          success: { iconTheme: { primary: '#c9921f', secondary: '#fff' } },
        }}
      />
      <AppRouter />
    </BrowserRouter>
  );
}
