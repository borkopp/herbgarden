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
      'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
    )

  return (
    <div className={clsx("flex flex-col h-full", className)}>
      <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl mb-6">
        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
          <HugeiconsIcon icon={UserIcon} size={24} className="text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold truncate">{user?.name || 'Мојот профил'}</p>
          <p className="text-xs text-stone-500 truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <Link
          href="/account"
          className={navItemClass(pathname === '/account')}
        >
          <HugeiconsIcon icon={Settings02Icon} size={22} strokeWidth={1.5} />
          <span className="text-sm font-medium">Поставки на профилот</span>
        </Link>

        <Link
          href="/account/addresses"
          className={navItemClass(pathname === '/account/addresses')}
        >
          <HugeiconsIcon icon={MapPinIcon} size={22} strokeWidth={1.5} />
          <span className="text-sm font-medium">Адреси</span>
        </Link>

        <Link
          href="/wishlist"
          className={navItemClass(pathname === '/wishlist')}
        >
          <HugeiconsIcon icon={FavouriteIcon} size={22} strokeWidth={1.5} />
          <span className="text-sm font-medium">Омилени</span>
        </Link>

        <Link
          href="/orders"
          className={navItemClass(pathname === '/orders' || pathname.includes('/orders'))}
        >
          <HugeiconsIcon icon={PackageIcon} size={22} strokeWidth={1.5} />
          <span className="text-sm font-medium">Нарачки</span>
        </Link>

        <div className="h-px bg-stone-100 dark:bg-stone-800 my-4"></div>

        <Link
          href="/logout"
          className={navItemClass(pathname === '/logout')}
        >
          <HugeiconsIcon icon={Logout03Icon} size={22} strokeWidth={1.5} />
          <span className="text-sm font-medium">Одјава</span>
        </Link>
      </nav>
    </div>
  )
}
