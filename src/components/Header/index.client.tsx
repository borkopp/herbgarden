'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Suspense } from 'react'

import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { Logo } from '@/components/Logo/Logo'
import { Search } from '@/components/Search'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div className="z-20 border-b border-stone-100 sticky backdrop-blur-md bg-white/80">
      <nav className="flex items-center justify-between container h-16">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} categories={header.highlightCategories} />
          </Suspense>
        </div>
        <div className="flex-1 flex items-center justify-between h-full">
          {/* Left: Logo */}
          <div className="flex flex-1 md:flex-none justify-center md:justify-start items-center h-full pointer-events-auto">
            <Link className="flex items-center group" href="/">
              <Logo />
            </Link>
          </div>

          {/* Center: Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center items-center h-full">
            {(menu.length || header.highlightCategories?.length) ? (
              <ul className="flex gap-8 text-lg font-bold tracking-tight uppercase items-center h-full">
                {menu.map((item) => (
                  <li key={item.id} className="flex h-full">
                    <CMSLink
                      {...item.link}
                      size={'clear'}
                      className={cn(
                        'relative transition-colors duration-300 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out',
                        'hover:text-primary text-black font-bold font-display dark:text-stone-400',
                        {
                          'text-primary font-extrabold':
                            item.link.url && item.link.url !== '/'
                              ? pathname.includes(item.link.url)
                              : false,
                        },
                      )}
                      appearance="nav"
                    />
                  </li>
                ))}
                {header.highlightCategories?.map((category) => {
                  if (typeof category !== 'object') return null
                  const label = category.title
                  const url = `/shop?category=${category.id}`
                  const isActive = pathname === '/shop' && searchParams.get('category') === category.id

                  return (
                    <li key={category.id} className="flex h-full">
                      <Link
                        href={url}
                        className={cn(
                          'relative flex items-center px-2 transition-colors duration-300 after:content-[""] after:absolute after:-bottom-1 after:left-2 after:right-2 after:h-[2px] after:bg-primary after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out',
                          'hover:text-primary text-stone-600 dark:text-stone-400 font-mono tracking-widest text-xs uppercase',
                          {
                            'text-primary font-extrabold': isActive,
                          },
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-1 md:gap-2 h-full flex-1 md:flex-none">
            <Suspense fallback={null}>
              <Search />
            </Suspense>
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="nav"
                size="clear"
                asChild
                className="flex items-center justify-center hover:cursor-pointer p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <Link href="/account">
                  <HugeiconsIcon icon={UserIcon} size={20} className="text-stone-700 dark:text-stone-300" strokeWidth={1.5} />
                </Link>
              </Button>
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
