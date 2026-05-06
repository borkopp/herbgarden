import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import QualityClientPage from './QualityClientPage'

type Args = {
    params: Promise<{
        locale: string
    }>
}

export default async function QualityPage({ params }: Args) {
    const { locale } = await params
    const dict = await getDictionary(locale as Locale)

    return <QualityClientPage dict={dict.quality} />
}
