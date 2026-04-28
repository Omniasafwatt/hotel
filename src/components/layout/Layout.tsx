import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { WHATSAPP_NUMBER } from '../../utils/constants';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent('Hello, I need assistance with Al-Fakhama Resort.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        aria-label="WhatsApp Support"
      >
        <MessageCircle size={22} />
      </a>
    </div>
  );
}
