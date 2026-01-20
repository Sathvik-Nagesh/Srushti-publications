import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export const locales = ['kn', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'kn'

export default getRequestConfig(async () => {
  // Get locale from cookie or use default
  const cookieStore = await cookies()
  const localeValue = cookieStore.get('locale')?.value
  const locale = (localeValue === 'en' ? 'en' : 'kn') as Locale
  
  // Import messages based on locale
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch {
    messages = (await import(`../../messages/kn.json`)).default
  }
  
  return {
    locale,
    messages
  }
})
