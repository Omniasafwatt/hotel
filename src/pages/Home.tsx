import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Star, Shield, Clock, Award, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { ChaletCard } from '../components/chalets/ChaletCard';
import { Button } from '../components/ui/Button';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setFilter } from '../store/slices/chaletsSlice';
import type { ChaletType } from '../types';

export function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lang = i18n.language as 'en' | 'ar';

  const chalets = useAppSelector((s) => s.chalets.chalets);

  const [typeFilter, setTypeFilter] = useState<'all' | ChaletType>('all');
  const [unitFilter, setUnitFilter] = useState<string | null>(null);

  const INVENTORY = [
    { unit: 'A1', type: 'normal'   as ChaletType, id: 'c01', price: 350 },
    { unit: 'A2', type: 'normal'   as ChaletType, id: 'c02', price: 350 },
    { unit: 'A3', type: 'normal'   as ChaletType, id: 'c03', price: 350 },
    { unit: 'A4', type: 'normal'   as ChaletType, id: 'c04', price: 350 },
    { unit: 'B1', type: 'superior' as ChaletType, id: 'c06', price: 500 },
    { unit: 'B2', type: 'superior' as ChaletType, id: 'c07', price: 500 },
    { unit: 'B3', type: 'superior' as ChaletType, id: 'c08', price: 500 },
    { unit: 'B4', type: 'superior' as ChaletType, id: 'c09', price: 500 },
    { unit: 'VIP 1', type: 'vip'   as ChaletType, id: 'c11', price: 750 },
    { unit: 'VIP 2', type: 'vip'   as ChaletType, id: 'c12', price: 750 },
  ];

  const filteredInventory = typeFilter === 'all'
    ? INVENTORY
    : INVENTORY.filter((u) => u.type === typeFilter);

  const displayChalets = (() => {
    if (unitFilter) return chalets.filter((c) => c.id === INVENTORY.find((u) => u.unit === unitFilter)?.id);
    if (typeFilter !== 'all') return chalets.filter((c) => c.type === typeFilter);
    return chalets.filter((c) => c.featured).slice(0, 6);
  })();

  function handleUnitClick(unit: string) {
    if (unitFilter === unit) { setUnitFilter(null); return; }
    setUnitFilter(unit);
    setTypeFilter('all');
  }

  function handleTypeClick(key: 'all' | ChaletType) {
    setTypeFilter(key);
    setUnitFilter(null);
  }

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
          src="/IMG_7006.MP4"
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
              <MapPin size={14} /> GrandeBeach Khairan, Kuwait
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
              { value: '10', label: { en: 'Chalets & Resorts', ar: 'شاليه وفيلا' } },
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t('home.featured_title')}</h2>
            <p className="text-gray-500 mt-2">{t('home.featured_subtitle')}</p>
          </div>
          <Link to="/chalets" className="hidden sm:flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium text-sm">
            {lang === 'ar' ? 'عرض الكل' : 'View All'} <ChevronRight size={16} />
          </Link>
        </div>

        {/* ── Inventory panel ── */}
        <div data-aos="fade-up" className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 mb-10">
          {/* Panel header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {lang === 'ar' ? 'استعرض الوحدات' : 'Browse Units'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {lang === 'ar' ? 'اختر وحدة لعرض تفاصيلها' : 'Select a unit to view its details'}
              </p>
            </div>

            {/* Type filter pills */}
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-full p-1 self-start sm:self-auto">
              {([
                { key: 'all',      label: lang === 'ar' ? 'الكل' : 'All' },
                { key: 'normal',   label: lang === 'ar' ? 'قياسي' : 'Standard' },
                { key: 'superior', label: lang === 'ar' ? 'سوبيريور' : 'Superior' },
                { key: 'vip',      label: 'VIP' },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTypeClick(key)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    typeFilter === key && !unitFilter
                      ? 'text-gold-600 shadow-sm'
                      : 'text-gray-500 hover:text-gold-600 hover:shadow-sm'
                  }`}
                >
                  {typeFilter === key && !unitFilter && (
                    <motion.span
                      layoutId="home-type-pill"
                      className="absolute inset-0 rounded-full bg-navy-800"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Unit chips */}
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {/* Standard row */}
              {filteredInventory.some((u) => u.type === 'normal') && (
                <motion.div
                  key="standard-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {lang === 'ar' ? 'ستاندرد' : 'Standard'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredInventory.filter((u) => u.type === 'normal').map((u) => {
                      const chalet = chalets.find((c) => c.id === u.id);
                      const active = unitFilter === u.unit;
                      return (
                        <button
                          key={u.unit}
                          type="button"
                          onClick={() => handleUnitClick(u.unit)}
                          className={`group flex flex-col items-center justify-center w-[88px] h-[80px] rounded-2xl border-2 transition-all duration-200 ${
                            active
                              ? 'bg-gray-800 border-gray-800 shadow-lg shadow-gray-200'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <span className={`text-xl font-black tracking-tight ${active ? 'text-white' : 'text-gray-700'}`}>{u.unit}</span>
                          <span className={`text-[10px] font-medium mt-0.5 ${active ? 'text-gray-300' : 'text-gray-400'}`}>{u.price} KWD</span>
                          <span className={`text-[9px] mt-0.5 flex items-center gap-0.5 ${active ? 'text-emerald-300' : 'text-emerald-500'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            {chalet?.isAvailable ? (lang === 'ar' ? 'متاح' : 'Avail') : (lang === 'ar' ? 'محجوز' : 'Booked')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Superior row */}
              {filteredInventory.some((u) => u.type === 'superior') && (
                <motion.div
                  key="superior-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-2">
                    {lang === 'ar' ? 'سوبيريور' : 'Superior'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredInventory.filter((u) => u.type === 'superior').map((u) => {
                      const chalet = chalets.find((c) => c.id === u.id);
                      const active = unitFilter === u.unit;
                      return (
                        <button
                          key={u.unit}
                          type="button"
                          onClick={() => handleUnitClick(u.unit)}
                          className={`group flex flex-col items-center justify-center w-[88px] h-[80px] rounded-2xl border-2 transition-all duration-200 ${
                            active
                              ? 'bg-gold-500 border-gold-500 shadow-lg shadow-gold-100'
                              : 'bg-gold-50 border-gold-200 hover:border-gold-400 hover:bg-gold-100'
                          }`}
                        >
                          <span className={`text-xl font-black tracking-tight ${active ? 'text-white' : 'text-gold-700'}`}>{u.unit}</span>
                          <span className={`text-[10px] font-medium mt-0.5 ${active ? 'text-gold-100' : 'text-gold-500'}`}>{u.price} KWD</span>
                          <span className={`text-[9px] mt-0.5 flex items-center gap-0.5 ${active ? 'text-emerald-200' : 'text-emerald-500'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            {chalet?.isAvailable ? (lang === 'ar' ? 'متاح' : 'Avail') : (lang === 'ar' ? 'محجوز' : 'Booked')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* VIP row */}
              {filteredInventory.some((u) => u.type === 'vip') && (
                <motion.div
                  key="vip-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy-600 mb-2">VIP</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredInventory.filter((u) => u.type === 'vip').map((u) => {
                      const chalet = chalets.find((c) => c.id === u.id);
                      const active = unitFilter === u.unit;
                      return (
                        <button
                          key={u.unit}
                          type="button"
                          onClick={() => handleUnitClick(u.unit)}
                          className={`group flex flex-col items-center justify-center w-[88px] h-[80px] rounded-2xl border-2 transition-all duration-200 ${
                            active
                              ? 'bg-navy-800 border-navy-800 shadow-lg shadow-navy-100'
                              : 'bg-navy-50 border-navy-200 hover:border-navy-400 hover:bg-navy-100'
                          }`}
                        >
                          <span className={`text-sm font-black tracking-tight leading-none ${active ? 'text-white' : 'text-navy-700'}`}>{u.unit}</span>
                          <span className={`text-[10px] font-medium mt-0.5 ${active ? 'text-navy-200' : 'text-navy-500'}`}>{u.price} KWD</span>
                          <span className={`text-[9px] mt-0.5 flex items-center gap-0.5 ${active ? 'text-emerald-300' : 'text-emerald-500'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            {chalet?.isAvailable ? (lang === 'ar' ? 'متاح' : 'Avail') : (lang === 'ar' ? 'محجوز' : 'Booked')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatePresence>

          {/* Active filter indicator */}
          {(unitFilter || typeFilter !== 'all') && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {unitFilter
                  ? (lang === 'ar' ? `عرض الوحدة: ${unitFilter}` : `Showing unit: ${unitFilter}`)
                  : (lang === 'ar' ? `عرض: ${typeFilter === 'normal' ? 'ستاندرد' : typeFilter === 'superior' ? 'سوبيريور' : 'VIP'}` : `Showing: ${typeFilter}`)}
              </p>
              <button
                type="button"
                onClick={() => { setUnitFilter(null); setTypeFilter('all'); }}
                className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
              >
                {lang === 'ar' ? 'مسح الفلتر' : 'Clear filter'} ×
              </button>
            </div>
          )}
        </div>



        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayChalets.map((chalet, i) => {
              const directions = [
                { x: -80, y: 0 },
                { x: 0,   y: 60 },
                { x: 80,  y: 0 },
              ];
              const { x, y } = directions[i % 3];
              return (
                <motion.div
                  key={chalet.id}
                  layout
                  initial={{ opacity: 0, x, y }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                >
                  <ChaletCard chalet={chalet} />
                </motion.div>
              );
            })}
          </AnimatePresence>
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
