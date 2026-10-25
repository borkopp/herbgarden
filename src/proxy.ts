import { defaultLocale, locales, type Locale } from '@/i18n/config'
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

function getLocaleFromPathname(pathname: string): Locale | undefined {
    const segments = pathname.split('/')
    const potentialLocale = segments[1]
    return locales.find((l) => l === potentialLocale)
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip locale handling for:
    // - API routes
    // - Next.js internals
    // - Static files
    // - Payload admin
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/next') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next()
    }

    // Check if pathname already has a locale
    const pathnameLocale = getLocaleFromPathname(pathname)
    if (pathnameLocale) {
        // Valid locale in URL — proceed
        return NextResponse.next()
    }

    // No locale in URL — detect preferred locale
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined
    const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale

    // Redirect to the locale-prefixed URL
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
}

export const config = {
    matcher: [
        // Match all paths except static files and internal Next.js paths
        '/((?!_next/static|_next/image|favicon.ico|favicon.svg|.*\\..*).*)',
    ],
}
