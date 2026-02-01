'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const email = searchParams.get('email') // Optional, for display/verification
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ')
      return
    }
    
    if (password.length < 6) {
      toast.error('ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು')
      return
    }

    if (!token) {
        toast.error('ಅಮಾನ್ಯ ಟೋಕನ್')
        return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        toast.success('ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        toast.error(data.error || 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು ವಿಫಲವಾಗಿದೆ')
      }
    } catch (error) {
      toast.error('ದೋಷ ಸಂಭವಿಸಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
       <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-error)' }}>ಅಮಾನ್ಯ ಲಿಂಕ್</h2>
          <p style={{ marginBottom: '2rem' }}>ಈ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಅಮಾನ್ಯವಾಗಿದೆ ಅಥವಾ ಅವಧಿ ಮೀರಿದೆ.</p>
          <Link href="/forgot-password" className="btn btn-primary">
            ಹೊಸ ಲಿಂಕ್ ಪಡೆಯಿರಿ
          </Link>
       </div>
    )
  }

  return (
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
                  <CheckCircle size={32} color="white" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>ಯಶಸ್ವಿಯಾಗಿದೆ!</h3>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                  ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ. ನೀವು ಈಗ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಬಹುದು.
                </p>
                <Link href="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಿ <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
                  ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    ಹೊಸ ಪಾಸ್‌ವರ್ಡ್
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input"
                      placeholder="••••••••"
                      style={{ paddingLeft: '2.5rem', width: '100%' }}
                      minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className="block text-sm font-medium text-gray-700" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input"
                      placeholder="••••••••"
                      style={{ paddingLeft: '2.5rem', width: '100%' }}
                      minLength={6}
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
                    {isLoading ? <span className="spinner" /> : 'ಪಾಸ್‌ವರ್ಡ್ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ'}
                  </button>
                </div>
              </form>
            )}
          </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" style={{ fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>
            ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ
          </h2>
        </div>
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
