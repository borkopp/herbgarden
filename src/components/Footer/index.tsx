import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '../Logo/Logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#fff4e6] text-primary-foreground pt-12 pb-12 ">
      {/* Cloud/Wave Transition */}
      {/* <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[99%] text-[#fae9d2] pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[70px] md:h-[110px]"
        > */}
      {/* Back Cloud Layer */}
      {/* <path
            className="fill-current opacity-60"
            d="M0,120 L0,60 Q40,20 80,60 Q120,10 160,60 Q210,30 260,60 Q310,0 360,60 Q420,40 480,60 Q540,10 600,60 Q660,30 720,60 Q780,0 840,60 Q900,40 960,60 Q1020,10 1080,60 Q1140,30 1200,60 L1200,120 Z"
          /> */}
      {/* Front Cloud Layer */}
      {/* <path
            className="fill-current"
            d="M0,120 L0,80 Q30,40 60,80 Q90,20 120,80 Q160,10 200,80 Q240,40 280,80 Q320,10 360,80 Q400,30 440,80 Q480,0 520,80 Q560,40 600,80 Q640,10 680,80 Q720,30 760,80 Q800,0 840,80 Q880,40 920,80 Q960,10 1000,80 Q1040,30 1080,80 Q1120,0 1160,80 Q1180,40 1200,80 L1200,120 Z"
          />
        </svg>
      </div> */}

      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-3 space-y-8">
            <Logo />
            <p className="max-w-md text-neutral-900 transition-colors text-sm leading-tight font-medium">
              Рачно изработени производи за најмалите, создадени со љубов и внимание кон деталите.
            </p>
          </div>

          {/* Navigation & Social Row for Mobile */}
          <div className="grid grid-cols-2 md:contents gap-8">
            {/* Support Column */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Навигација</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/shop" className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold">
                    Сите производи
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold">
                    За Нас
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold">
                    Контакт
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Социјални мрежи</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="https://instagram.com/tinymebypepelashka/" className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="https://facebook.com/tinymebypepelashka/" className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 col-span-full space-y-6 mt-4 md:mt-0">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Контакт</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-6 gap-x-4 md:gap-0 md:space-y-6">
              <li className="flex items-center gap-3 group col-span-1">
                <Phone className="size-4 text-neutral-900 group-hover:text-primary transition-colors" />
                <a href="tel:072233754" className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold">
                  072-233-754
                </a>
              </li>
              <li className="flex items-center gap-3 group col-span-1">
                <Mail className="size-4 text-neutral-900 group-hover:text-primary transition-colors" />
                <a href="mailto:contact@tinyme.mk" className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold">
                  contact@tinyme.mk
                </a>
              </li>
              <li className="flex items-start gap-3 group col-span-2 md:col-span-1">
                <MapPin className="size-4 text-neutral-900 group-hover:text-primary transition-colors shrink-0" />
                <p className="text-neutral-900 hover:text-primary transition-colors text-sm font-bold leading-tight">
                  Илинденска 24, 7500 Прилеп
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold tracking-[0.1em] text-neutral-900 transition-colors text-sm leading-tight font-medium">
            © {currentYear} TINY ME By Pepelashka. Сите права се задржани.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold tracking-[0.1em] text-neutral-900 transition-colors text-sm leading-tight font-medium">
              Политика на приватност
            </Link>
            <Link href="/terms" className="text-[10px] font-bold tracking-[0.1em] text-neutral-900 transition-colors text-sm leading-tight font-medium">
              Услови на користење
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
