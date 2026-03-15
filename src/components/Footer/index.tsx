import { type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import type { Footer as FooterType, Page } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FacebookIcon, InstagramIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'

export async function Footer({ locale }: { locale: Locale }) {
  const footer: FooterType = await getCachedGlobal('footer', 1)(locale)
  const dict = await getDictionary(locale)
  const currentYear = new Date().getFullYear()

  const columns = footer.columns || []
  const bottomNavItems = footer.bottomNavItems || []

  const getLinkHref = (item: any) => {
    if (!item.link) return '#'
    const { type, reference, url } = item.link
    if (type === 'reference' && reference?.value && typeof reference.value === 'object') {
      const ref = reference.value as Page
      return `/${locale}/${ref.slug}`
    }
    if (type === 'custom' && url) {
      return url.startsWith('http') ? url : `/${locale}${url.startsWith('/') ? url : `/${url}`}`
    }
    return '#'
  }

  const iconMap = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
  }

  return (
    <footer className="bg-white text-stone-900 border-t border-stone-100 italic">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 item-start">
          {/* Logo & Description */}
          <div className="md:col-span-6 space-y-8">
            <Link href={`/${locale}`} className="block">
              <Image
                src="/logo-vertical.png"
                alt="VERA & VIGOR"
                width={180}
                height={200}
                className="h-32 w-auto object-contain brightness-0"
              />
            </Link>
            <p className="max-w-xs text-stone-500 text-sm leading-relaxed font-normal normal-case">
              {footer.description || dict.footer.officialStore}
            </p>
          </div>

          {/* Dynamic Columns */}
          {columns.map((column, colIndex) => (
            <div key={column.id || colIndex} className="md:col-span-3 space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-900">
                {column.label}
              </h4>
              <ul className="space-y-4">
                {column.navItems?.map((item, itemIndex) => {
                  const href = getLinkHref(item)
                  const Icon = item.icon && item.icon !== 'none' ? iconMap[item.icon as keyof typeof iconMap] : null

                  return (
                    <li key={item.id || itemIndex}>
                      <Link
                        href={href}
                        target={item.link.newTab ? '_blank' : undefined}
                        className="group flex items-center gap-3 text-stone-900 hover:text-stone-500 transition-colors text-sm font-medium not-italic"
                      >
                        {Icon && <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.5} />}
                        <span>{item.link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400 uppercase not-italic">
            © {currentYear} HERB GARDEN. {footer.copyrightText || dict.footer.allRightsReserved}
          </p>
          <div className="flex gap-10">
            {bottomNavItems.map((item, index) => (
              <Link
                key={item.id || index}
                href={getLinkHref(item)}
                target={item.link.newTab ? '_blank' : undefined}
                className="text-[9px] font-bold tracking-[0.15em] text-stone-400 uppercase hover:text-stone-900 transition-colors not-italic"
              >
                {item.link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
