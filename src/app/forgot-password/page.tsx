'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        toast.success('ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ')
      } else {
        toast.error(data.error || 'ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
      }
    } catch (error) {
      toast.error('ದೋಷ ಸಂಭವಿಸಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" style={{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>
            ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600" style={{ textAlign: 'center', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
            ಚಿಂತಿಸಬೇಡಿ! ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ, ನಾವು ನಿಮಗೆ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md" style={{ maxWidth: '448px', margin: '0 auto', width: '100%' }}>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
            
            {isSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: 'var(--color-success)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto'
                }}>
                  <Mail size={32} color="white" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ</h3>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  ನಾವು <strong>{email}</strong> ಗೆ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಅನ್ನು ಕಳುಹಿಸಿದ್ದೇವೆ. ನಿಮ್ಮ ಇನ್ಬಾಕ್ಸ್ (ಮತ್ತು ಸ್ಪ್ಯಾಮ್ ಫೋಲ್ಡರ್) ಪರಿಶೀಲಿಸಿ.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button 
                    onClick={() => { setIsSuccess(false); setEmail(''); }}
                    className="btn btn-outline"
                    style={{ justifyContent: 'center' }}
                  >
                    ಮತ್ತೊಂದು ಇಮೇಲ್ ಪ್ರಯತ್ನಿಸಿ
                  </button>
                  <Link href="/login" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                    ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    ಇಮೇಲ್ ವಿಳಾಸ
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      placeholder="name@example.com"
                      style={{ paddingLeft: '2.5rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isLoading ? <span className="spinner" /> : 'ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿ'}
                  </button>
                </div>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
