'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('admin_authenticated', 'true')
        toast.success('ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದೆ!')
        router.push('/admin')
      } else {
        setError(data.error || 'ತಪ್ಪಾದ ಇ-ಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('ಲಾಗಿನ್ ಮಾಡುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
      padding: '1rem'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed',
        top: '-50%',
        right: '-20%',
        width: '80%',
        height: '200%',
        background: 'radial-gradient(ellipse, var(--color-primary-100) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Back Link */}
        <Link 
          href="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            color: 'var(--color-text-light)',
            textDecoration: 'none',
            fontSize: '0.9375rem'
          }}
        >
          <ArrowLeft size={18} />
          ಮುಖ್ಯ ಸೈಟ್‌ಗೆ ಹಿಂತಿರುಗಿ
        </Link>

        {/* Login Card */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-2xl)',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <Image
                src="/logo.jpg"
                alt="Srushti Publications"
                width={50}
                height={50}
                style={{ borderRadius: '12px' }}
              />
              <div style={{ textAlign: 'left' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Admin Panel</p>
              </div>
            </div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '0.5rem'
            }}>
              <Shield size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 500 }}>ಆಡ್ಮಿನ್ ಲಾಗಿನ್</span>
            </div>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9375rem', margin: 0 }}>
              ನಿಮ್ಮ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Lock size={16} />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500,
                color: 'var(--color-text)'
              }}>
                ಇ-ಮೇಲ್
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500,
                color: 'var(--color-text)'
              }}>
                ಪಾಸ್‌ವರ್ಡ್
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                  ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  ಲಾಗಿನ್ ಮಾಡಿ
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'var(--color-bg-alt)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.8125rem'
          }}>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              🔐 Demo Credentials:
            </p>
            <p style={{ margin: '0.25rem 0', color: 'var(--color-text-light)' }}>
              Email: <code style={{ background: 'white', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>admin@srushtipublication.com</code>
            </p>
            <p style={{ margin: '0.25rem 0', color: 'var(--color-text-light)' }}>
              Password: <code style={{ background: 'white', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>SrushtiAdmin@2024</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)'
        }}>
          © 2024 ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿಸಲಾಗಿದೆ.
        </p>
      </div>
    </div>
  )
}
