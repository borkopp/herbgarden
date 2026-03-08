'use client'

import React, { useMemo, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'
import { updateOrderStatus } from './actions'
import './AdminOrders.css'

// ─── types ────────────────────────────────────────────────────────────────────

type OrderStatus = 'processing' | 'shipping' | 'completed' | 'cancelled' | 'refunded'

type OrderItem = {
    product?: any
    variant?: any
    quantity: number
    id?: string
}

type Order = {
    id: string
    items?: OrderItem[] | null
    shippingAddress?: {
        title?: string | null
        firstName?: string | null
        lastName?: string | null
        company?: string | null
        addressLine1?: string | null
        addressLine2?: string | null
        city?: string | null
        state?: string | null
        postalCode?: string | null
        country?: string | null
        phone?: string | null
    }
    customer?: any
    customerEmail?: string | null
    status?: OrderStatus | null
    amount?: number | null
    currency?: string | null
    updatedAt: string
    createdAt: string
}

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
    processing: 'Во обработка',
    shipping: 'Во достава',
    completed: 'Завршена',
    cancelled: 'Откажана',
    refunded: 'Рефундирана',
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    processing: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', border: '#fde68a' },
    shipping: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6', border: '#bfdbfe' },
    completed: { bg: '#d1fae5', text: '#065f46', dot: '#10b981', border: '#a7f3d0' },
    cancelled: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444', border: '#fecaca' },
    refunded: { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899', border: '#fbcfe8' },
}

const STATUS_OPTIONS: OrderStatus[] = ['processing', 'shipping', 'completed', 'cancelled', 'refunded']

const STATUS_FLOW: Record<string, OrderStatus[]> = {
    processing: ['shipping', 'cancelled'],
    shipping: ['completed', 'cancelled'],
    completed: ['refunded'],
    cancelled: [],
    refunded: [],
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const colors = STATUS_COLORS[status] || { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af', border: '#e5e7eb' }
    return (
        <span className="ao-badge" style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
            <span className="ao-badge-dot" style={{ background: colors.dot }} />
            {STATUS_LABELS[status] || status}
        </span>
    )
}

function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString('mk-MK', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    } catch { return dateStr }
}

function formatAmount(amount?: number | null, currency?: string | null): string {
    if (!amount) return '—'
    return `${amount.toLocaleString('mk-MK')} ${currency || 'MKD'}`
}

function getCustomerName(order: Order): string {
    if (order.customer?.name) return order.customer.name
    if (order.shippingAddress?.firstName || order.shippingAddress?.lastName) {
        return `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim()
    }
    if (order.customerEmail) return order.customerEmail
    return 'Непознат'
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

type ConfirmDialogProps = {
    fromStatus: string
    toStatus: OrderStatus
    customerName: string
    onConfirm: () => void
    onCancel: () => void
    isPending: boolean
}

function ConfirmDialog({ fromStatus, toStatus, customerName, onConfirm, onCancel, isPending }: ConfirmDialogProps) {
    const toColors = STATUS_COLORS[toStatus]
    const isDangerous = toStatus === 'cancelled' || toStatus === 'refunded'

    // Mount into document.body via a portal so position:fixed is never clipped
    // by a parent element with overflow:hidden or a CSS stacking context.
    if (typeof document === 'undefined') return null

    return createPortal(
        <div className="ao-confirm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="ao-confirm-dialog">
                {/* Icon */}
                <div className={`ao-confirm-icon ${isDangerous ? 'ao-confirm-icon-danger' : 'ao-confirm-icon-info'}`}>
                    {isDangerous ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    )}
                </div>

                <h3 className="ao-confirm-title">Промена на статус</h3>
                <p className="ao-confirm-subtitle">Нарачка на <strong>{customerName}</strong></p>

                {/* Status arrow */}
                <div className="ao-confirm-transition">
                    <StatusBadge status={fromStatus} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <StatusBadge status={toStatus} />
                </div>

                {/* Warning note */}
                <div className={`ao-confirm-warning ${isDangerous ? 'ao-confirm-warning-danger' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {isDangerous
                        ? 'Оваа акција е неповратна. Клиентот ќе добие известување по е-пошта.'
                        : 'Клиентот ќе добие известување по е-пошта за промената на статусот.'}
                </div>

                {/* Buttons */}
                <div className="ao-confirm-actions">
                    <button className="ao-confirm-cancel" onClick={onCancel} disabled={isPending}>
                        Откажи
                    </button>
                    <button
                        className={`ao-confirm-proceed ${isDangerous ? 'ao-confirm-proceed-danger' : ''}`}
                        onClick={onConfirm}
                        disabled={isPending}
                        style={!isDangerous ? { background: toColors?.dot, borderColor: toColors?.dot } : undefined}
                    >
                        {isPending ? (
                            <><span className="ao-spinner-sm" />Се менува...</>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Потврди
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

// ─── OrderDetails slide-up panel ──────────────────────────────────────────────

type OrderDetailsProps = {
    order: Order
    onClose: () => void
    onStatusChange: (orderId: string, newStatus: OrderStatus) => void
}

function OrderDetails({ order, onClose, onStatusChange }: OrderDetailsProps) {
    const [isPending, startTransition] = useTransition()
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
    const [pendingConfirm, setPendingConfirm] = useState<OrderStatus | null>(null)

    const currentStatus = order.status || 'processing'
    const nextStatuses = STATUS_FLOW[currentStatus] || []

    const handleStatusClick = (newStatus: OrderStatus) => setPendingConfirm(newStatus)

    const handleConfirm = () => {
        if (!pendingConfirm) return
        const newStatus = pendingConfirm
        setPendingConfirm(null)
        setSelectedStatus(newStatus)
        startTransition(async () => {
            const result = await updateOrderStatus(order.id, newStatus)
            if (result.success) {
                toast.success(`Статусот е сменет во "${STATUS_LABELS[newStatus]}"`, {
                    description: 'Клиентот ќе добие известување по е-пошта.',
                    duration: 4000,
                })
                onStatusChange(order.id, newStatus)
            } else {
                toast.error('Грешка при промена на статус', {
                    description: result.error || 'Обидете се повторно.',
                    duration: 4000,
                })
            }
            setSelectedStatus(null)
        })
    }

    const addr = order.shippingAddress

    return (
        <div className="ao-overlay" onClick={(e) => e.target === e.currentTarget && !pendingConfirm && onClose()}>
            <div className="ao-detail-panel">
                {/* Header */}
                <div className="ao-detail-header">
                    <div className="ao-detail-header-left">
                        <span className="ao-detail-id">#{order.id.slice(-8).toUpperCase()}</span>
                        <StatusBadge status={currentStatus} />
                    </div>
                    <button className="ao-close-btn" onClick={onClose} aria-label="Затвори" disabled={isPending || !!pendingConfirm}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="ao-detail-body">
                    {/* Customer Info */}
                    <div className="ao-section">
                        <div className="ao-section-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Нарачувач
                        </div>
                        <div className="ao-info-grid">
                            <div className="ao-info-item">
                                <span className="ao-info-label">Име</span>
                                <span className="ao-info-value">{getCustomerName(order)}</span>
                            </div>
                            {order.customerEmail && (
                                <div className="ao-info-item">
                                    <span className="ao-info-label">Е-пошта</span>
                                    <a href={`mailto:${order.customerEmail}`} className="ao-info-value ao-link">{order.customerEmail}</a>
                                </div>
                            )}
                            {addr?.phone && (
                                <div className="ao-info-item">
                                    <span className="ao-info-label">Телефон</span>
                                    <a href={`tel:${addr.phone}`} className="ao-info-value ao-link">{addr.phone}</a>
                                </div>
                            )}
                            <div className="ao-info-item">
                                <span className="ao-info-label">Датум</span>
                                <span className="ao-info-value">{formatDate(order.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {addr && (
                        <div className="ao-section">
                            <div className="ao-section-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Адреса за достава
                            </div>
                            <div className="ao-address-card">
                                {(addr.firstName || addr.lastName) && <p className="ao-address-name">{addr.firstName} {addr.lastName}</p>}
                                {addr.company && <p className="ao-address-line">{addr.company}</p>}
                                {addr.addressLine1 && <p className="ao-address-line">{addr.addressLine1}</p>}
                                {addr.addressLine2 && <p className="ao-address-line">{addr.addressLine2}</p>}
                                {(addr.city || addr.postalCode) && (
                                    <p className="ao-address-line">{[addr.postalCode, addr.city].filter(Boolean).join(' ')}</p>
                                )}
                                {addr.country && <p className="ao-address-line">{addr.country}</p>}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                        <div className="ao-section">
                            <div className="ao-section-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                Производи ({order.items.length})
                            </div>
                            <div className="ao-items-list">
                                {order.items.map((item, idx) => {
                                    const product = item.product
                                    const productName = product?.title || 'Производ'
                                    const productImg = product?.gallery?.[0]?.image?.url || product?.gallery?.[0]?.image?.thumbnailURL
                                    const variantLabel = item.variant?.label || null
                                    return (
                                        <div key={item.id || idx} className="ao-item">
                                            {productImg
                                                ? <img src={productImg} alt={productName} className="ao-item-img" />
                                                : (
                                                    <div className="ao-item-img-placeholder">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                                            <polyline points="21,15 16,10 5,21" />
                                                        </svg>
                                                    </div>
                                                )
                                            }
                                            <div className="ao-item-info">
                                                <span className="ao-item-name">{productName}</span>
                                                {variantLabel && <span className="ao-item-variant">{variantLabel}</span>}
                                            </div>
                                            <span className="ao-item-qty">× {item.quantity}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Total */}
                    <div className="ao-total-row">
                        <span className="ao-total-label">Вкупно</span>
                        <span className="ao-total-amount">{formatAmount(order.amount, order.currency)}</span>
                    </div>

                    {/* Status Change */}
                    <div className="ao-section">
                        <div className="ao-section-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                            Промена на статус
                        </div>

                        <div className="ao-status-flow">
                            {STATUS_OPTIONS.map((status) => {
                                const isCurrentStatus = status === currentStatus
                                const isNextStatus = nextStatuses.includes(status)
                                const isLoadingThis = isPending && selectedStatus === status
                                if (!isCurrentStatus && !isNextStatus) return null
                                return (
                                    <button
                                        key={status}
                                        className={`ao-status-btn ${isCurrentStatus ? 'ao-status-current' : 'ao-status-next'} ${isLoadingThis ? 'ao-loading' : ''}`}
                                        onClick={() => !isCurrentStatus && handleStatusClick(status)}
                                        disabled={isCurrentStatus || isPending}
                                        style={isNextStatus ? {
                                            background: STATUS_COLORS[status]?.bg,
                                            color: STATUS_COLORS[status]?.text,
                                            borderColor: STATUS_COLORS[status]?.border,
                                        } : undefined}
                                    >
                                        {isLoadingThis ? <span className="ao-spinner" /> : (
                                            <>
                                                {isCurrentStatus && <span className="ao-current-indicator" />}
                                                {STATUS_LABELS[status]}
                                                {isNextStatus && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                )}
                                            </>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {nextStatuses.length === 0 && (
                            <p className="ao-final-status-note">
                                Нарачката е во финална состојба и не може да се менува.
                            </p>
                        )}
                    </div>

                    {/* Payload Admin link */}
                    <a href={`/admin/collections/orders/${order.id}`} target="_blank" rel="noopener noreferrer" className="ao-admin-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Отвори во Payload Admin
                    </a>
                </div>
            </div>

            {/* Confirmation dialog renders on top */}
            {pendingConfirm && (
                <ConfirmDialog
                    fromStatus={currentStatus}
                    toStatus={pendingConfirm}
                    customerName={getCustomerName(order)}
                    onConfirm={handleConfirm}
                    onCancel={() => setPendingConfirm(null)}
                    isPending={isPending}
                />
            )}
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Props = {
    initialOrders: Order[]
}

export const AdminOrdersClient: React.FC<Props> = ({ initialOrders }) => {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest')

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
        if (selectedOrder?.id === orderId) {
            setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : prev)
        }
    }

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: orders.length }
        for (const order of orders) {
            const s = order.status || 'processing'
            counts[s] = (counts[s] || 0) + 1
        }
        return counts
    }, [orders])

    const filteredOrders = useMemo(() => {
        let result = orders
        if (filterStatus !== 'all') result = result.filter((o) => o.status === filterStatus)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter((o) => {
                const name = getCustomerName(o).toLowerCase()
                const email = (o.customerEmail || '').toLowerCase()
                const id = o.id.toLowerCase()
                return name.includes(q) || email.includes(q) || id.includes(q)
            })
        }
        return [...result].sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            if (sortBy === 'amount_high') return (b.amount || 0) - (a.amount || 0)
            if (sortBy === 'amount_low') return (a.amount || 0) - (b.amount || 0)
            return 0
        })
    }, [orders, filterStatus, searchQuery, sortBy])

    return (
        <div className="ao-root">
            {/* Header */}
            {/* <div className="ao-page-header">
                <div className="ao-page-title-row">
                    <div className="ao-page-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="ao-page-title">Нарачки</h1>
                        <p className="ao-page-subtitle">Управувај со сите нарачки на едно место</p>
                    </div>
                </div>
                <div className="ao-stats-row">
                    {[
                        { label: 'Вкупно', count: statusCounts.all },
                        { label: 'Во обработка', count: statusCounts.processing || 0, color: '#f59e0b' },
                        { label: 'Во достава', count: statusCounts.shipping || 0, color: '#3b82f6' },
                        { label: 'Завршени', count: statusCounts.completed || 0, color: '#10b981' },
                    ].map((stat) => (
                        <div key={stat.label} className="ao-stat-card">
                            <span className="ao-stat-count" style={stat.color ? { color: stat.color } : undefined}>{stat.count}</span>
                            <span className="ao-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Search + Sort */}
            <div className="ao-controls">
                <div className="ao-search-wrapper">
                    <svg className="ao-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        className="ao-search-input"
                        type="text"
                        placeholder="Барај по ime, е-пошта или ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="ao-search-clear" onClick={() => setSearchQuery('')}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <select className="ao-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="newest">Најново прво</option>
                    <option value="oldest">Најстаро прво</option>
                    <option value="amount_high">Највисока цена</option>
                    <option value="amount_low">Најниска цена</option>
                </select>
            </div>

            {/* Filter tabs */}
            <div className="ao-filter-tabs">
                <button className={`ao-filter-tab ${filterStatus === 'all' ? 'ao-filter-active' : ''}`} onClick={() => setFilterStatus('all')}>
                    Сите<span className="ao-filter-count">{statusCounts.all}</span>
                </button>
                {STATUS_OPTIONS.map((status) => (
                    <button
                        key={status}
                        className={`ao-filter-tab ${filterStatus === status ? 'ao-filter-active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                        style={filterStatus === status ? { color: STATUS_COLORS[status]?.text, borderBottomColor: STATUS_COLORS[status]?.dot } : undefined}
                    >
                        {STATUS_LABELS[status]}
                        {(statusCounts[status] || 0) > 0 && <span className="ao-filter-count">{statusCounts[status]}</span>}
                    </button>
                ))}
            </div>

            {/* Orders list */}
            <div className="ao-orders-list">
                {filteredOrders.length === 0 ? (
                    <div className="ao-empty">
                        <div className="ao-empty-icon">📭</div>
                        <p className="ao-empty-title">Нема нарачки</p>
                        <p className="ao-empty-sub">Нема нарачки кои одговараат на вашата пребарување.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const status = order.status || 'processing'
                        const customer = getCustomerName(order)
                        const addr = order.shippingAddress
                        const nextStatuses = STATUS_FLOW[status] || []

                        return (
                            <div key={order.id} className="ao-order-card" onClick={() => setSelectedOrder(order)}>
                                <div className="ao-order-card-left">
                                    <div className="ao-order-top-row">
                                        <span className="ao-order-id">#{order.id.slice(-8).toUpperCase()}</span>
                                        <StatusBadge status={status} />
                                    </div>
                                    <div className="ao-order-customer">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <span>{customer}</span>
                                    </div>
                                    {addr?.city && (
                                        <div className="ao-order-address">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                            </svg>
                                            <span>{[addr.addressLine1, addr.city].filter(Boolean).join(', ')}</span>
                                        </div>
                                    )}
                                    <div className="ao-order-meta">
                                        <span className="ao-order-date">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            {formatDate(order.createdAt)}
                                        </span>
                                        <span className="ao-order-items">
                                            {order.items?.length || 0} {order.items?.length === 1 ? 'производ' : 'производи'}
                                        </span>
                                    </div>
                                </div>

                                <div className="ao-order-card-right">
                                    <span className="ao-order-amount">{formatAmount(order.amount, order.currency)}</span>
                                    {nextStatuses.length > 0 && (
                                        <div className="ao-quick-actions" onClick={(e) => e.stopPropagation()}>
                                            {nextStatuses.map((nextStatus) => (
                                                <QuickStatusButton
                                                    key={nextStatus}
                                                    orderId={order.id}
                                                    status={nextStatus}
                                                    currentStatus={status}
                                                    colors={STATUS_COLORS[nextStatus]}
                                                    label={STATUS_LABELS[nextStatus]}
                                                    customerName={customer}
                                                    onSuccess={handleStatusChange}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <svg className="ao-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    )
}

// ─── QuickStatusButton (card inline) ─────────────────────────────────────────

type QuickStatusButtonProps = {
    orderId: string
    status: OrderStatus
    currentStatus: string
    colors: { bg: string; text: string; dot: string; border: string }
    label: string
    customerName: string
    onSuccess: (orderId: string, newStatus: OrderStatus) => void
}

function QuickStatusButton({ orderId, status, currentStatus, colors, label, customerName, onSuccess }: QuickStatusButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [showConfirm, setShowConfirm] = useState(false)

    const handleConfirm = () => {
        setShowConfirm(false)
        startTransition(async () => {
            const result = await updateOrderStatus(orderId, status)
            if (result.success) {
                toast.success(`Статусот е сменет во "${STATUS_LABELS[status]}"`, {
                    description: 'Клиентот ќе добие известување по е-пошта.',
                    duration: 4000,
                })
                onSuccess(orderId, status)
            } else {
                toast.error('Грешка при промена на статус', {
                    description: result.error || 'Обидете се повторно.',
                    duration: 4000,
                })
            }
        })
    }

    return (
        <>
            <button
                className={`ao-quick-btn ${isPending ? 'ao-loading' : ''}`}
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                title={`Смени во: ${label}`}
            >
                {isPending
                    ? <span className="ao-spinner-sm" />
                    : <><span className="ao-badge-dot" style={{ background: colors.dot }} />{label}</>
                }
            </button>

            {showConfirm && (
                <ConfirmDialog
                    fromStatus={currentStatus}
                    toStatus={status}
                    customerName={customerName}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirm(false)}
                    isPending={isPending}
                />
            )}
        </>
    )
}
