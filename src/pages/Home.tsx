import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Star, Shield, Clock, Award, ChevronRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { ChaletCard } from '../components/chalets/ChaletCard';
import { Button } from '../components/ui/Button';

import { useAppDispatch } from '../hooks/useAppDispatch';
import { setFilter } from '../store/slices/chaletsSlice';

export function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lang = i18n.language as 'en' | 'ar';

  const chalets = useAppSelector((s) => s.chalets.chalets);
  const featured = chalets.filter((c) => c.featured).slice(0, 6);

  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [searchCheckOut, setSearchCheckOut] = useState('');
  const [searchGuests, setSearchGuests] = useState('2');

  function handleSearch() {
    if (searchCheckIn) dispatch(setFilter({ key: 'checkIn', value: searchCheckIn }));
    if (searchCheckOut) dispatch(setFilter({ key: 'checkOut', value: searchCheckOut }));
    if (searchGuests) dispatch(setFilter({ key: 'guests', value: Number(searchGuests) }));
    navigate('/chalets');
  }

  const features = [
    { icon: Shield, title: { en: 'Secure Booking', ar: 'حجز آمن' }, desc: { en: '100% secure payments with Tap, Deema & Taly', ar: 'مدفوعات آمنة 100% عبر Tap وDeema وTaly' } },
    { icon: Clock, title: { en: 'Flexible Cancellation', ar: 'إلغاء مرن' }, desc: { en: 'Free cancellation up to 7 days before check-in', ar: 'إلغاء مجاني حتى 7 أيام قبل الوصول' } },
    { icon: Award, title: { en: 'Loyalty Rewards', ar: 'مكافآت الولاء' }, desc: { en: 'Earn points with every stay, redeem for discounts', ar: 'اكسب نقاطاً مع كل إقامة وتحويلها لخصومات' } },
    { icon: Star, title: { en: 'Premium Quality', ar: 'جودة متميزة' }, desc: { en: 'Hand-picked luxury chalets with 5-star service', ar: 'شاليهات فاخرة مختارة بعناية مع خدمة 5 نجوم' } },
  ];

  return (
    <div>
      {/* Hero */}
      <section data-aos="fade-up" className="relative min-h-[600px] flex items-center overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://www.pexels.com/download/video/3970964/"
          poster="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/25" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <MapPin size={14} /> Al-Fakhama Resort, Saudi Arabia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t('home.hero_title')}
            </h1>
            <p className="text-navy-200 text-lg mb-10 leading-relaxed">
              {t('home.hero_subtitle')}
            </p>

            {/* Search bar */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">{t('home.hero_search_checkin')}</label>
                  <input
                    type="date"
                    value={searchCheckIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSearchCheckIn(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">{t('home.hero_search_checkout')}</label>
                  <input
                    type="date"
                    value={searchCheckOut}
                    min={searchCheckIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSearchCheckOut(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">{t('home.hero_search_guests')}</label>
                  <select
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {[1,2,4,6,8,10,12,14,16,18,20].map((n) => (
                      <option key={n} value={n}>{n}+ {t('chalets.guests')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={handleSearch} fullWidth size="lg" className="gap-2">
                <Search size={18} />
                {t('home.hero_search_btn')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <div data-aos="fade-up" className="bg-gold-500 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { value: '15', label: { en: 'Chalets & Villas', ar: 'شاليه وفيلا' } },
              { value: '500+', label: { en: 'Happy Guests', ar: 'ضيف سعيد' } },
              { value: '4.8', label: { en: 'Average Rating', ar: 'متوسط التقييم' } },
              { value: '3', label: { en: 'Payment Options', ar: 'خيار دفع' } },
            ].map((s) => (
              <div key={s.value} className="text-white">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-gold-100 text-sm">{s.label[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured chalets */}
      <section data-aos="fade-up" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t('home.featured_title')}</h2>
            <p className="text-gray-500 mt-2">{t('home.featured_subtitle')}</p>
          </div>
          <Link to="/chalets" className="hidden sm:flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium text-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((chalet) => (
            <ChaletCard key={chalet.id} chalet={chalet} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/chalets">
            <Button variant="outline">{t('home.cta_btn')}</Button>
          </Link>
        </div>
      </section>

      {/* Why choose us */}
      <section data-aos="fade-up" className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('home.why_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title.en} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-gold-500" size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title[lang]}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section data-aos="fade-up" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-navy-800 rounded-3xl overflow-hidden relative text-center py-16 px-8">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=60')", backgroundSize: 'cover' }} />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">{t('home.cta_title')}</h2>
            <p className="text-navy-200 mb-8 text-lg">{t('home.cta_subtitle')}</p>
            <Link to="/chalets">
              <Button size="lg">{t('home.cta_btn')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
