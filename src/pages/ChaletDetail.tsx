import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Users, Bed, Bath, Maximize2, ChevronLeft, ExternalLink, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setSelectedChalet } from '../store/slices/chaletsSlice';
import { startBooking } from '../store/slices/bookingSlice';
import { ChaletTypeBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AMENITY_ICONS, CANCELLATION_POLICIES } from '../utils/constants';
import * as LucideIcons from 'lucide-react';

export function ChaletDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lang = i18n.language as 'en' | 'ar';

  const chalet = useAppSelector((s) => s.chalets.chalets.find((c) => c.id === id));
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) dispatch(setSelectedChalet(id));
  }, [id, dispatch]);

  if (!chalet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Chalet not found.</p>
        <Link to="/chalets"><Button className="mt-4" variant="outline">{t('common.back')}</Button></Link>
      </div>
    );
  }

  const masterBedrooms = chalet.bedrooms.filter((b) => b.type === 'master').length;
  const singleBedrooms = chalet.bedrooms.filter((b) => b.type === 'single').length;
  const cancelLabel = CANCELLATION_POLICIES[chalet.cancellationPolicy][lang];

  function handleBook() {
    dispatch(startBooking({ chaletId: chalet!.id }));
    navigate(`/booking/${chalet!.id}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/chalets" className="hover:text-gold-600 flex items-center gap-1">
          <ChevronLeft size={14} /> {t('nav.chalets')}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{chalet.name[lang]}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div data-aos="fade-up" className="space-y-2">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={chalet.images[activeImage]}
                alt={chalet.name[lang]}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {chalet.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-1 aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-gold-500' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ChaletTypeBadge type={chalet.type} />
                  {chalet.featured && <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-medium">★ Featured</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{chalet.name[lang]}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{chalet.location.address[lang]}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star size={18} className="text-gold-500 fill-gold-500" />
                <span className="font-bold text-gray-900 text-xl">{chalet.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({chalet.reviewCount} {t('common.reviews')})</span>
              </div>
            </div>

            {/* Photo gallery */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{lang === 'ar' ? 'معرض الصور' : 'Photo Gallery'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chalet.images.map((img, index) => (
                  <div key={index} className="rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={img}
                      alt={`${chalet.name[lang]} photo ${index + 1}`}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100 mb-4">
              {[
                { icon: Users, val: `${chalet.maxGuests} ${t('chalets.guests')}` },
                { icon: Bed, val: `${masterBedrooms + singleBedrooms} ${t('chalets.bedrooms')}` },
                { icon: Bath, val: `${chalet.bathrooms} ${t('chalets.bathrooms')}` },
                { icon: Maximize2, val: `${chalet.size} ${t('chalets.sqm')}` },
              ].map(({ icon: Icon, val }) => (
                <div key={val} className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Icon size={15} className="text-gold-500" /> {val}
                </div>
              ))}
            </div>

            <p className="text-gray-600 leading-relaxed">{chalet.description[lang]}</p>
          </div>

          {/* Property highlights — exact items from screenshot */}
          <div data-aos="fade-up">
            <div className="flex flex-wrap gap-3">
              {[
                { icon: LucideIcons.Home,              label: 'Houses' },
                { icon: LucideIcons.UtensilsCrossed,   label: 'Kitchen' },
                { icon: LucideIcons.Building2,         label: 'City view' },
                { icon: LucideIcons.TreePine,          label: 'Garden' },
                { icon: LucideIcons.Waves,             label: 'Swimming pool' },
                { icon: LucideIcons.Flame,             label: 'BBQ facilities' },
                { icon: LucideIcons.Wifi,              label: 'Free WiFi' },
                { icon: LucideIcons.Umbrella,          label: 'Terrace' },
                { icon: LucideIcons.LayoutPanelLeft,   label: 'Balcony' },
                { icon: LucideIcons.Car,               label: 'Free parking' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm text-gray-700 font-medium min-w-[140px]"
                >
                  <Icon size={18} className="text-gray-500 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div data-aos="fade-up">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bedrooms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {chalet.bedrooms.map((bed, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="font-medium text-sm text-gray-800 capitalize">
                    {bed.type === 'master' ? '👑 Master' : '🛏 Bedroom'} {i + 1}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {bed.beds} bed{bed.beds > 1 ? 's' : ''}{bed.hasEnsuite ? ' · Ensuite' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div data-aos="fade-up">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {chalet.amenities.map((amenityId) => {
                const iconName = AMENITY_ICONS[amenityId] ?? 'CheckCircle';
                const icons = LucideIcons as unknown as Record<string, React.FC<{ size?: number; className?: string }>>;
                const Icon = icons[iconName] ?? icons['CheckCircle'];
                const label = amenityId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <div key={amenityId} className="flex items-center gap-2 text-sm text-gray-700">
                    <Icon size={15} className="text-gold-500 flex-shrink-0" />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cancellation policy */}
          <div data-aos="fade-up" className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <h2 className="font-semibold text-amber-800 mb-1">Cancellation Policy</h2>
            <p className="text-amber-700 text-sm">{cancelLabel}</p>
          </div>

          {/* External booking */}
          {(chalet.bookingComUrl || chalet.airbnbUrl) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Also available on</h2>
              <div className="flex flex-wrap gap-3">
                {chalet.bookingComUrl && (
                  <a href={chalet.bookingComUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink size={14} /> {t('chalets.check_booking')}
                    </Button>
                  </a>
                )}
                {chalet.airbnbUrl && (
                  <a href={chalet.airbnbUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink size={14} /> {t('chalets.check_airbnb')}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right column – booking card & map */}
        <div className="lg:col-span-1 space-y-4">
          {/* Booking card */}
          <div data-aos="fade-up" className="sticky top-24 z-50 bg-white rounded-2xl border border-gray-200 shadow-md p-5 space-y-4">
            <div>
              <span className="text-3xl font-bold text-gold-600">{chalet.basePrice.toLocaleString()}</span>
              <span className="text-gray-400 text-sm"> {t('common.sar')} {t('common.per_night')}</span>
              <p className="text-xs text-gray-400 mt-0.5">Base price · weekend/seasonal rates apply</p>
            </div>
            <Button fullWidth size="lg" onClick={handleBook}>{t('chalets.book_now')}</Button>
            <p className="text-center text-xs text-gray-400">You won't be charged yet</p>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <ChaletTypeBadge type={chalet.type} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Max guests</span>
                <span className="text-gray-800">{chalet.maxGuests}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rating</span>
                <span className="flex items-center gap-1 text-gray-800">
                  <Star size={12} className="fill-gold-500 text-gold-500" /> {chalet.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div data-aos="fade-up" className="bg-white rounded-2xl border border-gray-200 shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-[300px] flex items-center justify-center text-gray-400">
              <a
                href={`https://www.google.com/maps?q=${chalet.location.lat},${chalet.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 hover:text-gold-600 transition-colors"
              >
                <MapPin size={32} />
                <span className="text-sm">View on Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
