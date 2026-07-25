import { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Search, RefreshCw, ChevronDown, ChevronUp, Check, X,
  CalendarDays, Users, CreditCard, Clock, Eye, CheckCircle2,
  XCircle, AlertCircle, Package, MessageSquare, Loader2,
} from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  fetchAdminBookings,
  fetchAdminBookingById,
  approveAdminBooking,
  rejectAdminBooking,
  cancelAdminBooking,
  updateAdminBookingStatus,
  type ApiBooking,
  type AdminBookingsMeta,
} from '../../store/slices/bookingSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { badge: string; dot: string }> = {
  pending:    { badge: 'bg-amber-100   text-amber-700   border-amber-200',   dot: 'bg-amber-400'   },
  confirmed:  { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled:  { badge: 'bg-red-100    text-red-700    border-red-200',    dot: 'bg-red-400'    },
  completed:  { badge: 'bg-blue-100   text-blue-700   border-blue-200',   dot: 'bg-blue-500'   },
  checkedout: { badge: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  rejected:   { badge: 'bg-rose-100   text-rose-700   border-rose-200',   dot: 'bg-rose-500'   },
};

function statusStyle(s: string) {
  return STATUS_COLORS[s.toLowerCase()] ?? { badge: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400' };
}

// Valid status transitions an admin can apply
const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending:    ['Confirmed', 'Cancelled'],
  confirmed:  ['CheckedOut', 'Cancelled'],
  checkedout: ['Completed'],
  completed:  [],
  cancelled:  [],
  rejected:   [],
};

function nextStatuses(current: string): string[] {
  return STATUS_TRANSITIONS[current.toLowerCase()] ?? [];
}

function fDate(d?: string) {
  if (!d) return '—';
  try { return format(parseISO(d), 'dd MMM yy'); } catch { return d; }
}

function fDateTime(d?: string) {
  if (!d) return '—';
  try { return format(parseISO(d), 'dd MMM yy, HH:mm'); } catch { return d; }
}

// ── ReasonModal ───────────────────────────────────────────────────────────────

function ReasonModal({
  title,
  placeholder,
  onConfirm,
  onClose,
  loading,
  required = true,
}: {
  title: string;
  placeholder: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
  required?: boolean;
}) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
        />
        <div className="flex gap-3 pt-1">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            size="sm"
            onClick={() => onConfirm(reason)}
            isLoading={loading}
            disabled={required && !reason.trim()}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── DetailPanel ───────────────────────────────────────────────────────────────

function DetailPanel({ booking }: { booking: ApiBooking }) {
  return (
    <div className="bg-gray-50 border-t border-gray-100 px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">

      {/* Price breakdown — only fields the admin API returns */}
      <div className="space-y-2">
        <p className="font-semibold text-gray-700 flex items-center gap-1.5">
          <CreditCard size={14} className="text-gold-500" /> Price Breakdown
        </p>
        <div className="space-y-1 text-gray-600">
          <Row label="Base"    value={`${booking.baseAmount?.toLocaleString() ?? '—'} KWD`} />
          <Row label="Add-ons" value={`${booking.addOnsAmount?.toLocaleString() ?? '0'} KWD`} />
          {(booking.discountAmount ?? 0) > 0 && (
            <Row label="Discount" value={`-${booking.discountAmount!.toLocaleString()} KWD`} className="text-emerald-600" />
          )}
          <Row label="Tax"     value={`${booking.taxAmount?.toLocaleString() ?? '0'} KWD`} />
          <div className="border-t border-gray-200 pt-1 mt-1">
            <Row label="Total" value={`${booking.totalAmount?.toLocaleString() ?? '—'} KWD`} bold />
          </div>
          {/* optional fields — only shown when guest-facing APIs return them */}
          {booking.paidAmount !== undefined && (
            <Row label="Paid" value={`${booking.paidAmount.toLocaleString()} KWD`} className="text-emerald-600" />
          )}
          {(booking.remainingAmount ?? 0) > 0 && (
            <Row label="Remaining" value={`${booking.remainingAmount!.toLocaleString()} KWD`} className="text-amber-600" />
          )}
        </div>
      </div>

      {/* Add-ons & booking info */}
      <div className="space-y-2">
        <p className="font-semibold text-gray-700 flex items-center gap-1.5">
          <Package size={14} className="text-gold-500" /> Add-ons
        </p>
        {booking.addOns?.length ? (
          <ul className="space-y-1.5">
            {booking.addOns.map((a, i) => (
              <li key={i} className="flex justify-between text-gray-600 text-xs">
                <span>{a.name} ×{a.quantity}</span>
                <span className="font-medium">{a.totalPrice?.toLocaleString() ?? '—'} KWD</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-xs">No add-ons</p>
        )}
        <div className="pt-2 space-y-1 text-gray-600">
          <Row label="Source" value={booking.source || '—'} />
          {booking.paymentType && <Row label="Payment" value={booking.paymentType} />}
          {booking.promotionCode && <Row label="Promo" value={booking.promotionCode} />}
          {(booking.loyaltyPointsEarned ?? 0) > 0 && (
            <Row label="Loyalty earned" value={`${booking.loyaltyPointsEarned} pts`} />
          )}
        </div>
      </div>

      {/* Notes & meta */}
      <div className="space-y-2">
        <p className="font-semibold text-gray-700 flex items-center gap-1.5">
          <MessageSquare size={14} className="text-gold-500" /> Notes & Meta
        </p>
        {booking.specialRequests ? (
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-gray-600 text-xs leading-relaxed">
            <span className="font-medium text-gray-700 block mb-1">Special Requests</span>
            {booking.specialRequests}
          </div>
        ) : (
          <p className="text-gray-400 text-xs">No special requests</p>
        )}
        {booking.cancellationReason && (
          <div className="bg-red-50 rounded-lg border border-red-100 p-3 text-red-700 text-xs leading-relaxed">
            <span className="font-medium block mb-1">Cancellation Reason</span>
            {booking.cancellationReason}
          </div>
        )}
        <div className="space-y-1 text-gray-600 text-xs pt-1">
          <Row label="Created" value={fDateTime(booking.createdAt)} />
          <Row label="User ID" value={booking.userId ? booking.userId.slice(0, 8) + '…' : '—'} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold = false, className = '' }: { label: string; value: string; bold?: boolean; className?: string }) {
  return (
    <div className={`flex justify-between gap-2 text-xs ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-semibold text-gray-900' : ''}>{value}</span>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card padding="md" className={`flex items-center gap-4 border-l-4 ${color}`}>
      <div className="p-2.5 rounded-xl bg-white shadow-sm">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type ModalMode = { type: 'reject' | 'cancel'; bookingId: string } | null;

export function ManageBookings() {
  const dispatch = useAppDispatch();
  const adminBookings = useAppSelector((s) => s.booking.adminBookings);
  const meta          = useAppSelector((s) => s.booking.adminBookingsMeta) as AdminBookingsMeta | null;
  const loading       = useAppSelector((s) => s.booking.adminBookingsLoading);

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page,         setPage]         = useState(1);
  const [expandedId,   setExpandedId]   = useState<string | null>(null);
  const [detailCache,  setDetailCache]  = useState<Record<string, ApiBooking>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [modal,        setModal]        = useState<ModalMode>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(() => {
    (dispatch as any)(fetchAdminBookings({ page, pageSize: 20, status: statusFilter || undefined }));
  }, [dispatch, page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  // stats derived from meta + current page data (approximate from meta)
  const total      = meta?.totalCount ?? 0;
  const pending    = adminBookings.filter((b) => b.status.toLowerCase() === 'pending').length;
  const confirmed  = adminBookings.filter((b) => b.status.toLowerCase() === 'confirmed').length;
  const cancelled  = adminBookings.filter((b) => b.status.toLowerCase() === 'cancelled').length;
  const checkedOut = adminBookings.filter((b) => b.status.toLowerCase() === 'checkedout').length;
  const rejected   = adminBookings.filter((b) => b.status.toLowerCase() === 'rejected').length;

  const filtered = adminBookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.bookingNumber?.toLowerCase().includes(q) ||
      b.guestEmail?.toLowerCase().includes(q) ||
      `${b.guestFirstName} ${b.guestLastName}`.toLowerCase().includes(q) ||
      b.chaletName?.toLowerCase().includes(q)
    );
  });

  async function handleExpand(id: string) {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (detailCache[id]) return;
    setDetailLoading(id);
    const result = await fetchAdminBookingById(id);
    setDetailLoading(null);
    if (result.success && result.data) {
      setDetailCache((prev) => ({ ...prev, [id]: result.data! }));
    }
  }

  async function handleApprove(id: string) {
    setActionLoading(id + '-approve');
    const result = await approveAdminBooking(id);
    setActionLoading(null);
    if (result.success) { toast.success('Booking approved'); load(); }
    else toast.error(result.message || 'Failed to approve');
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setActionLoading(id + '-status');
    const result = await updateAdminBookingStatus(id, newStatus);
    setActionLoading(null);
    if (result.success) { toast.success(`Status updated to ${newStatus}`); load(); }
    else toast.error(result.message || 'Failed to update status');
  }

  async function handleReasonConfirm(reason: string) {
    if (!modal) return;
    setActionLoading(modal.bookingId + '-' + modal.type);
    let result: { success: boolean; message?: string };
    if (modal.type === 'reject') result = await rejectAdminBooking(modal.bookingId, reason);
    else result = await cancelAdminBooking(modal.bookingId, reason);
    setActionLoading(null);
    setModal(null);
    if (result.success) {
      toast.success(modal.type === 'reject' ? 'Booking rejected' : 'Booking cancelled');
      load();
    } else {
      toast.error(result.message || 'Action failed');
    }
  }

  const isPendingAction = (id: string, action: string) => actionLoading === `${id}-${action}`;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total"      value={total}      icon={<CalendarDays size={18} className="text-gold-500" />}    color="border-gold-400"    />
        <StatCard label="Pending"    value={pending}    icon={<Clock size={18} className="text-amber-500" />}          color="border-amber-400"   />
        <StatCard label="Confirmed"  value={confirmed}  icon={<CheckCircle2 size={18} className="text-emerald-500" />} color="border-emerald-400" />
        <StatCard label="Checked Out" value={checkedOut} icon={<CheckCircle2 size={18} className="text-purple-500" />} color="border-purple-400"  />
        <StatCard label="Cancelled"  value={cancelled}  icon={<XCircle size={18} className="text-red-400" />}          color="border-red-400"     />
        <StatCard label="Rejected"   value={rejected}   icon={<AlertCircle size={18} className="text-rose-400" />}    color="border-rose-400"    />
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, booking #, chalet…"
              className="w-full ps-9 pe-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-gray-700"
          >
            <option value="">All Statuses</option>
            {['Pending', 'Confirmed', 'CheckedOut', 'Cancelled', 'Rejected'].map((s) => (
              <option key={s} value={s}>{s === 'CheckedOut' ? 'Checked Out' : s}</option>
            ))}
          </select>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <span className="text-sm text-gray-400 ms-auto">
            {filtered.length} shown · {total} total
          </span>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['Booking / Chalet', 'Guest', 'Dates', 'Amount', 'Status', 'Actions', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && adminBookings.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded-full animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <AlertCircle size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400 text-sm">No bookings found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const s = b.status.toLowerCase();
                  const style = statusStyle(s);
                  const isExpanded = expandedId === b.id;
                  const isPending = s === 'pending';

                  return (
                    <>
                      <tr
                        key={b.id}
                        className={`transition-colors ${isExpanded ? 'bg-gold-50/30' : 'hover:bg-gray-50'}`}
                      >
                        {/* Booking / Chalet */}
                        <td className="px-4 py-3.5">
                          <p className="font-mono text-xs text-gray-400 mb-0.5">{b.bookingNumber}</p>
                          <p className="font-medium text-gray-800 text-sm">{b.chaletName || '—'}</p>
                          <p className="text-xs text-gray-400">{b.chaletType}</p>
                        </td>

                        {/* Guest */}
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-900">{b.guestFirstName} {b.guestLastName}</p>
                          <p className="text-xs text-gray-400">{b.guestEmail}</p>
                          <p className="text-xs text-gray-400">{b.guestPhone}</p>
                        </td>

                        {/* Dates */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-gray-700">
                            <CalendarDays size={12} className="text-gray-400" />
                            <span>{fDate(b.checkInDate)}</span>
                            <span className="text-gray-300">→</span>
                            <span>{fDate(b.checkOutDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                            <Users size={11} />
                            <span>{b.nights} nights · {b.guestCount} guests</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-gray-900">{b.totalAmount?.toLocaleString()} <span className="font-normal text-gray-400 text-xs">KWD</span></p>
                          {(b.remainingAmount ?? 0) > 0 && (
                            <p className="text-xs text-amber-600 mt-0.5">{b.remainingAmount!.toLocaleString()} remaining</p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {b.statusName || b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApprove(b.id)}
                                  disabled={!!actionLoading}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition-colors disabled:opacity-50 border border-emerald-200"
                                >
                                  {isPendingAction(b.id, 'approve')
                                    ? <Loader2 size={11} className="animate-spin" />
                                    : <Check size={11} />}
                                  Approve
                                </button>
                                <button
                                  onClick={() => setModal({ type: 'reject', bookingId: b.id })}
                                  disabled={!!actionLoading}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium transition-colors disabled:opacity-50 border border-rose-200"
                                >
                                  <X size={11} />
                                  Reject
                                </button>
                              </>
                            )}
                            {/* Status change dropdown */}
                            {nextStatuses(b.status).length > 0 && (
                              <div className="relative">
                                {isPendingAction(b.id, 'status') ? (
                                  <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 border border-gray-200">
                                    <Loader2 size={11} className="animate-spin" /> Updating…
                                  </span>
                                ) : (
                                  <select
                                    defaultValue=""
                                    disabled={!!actionLoading}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (!val) return;
                                      e.target.value = '';
                                      if (val === 'Cancelled') {
                                        setModal({ type: 'cancel', bookingId: b.id });
                                      } else {
                                        handleStatusChange(b.id, val);
                                      }
                                    }}
                                    className="appearance-none text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:opacity-50 pr-6"
                                  >
                                    <option value="" disabled>Set status…</option>
                                    {nextStatuses(b.status).map((st) => (
                                      <option key={st} value={st}>
                                        → {st === 'CheckedOut' ? 'Checked Out' : st}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Detail toggle */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleExpand(b.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            {detailLoading === b.id
                              ? <Loader2 size={12} className="animate-spin" />
                              : <Eye size={12} />}
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable detail row */}
                      {isExpanded && (
                        <tr key={b.id + '-detail'}>
                          <td colSpan={7} className="p-0">
                            {detailLoading === b.id ? (
                              <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm bg-gray-50">
                                <Loader2 size={16} className="animate-spin" />
                                Loading detail…
                              </div>
                            ) : (
                              <DetailPanel booking={detailCache[b.id] ?? b} />
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Page {meta.page} of {meta.totalPages} · {meta.totalCount} total
            </p>
            <div className="flex gap-2">
              <button
                disabled={!meta.hasPreviousPage || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <button
                disabled={!meta.hasNextPage || loading}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Reason modal */}
      {modal && (
        <ReasonModal
          title={modal.type === 'reject' ? 'Reject Booking' : 'Cancel Booking'}
          placeholder={
            modal.type === 'reject'
              ? 'Enter rejection reason (required)…'
              : 'Enter cancellation reason (optional)…'
          }
          required={modal.type === 'reject'}
          loading={!!actionLoading}
          onClose={() => setModal(null)}
          onConfirm={handleReasonConfirm}
        />
      )}
    </div>
  );
}
