'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const OrdersNavLink: React.FC = () => {
    const pathname = usePathname()
    const isActive = pathname?.includes('/admin/orders')

    return (
        <div style={{ padding: '0 8px 4px' }}>
            <Link
                href="/admin/orders"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isActive ? 'var(--theme-elevation-900)' : 'var(--theme-elevation-500)',
                    background: isActive ? 'var(--theme-elevation-100)' : 'transparent',
                    transition: 'background 0.15s, color 0.15s',
                }}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Нарачки
            </Link>
        </div>
    )
}
