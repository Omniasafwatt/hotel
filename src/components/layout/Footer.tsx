import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WHATSAPP_NUMBER } from '../../utils/constants';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ف</span>
              </div>
              <div>
                <p className="font-bold text-base">Al-Fakhama</p>
                <p className="text-gold-400 text-xs">الفخامة</p>
              </div>
            </div>
            <p className="text-navy-200 text-sm leading-relaxed">
              Luxury chalets and villas for unforgettable experiences in the heart of Saudi Arabia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gold-400 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/chalets', label: t('nav.chalets') },
                { to: '/login', label: t('nav.login') },
                { to: '/register', label: t('nav.register') },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-navy-200 hover:text-gold-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gold-400 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-navy-200">
                <MapPin size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                Al-Fakhama Resort, Riyadh, KSA
              </li>
              <li className="flex items-center gap-2.5 text-sm text-navy-200">
                <Phone size={15} className="text-gold-400 flex-shrink-0" />
                {WHATSAPP_NUMBER}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-navy-200">
                <Mail size={15} className="text-gold-400 flex-shrink-0" />
                info@alfakhama.com
              </li>
            </ul>
          </div>

          {/* WhatsApp Support */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gold-400 mb-4">Support</h3>
            <p className="text-navy-200 text-sm mb-4">Need help? Chat with us on WhatsApp 24/7.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent('Hello, I need help with my booking at Al-Fakhama Resort.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp Support
            </a>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-sm">© {year} Al-Fakhama Resort. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-navy-400">
            <span>Secure payments by Tap | Deema | Taly</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
