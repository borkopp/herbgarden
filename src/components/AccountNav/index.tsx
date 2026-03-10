'use client'

import type { User as UserType } from '@/payload-types'
import clsx from 'clsx'
import { HugeiconsIcon } from '@hugeicons/react'
import { FavouriteIcon, Logout03Icon, MapPinIcon, PackageIcon, Settings02Icon, UserIcon } from '@hugeicons/core-free-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
  user?: UserType | null
}

export const AccountNav: React.FC<Props> = ({ className, user }) => {
  const pathname = usePathname()

  const navItemClass = (active: boolean) =>
    clsx(
      'flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap shrink-0',
      active
        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
    )

  return (
    <div className={clsx("flex flex-col w-full", className)}>
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <div className="size-12 md:size-14 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center overflow-hidden shrink-0 bg-stone-50 dark:bg-stone-900">
          <HugeiconsIcon icon={UserIcon} size={28} className="text-stone-400" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-xl md:text-2xl font-light tracking-tight text-stone-900 dark:text-stone-100 truncate">{user?.name || 'Мојот профил'}</p>
          <p className="text-sm text-stone-500 truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-4 md:pb-6 no-scrollbar">
        <Link
          href="/account"
          className={navItemClass(pathname === '/account')}
        >
          <HugeiconsIcon icon={Settings02Icon} size={18} strokeWidth={1.5} />
          <span className="text-sm font-medium">Поставки</span>
        </Link>

        <Link
          href="/account/addresses"
          className={navItemClass(pathname === '/account/addresses')}
        >
          <HugeiconsIcon icon={MapPinIcon} size={18} strokeWidth={1.5} />
          <span className="text-sm font-medium">Адреси</span>
        </Link>

        <Link
          href="/wishlist"
          className={navItemClass(pathname === '/wishlist')}
        >
          <HugeiconsIcon icon={FavouriteIcon} size={18} strokeWidth={1.5} />
          <span className="text-sm font-medium">Омилени</span>
        </Link>

        <Link
          href="/orders"
          className={navItemClass(pathname === '/orders' || pathname.includes('/orders'))}
        >
          <HugeiconsIcon icon={PackageIcon} size={18} strokeWidth={1.5} />
          <span className="text-sm font-medium">Нарачки</span>
        </Link>

        <div className="w-px h-6 bg-stone-200 dark:bg-stone-800 mx-2 shrink-0 hidden md:block"></div>

        <Link
          href="/logout"
          className={clsx(navItemClass(pathname === '/logout'), "ml-auto md:ml-0")}
        >
          <HugeiconsIcon icon={Logout03Icon} size={18} strokeWidth={1.5} />
          <span className="text-sm font-medium hidden sm:inline">Одјава</span>
        </Link>
      </nav>
    </div>
  )
}
