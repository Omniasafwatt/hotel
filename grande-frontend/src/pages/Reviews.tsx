import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Star, Quote, CheckCircle, Award, Globe, Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaGoogle, FaTripadvisor, FaAirbnb } from 'react-icons/fa';
import { SiBookingdotcom } from 'react-icons/si';
import { format, parseISO } from 'date-fns';

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiReview {
  id: string;
  chaletId: string;
  chaletName: string;
  bookingId: string;
  guestName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

interface PageMeta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ── API ───────────────────────────────────────────────────────────────────────

async function fetchReviews(page: number, pageSize: number, rating?: number) {
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (rating) params.set('rating', String(rating));
    const res = await fetch(`${API_BASE}/api/reviews?${params}`);
    if (!res.ok) return null;
    const json = await res.json() as { data?: { items?: ApiReview[] } & PageMeta };
    const d = json.data;
    return {
      items: d?.items ?? [],
      meta: {
        totalCount: d?.totalCount ?? 0,
        page: d?.page ?? 1,
        pageSize: d?.pageSize ?? pageSize,
        totalPages: d?.totalPages ?? 1,
        hasNextPage: d?.hasNextPage ?? false,
        hasPreviousPage: d?.hasPreviousPage ?? false,
      },
    };
  } catch { return null; }
}

// ── Static external platform data ─────────────────────────────────────────────

const PLATFORMS = [
  { name: 'Google',      icon: FaGoogle,       rating: '4.9', reviews: '312', color: '#4285F4', bg: '#EBF1FB' },
  { name: 'Booking.com', icon: SiBookingdotcom, rating: '9.4', reviews: '187', color: '#003580', bg: '#E6EDF7' },
  { name: 'Airbnb',      icon: FaAirbnb,        rating: '4.97',reviews: '98',  color: '#FF5A5F', bg: '#FFF0F0' },
  { name: 'TripAdvisor', icon: FaTripadvisor,   rating: '5.0', reviews: '64',  color: '#34E0A1', bg: '#EAFAF5' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

function AvatarInitial({ name, size = 44 }: { name: string; size?: number }) {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-gold-100 text-gold-700',
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${colors[idx]}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function fmtDate(iso: string) {
  try { return format(parseISO(iso), 'MMMM yyyy'); } catch { return ''; }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07 },
  }),
};

// ── Reviews page ──────────────────────────────────────────────────────────────

type FilterMode = 'all' | 5 | 4 | 3;

export function Reviews() {
  useTranslation();
  const [reviews, setReviews]     = useState<ApiReview[]>([]);
  const [meta, setMeta]           = useState<PageMeta | null>(null);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [filter, setFilter]       = useState<FilterMode>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchReviews(page, 12, filter === 'all' ? undefined : filter).then((r) => {
      if (r) { setReviews(r.items); setMeta(r.meta); }
      setLoading(false);
    });
  }, [page, filter]);

  // Compute rating breakdown from all loaded reviews
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percent: pct };
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const featured = reviews[0] ?? null;
  const totalCount = meta?.totalCount ?? 0;
  const recommend = reviews.length
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)
    : 98;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-navy-900 py-20 px-4">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/60 to-navy-900/90" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Award size={14} /> Trusted by Thousands of Guests
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              What Our Guests Say
            </h1>
            <p className="text-navy-200 text-lg mb-10 max-w-xl mx-auto">
              Real experiences from real guests who stayed at GrandeBeach Khairan
            </p>
          </motion.div>

          {/* Big rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <div className="text-center">
              <p className="text-7xl font-bold text-white leading-none">{loading ? '…' : avgRating}</p>
              <StarRow rating={5} size={24} />
              <p className="text-navy-300 text-sm mt-2">Overall Rating</p>
            </div>
            <div className="hidden sm:block w-px h-20 bg-navy-600" />
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: loading ? '…' : `${totalCount}+`, label: 'Total Reviews' },
                { value: loading ? '…' : `${recommend}%`,  label: 'Recommend Us' },
                { value: '5★',                              label: 'Avg. Stay Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-gold-400">{s.value}</p>
                  <p className="text-navy-300 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Platform Scores ── */}
      <section className="max-w-5xl mx-auto px-4 mt-10 mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.bg }}>
                <p.icon size={22} style={{ color: p.color }} />
              </div>
              <p className="font-bold text-gray-900 text-xl">{p.rating}</p>
              <StarRow rating={5} size={12} />
              <p className="text-gray-400 text-xs">{p.reviews} reviews on {p.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* ── Featured Review ── */}
        {!loading && featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative bg-navy-900 rounded-3xl overflow-hidden mb-14 p-8 sm:p-12"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <Quote size={48} className="text-gold-500/30 mb-4" />
            <p className="text-white text-xl sm:text-2xl font-light leading-relaxed italic mb-8 relative max-w-3xl">
              "{featured.comment || 'An unforgettable experience at GrandeBeach Khairan.'}"
            </p>
            <div className="flex items-center gap-4">
              <AvatarInitial name={featured.guestName} size={56} />
              <div>
                <p className="text-white font-semibold">{featured.guestName}</p>
                <p className="text-gold-400 text-sm">{featured.chaletName} · {fmtDate(featured.createdAt)}</p>
                <StarRow rating={featured.rating} size={14} />
              </div>
              <div className="ms-auto hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                <CheckCircle size={15} className="text-emerald-400" />
                <span className="text-white text-sm">Verified Guest</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Rating Breakdown + Filters ── */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm w-full lg:w-72 flex-shrink-0">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Rating Breakdown</h3>
            {breakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-3 mb-2.5">
                <span className="text-sm text-gray-500 w-4">{row.stars}</span>
                <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1 * (5 - row.stars) }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-400 w-6">{row.count}</span>
              </div>
            ))}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
              <div className="flex gap-2 flex-wrap">
                {(['all', 5, 4, 3] as FilterMode[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setPage(1); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filter === f
                        ? 'bg-navy-800 text-white shadow'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-navy-300'
                    }`}
                  >
                    {f === 'all' ? 'All' : `${f} Stars`}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Cards ── */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-100 animate-pulse" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-1/2" />
                        <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-1/3" />
                      </div>
                    </div>
                    <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <MessageSquare size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="font-semibold text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {reviews.map((r, i) => (
                    <motion.div
                      key={r.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      onHoverStart={() => setHoveredId(r.id)}
                      onHoverEnd={() => setHoveredId(null)}
                      className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 cursor-default ${
                        hoveredId === r.id ? 'shadow-lg border-gold-300 -translate-y-1' : 'border-gray-100'
                      }`}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <AvatarInitial name={r.guestName} size={44} />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{r.guestName}</p>
                            <p className="text-gray-400 text-xs">{fmtDate(r.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          <CheckCircle size={11} />
                          <span>Verified</span>
                        </div>
                      </div>

                      <StarRow rating={r.rating} size={14} />

                      {r.comment ? (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mt-2">{r.comment}</p>
                      ) : (
                        <p className="text-gray-300 text-sm italic mt-2">No comment provided</p>
                      )}

                      {/* Card footer */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Globe size={12} />
                          <span className="text-gold-600 font-medium truncate max-w-[140px]">{r.chaletName}</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-500">
                          {r.rating}/5
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* ── Pagination ── */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  disabled={!meta.hasPreviousPage || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-500 min-w-[100px] text-center">
                  {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : `Page ${page} of ${meta.totalPages}`}
                </span>
                <button
                  disabled={!meta.hasNextPage || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            {/* ── Refresh ── */}
            {!loading && reviews.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => { setLoading(true); fetchReviews(page, 12, filter === 'all' ? undefined : filter).then((r) => { if (r) { setReviews(r.items); setMeta(r.meta); } setLoading(false); }); }}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-600 transition-colors"
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-gold-500 to-amber-500 rounded-3xl p-10 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Share Your Experience</h2>
          <p className="text-amber-100 mb-6 max-w-md mx-auto">
            Stayed with us? We'd love to hear your story. Your review helps other guests discover their perfect stay.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href="#"
                className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <p.icon size={16} style={{ color: p.color }} />
                Review on {p.name}
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
