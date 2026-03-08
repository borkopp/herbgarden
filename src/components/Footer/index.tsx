import { InstagramIcon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white text-stone-900 border-t border-stone-100 italic">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 item-start">
          {/* Logo & Description */}
          <div className="md:col-span-6 space-y-8">
            <Link href="/" className="block">
              <Image
                src="/logo-vertical.png"
                alt="VERA & VIGOR"
                width={180}
                height={200}
                className="h-32 w-auto object-contain brightness-0"
              />
            </Link>
            <p className="max-w-xs text-stone-500 text-sm leading-relaxed font-normal normal-case">
              A boutique sensory lab dedicated to the extraction of nature's most vibrant profiles.
            </p>
          </div>

          {/* Connect */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-900">Connect</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://instagram.com/herbgardenbypepelashka/"
                  className="group flex items-center gap-3 text-stone-900 hover:text-stone-500 transition-colors text-sm font-medium not-italic"
                >
                  <HugeiconsIcon icon={InstagramIcon} size={18} strokeWidth={1.5} />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://facebook.com/herbgardenbypepelashka/"
                  className="group flex items-center gap-3 text-stone-900 hover:text-stone-500 transition-colors text-sm font-medium not-italic"
                >
                  <HugeiconsIcon icon={NewTwitterIcon} size={18} strokeWidth={1.5} />
                  <span>Twitter</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistance */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-900">Assistance</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/shipping" className="text-stone-900 hover:text-stone-500 transition-colors text-sm font-medium not-italic">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-stone-900 hover:text-stone-500 transition-colors text-sm font-medium not-italic">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-900 hover:text-stone-500 transition-colors text-sm font-medium not-italic">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400 uppercase not-italic">
            © {currentYear} VERA & VIGOR SENSORY LAB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10">
            <Link href="/privacy" className="text-[9px] font-bold tracking-[0.15em] text-stone-400 uppercase hover:text-stone-900 transition-colors not-italic">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[9px] font-bold tracking-[0.15em] text-stone-400 uppercase hover:text-stone-900 transition-colors not-italic">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
