'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(email, password)
      
      if (result.success) {
        toast.success('ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ (Logged in successfully)')
        router.push('/') // Redirect to home or previous page
      } else {
        setError(result.error || 'ಲಾಗಿನ್ ವಿಫಲವಗಿದೆ (Login failed)')
        toast.error(result.error || 'ಲಾಗಿನ್ ವಿಫಲವಗಿದೆ')
      }
    } catch (err) {
      setError('ಆಂತರಿಕ ದೋಷ (Internal error)')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-alt)', padding: '2rem 1rem' }}>
        <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Image 
              src="/logo.jpg" 
              alt="Srushti Publications" 
              width={80} 
              height={80} 
              style={{ borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover' }} 
            />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>ಸ್ವಾಗತ (Welcome Back)</h1>
            <p style={{ color: 'var(--color-text-light)' }}>ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ</p>
          </div>

          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#991b1b', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">ಇಮೇಲ್ (Email)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="example@mail.com" 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label className="label">ಪಾಸ್‌ವರ್ಡ್ (Password)</label>
                <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  ಮರೆತಿದ್ದೀರಾ? (Forgot?)
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input" 
                  style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
                  placeholder="********" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '1rem',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLoading ? 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...' : 'ಲಾಗಿನ್ (Login)'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
              ಖಾತೆ ಇಲ್ಲವೇ? (Don't have an account?)
            </p>
            <Link href="/register" style={{ display: 'inline-block', marginTop: '0.5rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
              ಹೊಸ ಖಾತೆ ತೆರೆಯಿರಿ (Create Account)
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
