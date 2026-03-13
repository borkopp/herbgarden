'use client'

import type { User as UserType } from '@/payload-types'
import { FavouriteIcon, Logout03Icon, MapPinIcon, PackageIcon, Settings02Icon, UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLocale } from '@/providers/Locale'

type Props = {
  className?: string
  user?: UserType | null
}

export const AccountNav: React.FC<Props> = ({ className, user }) => {
  const { dict: t } = useLocale()
  const pathname = usePathname()

  const navItemClass = (active: boolean) =>
    clsx(
      'flex items-center gap-3 px-6 py-3 rounded-full transition-all whitespace-nowrap shrink-0 text-[10px] font-bold tracking-[0.2em] uppercase',
      active
        ? 'bg-black text-white shadow-xl shadow-black/10'
        : 'text-black/40 hover:text-black hover:bg-stone-50'
    )

  return (
    <div className={clsx("flex flex-col w-full", className)}>
      <div className="flex items-center gap-6 mb-12 animate-in fade-in slide-in-from-left-4 duration-1000 ease-out">
        <div className="size-16 md:size-20 rounded-full border border-black/5 flex items-center justify-center overflow-hidden shrink-0 bg-[#f6f6f6]">
          <HugeiconsIcon icon={UserIcon} size={32} className="text-black/20" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1">{t.account.authenticatedSession}</span>
          <h1 className="text-2xl md:text-4xl font-display uppercase tracking-tight text-black truncate leading-none">
            {user?.name || t.account.myProfile}
          </h1>
          <p className="text-xs text-black/40 mt-1 font-medium">{user?.email}</p>
        </div>
      </div>

      <nav className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar animate-in fade-in duration-1000 delay-300 fill-mode-both">
        <Link
          href="/account"
          className={navItemClass(pathname === '/mk/account' || pathname === '/en/account')}
        >
          <HugeiconsIcon icon={Settings02Icon} size={14} strokeWidth={2} />
          <span>{t.account.accountSettings}</span>
        </Link>

        <Link
          href="/account/addresses"
          className={navItemClass(pathname === '/mk/account/addresses' || pathname === '/en/account/addresses')}
        >
          <HugeiconsIcon icon={MapPinIcon} size={14} strokeWidth={2} />
          <span>{t.account.addresses}</span>
        </Link>

        <Link
          href="/wishlist"
          className={navItemClass(pathname === '/mk/wishlist' || pathname === '/en/wishlist')}
        >
          <HugeiconsIcon icon={FavouriteIcon} size={14} strokeWidth={2} />
          <span>{t.wishlist.wishlist}</span>
        </Link>

        <Link
          href="/orders"
          className={navItemClass(pathname === '/orders' || pathname.includes('/orders'))}
        >
          <HugeiconsIcon icon={PackageIcon} size={14} strokeWidth={2} />
          <span>{t.account.orders}</span>
        </Link>

        <div className="w-px h-6 bg-black/5 mx-4 shrink-0 hidden md:block"></div>

        <Link
          href="/logout"
          className={clsx(navItemClass(pathname === '/logout'), "ml-auto md:ml-0")}
        >
          <HugeiconsIcon icon={Logout03Icon} size={14} strokeWidth={2} />
          <span className="hidden sm:inline">{t.account.logout}</span>
        </Link>
      </nav>
    </div>
  )
}
