import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageBookings } from './pages/admin/ManageBookings';
import { ManageChalets } from './pages/admin/ManageChalets';
import { ManagePricing } from './pages/admin/ManagePricing';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManagePromotions } from './pages/admin/ManagePromotions';
import { NotFound } from './pages/NotFound';

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
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chalets" element={<Chalets />} />
          <Route path="/chalets/:id" element={<ChaletDetail />} />
          <Route path="/booking/:chaletId" element={<Booking />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation/:bookingId" element={<Confirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
