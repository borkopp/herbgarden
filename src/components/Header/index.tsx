import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

import { type Locale } from '@/i18n/config'

export async function Header({ locale }: { locale: Locale }) {
  const header = await getCachedGlobal('header', 1)(locale)

  return <HeaderClient header={header} />
}
