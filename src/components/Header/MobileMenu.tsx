'use client'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { Header } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { motion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, Login03Icon, Logout03Icon, MapPinIcon, Menu01Icon, PackageIcon, Settings02Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '../Logo/Logo'

interface Props {
  menu: Header['navItems']
  categories?: Header['highlightCategories']
}

export function MobileMenu({ menu, categories }: Props) {
  const { user } = useAuth()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  const menuVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  }

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-black dark:text-white focus:outline-none">
        <HugeiconsIcon icon={Menu01Icon} size={24} strokeWidth={1.5} />
        <span className="sr-only">Отвори мени</span>
      </SheetTrigger>

      <SheetContent side="left" className="w-[310px] sm:w-[350px] p-0 flex flex-col h-full border-r-0 shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full overflow-y-auto bg-white dark:bg-stone-950">
          <SheetHeader className="px-6 py-8 border-b border-stone-100 dark:border-stone-900 bg-white/50 dark:bg-stone-950/50 backdrop-blur-md sticky top-0 z-10">
            <SheetTitle className="text-left">
              <Link href="/" className="inline-block transition-transform active:scale-95" onClick={() => setIsOpen(false)}>
                <Logo />
              </Link>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 px-4 py-8">
            {/* Main Navigation */}
            <nav className="space-y-1 mb-10">
              <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-4">
                Мени
              </h3>
              {menu?.length ? (
                <ul className="space-y-1">
                  {menu.map((item, index) => {
                    const isActive = item.link.url === pathname
                    return (
                      <motion.li
                        key={item.id}
                        initial="closed"
                        animate="open"
                        variants={menuVariants}
                        transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
                      >
                        <CMSLink
                          {...item.link}
                          label={null}
                          appearance="link"
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-3.5 text-lg font-bold tracking-tight uppercase rounded-2xl transition-all duration-200 group",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-900"
                          )}
                        >
                          <span className="flex-1 text-left">{item.link.label}</span>
                          <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} className={cn("opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0", isActive && "opacity-100 translate-x-0")} />
                        </CMSLink>
                      </motion.li>
                    )
                  })}
                </ul>
              ) : null}
            </nav>

            {/* Categories Section */}
            {categories?.length ? (
              <nav className="space-y-1 mb-10">
                <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-4">
                  Категории
                </h3>
                <ul className="space-y-1">
                  {categories.map((category, index) => {
                    if (typeof category !== 'object') return null
                    const href = `/shop?category=${category.id}`
                    const isActive = pathname === '/shop' && searchParams.get('category') === category.id

                    return (
                      <motion.li
                        key={category.id}
                        initial="closed"
                        animate="open"
                        variants={menuVariants}
                        transition={{ delay: (menu?.length || 0 + index) * 0.05, duration: 0.3, ease: 'easeOut' }}
                      >
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-3.5 text-lg font-bold tracking-tight uppercase rounded-2xl transition-all duration-200 group",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-900"
                          )}
                        >
                          <span className="flex-1 text-left">{category.title}</span>
                          <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} className={cn("opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0", isActive && "opacity-100 translate-x-0")} />
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>
            ) : null}

            {/* Account Section */}
            <section className="space-y-1">
              <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-4">
                Профил
              </h3>
              {user ? (
                <div className="space-y-1">
                  <MenuEntry href="/orders" icon={PackageIcon} label="Нарачки" />
                  <MenuEntry href="/account/addresses" icon={MapPinIcon} label="Адреси" />
                  <MenuEntry href="/account" icon={Settings02Icon} label="Управувај со сметка" />

                  <div className="pt-6 px-2 mt-4">
                    <Button asChild variant="outline" className="w-full justify-start gap-3 border-stone-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:border-stone-800 transition-colors rounded-2xl h-12 px-4 shadow-sm active:scale-[0.98]">
                      <Link href="/logout">
                        <HugeiconsIcon icon={Logout03Icon} size={16} strokeWidth={1.5} />
                        <span className="font-semibold">Одјави се</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 px-2 pt-2">
                  <Button asChild variant="secondary" className="w-full justify-center gap-2 h-12 rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98]">
                    <Link href="/login">
                      <HugeiconsIcon icon={Login03Icon} size={16} strokeWidth={1.5} />
                      Најави се
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-center gap-2 h-12 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                    <Link href="/create-account" className="font-bold">
                      <HugeiconsIcon icon={UserAdd01Icon} size={16} strokeWidth={1.5} />
                      Регистрирај се
                    </Link>
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Footer Info */}
          <div className="p-8 border-t border-stone-100 dark:border-stone-900 bg-stone-50/50 dark:bg-stone-900/50 mt-auto">
            <p className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-[0.25em]">
              © {new Date().getFullYear()} Herb Garden
            </p>
            <p className="text-center text-[9px] text-stone-400 uppercase tracking-widest mt-1">
              Премиум опрема за бебиња
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MenuEntry({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group",
        isActive
          ? "bg-secondary text-accent-foreground font-bold shadow-sm"
          : "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-900"
      )}
    >
      <div className={cn(
        "flex items-center justify-center size-9 rounded-xl transition-all",
        isActive ? "bg-white text-primary shadow-sm scale-110" : "bg-stone-100 group-hover:bg-white dark:bg-stone-800 dark:group-hover:bg-stone-700 shadow-none group-hover:shadow-sm"
      )}>
        <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.5} />
      </div>
      <span className="flex-1 font-medium">{label}</span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} className={cn("opacity-0 -translate-x-2 transition-all group-hover:opacity-30 group-hover:translate-x-0 font-bold", isActive && "opacity-100 translate-x-0")} />
    </Link>
  )
}
