'use server'

import { cookies } from 'next/headers'

export async function setUserLocale(locale: string) {
  const cookieStore = await cookies()
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 31536000, // 1 year
    sameSite: 'lax',
  })
}
