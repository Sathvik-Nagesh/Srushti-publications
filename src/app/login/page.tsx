'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslations } from 'next-intl'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { login, register, isAuthenticated } = useAuth()
  const t = useTranslations('Login')
  
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push(redirect)
    return null
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = t('errors.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid')
    }
    
    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('errors.passwordMin')
    }
    
    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = t('errors.nameRequired')
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('errors.passwordMismatch')
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    try {
      let result
      
      if (mode === 'login') {
        result = await login(formData.email, formData.password)
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone
        })
      }
      
      if (result.success) {
        toast.success(mode === 'login' ? t('loginButton') + ' ' + t('errors.generic').replace('ದೋಷ', 'ಯಶಸ್ವಿ') : t('signupButton') + ' ' + t('errors.generic').replace('ದೋಷ', 'ಯಶಸ್ವಿ'))
        // Keep English toast simpler or use translation for success? 
        // For now simple toast
        toast.success(mode === 'login' ? 'Success!' : 'Account Created!')
        router.push(redirect)
      } else {
        toast.error(result.error || t('errors.generic'))
      }
    } catch (error) {
      toast.error(t('errors.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="main-content" style={{ 
        paddingTop: '3rem', 
        paddingBottom: '3rem',
        display: 'flex',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-2xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {mode === 'login' ? t('title') : t('signupTitle')}
              </h1>
              <p style={{ color: 'var(--color-text-light)' }}>
                {mode === 'login' 
                  ? t('welcomeBack') 
                  : t('welcomeNew')}
              </p>
            </div>

            {/* Mode Toggle */}
            <div style={{
              display: 'flex',
              background: 'var(--color-bg-alt)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.25rem',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={() => setMode('login')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: mode === 'login' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('title')}
              </button>
              <button
                onClick={() => setMode('register')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: mode === 'register' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('signupButton')}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="label">{t('name')} *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={20} style={{ 
                        position: 'absolute', 
                        left: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)'
                      }} />
                      <input
                        type="text"
                        className="input"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder={t('name')}
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    {errors.name && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="label">{t('phone')}</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={20} style={{ 
                        position: 'absolute', 
                        left: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)'
                      }} />
                      <input
                        type="tel"
                        className="input"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="label">{t('email')} *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ 
                    position: 'absolute', 
                    left: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)'
                  }} />
                  <input
                    type="email"
                    className="input"
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                {errors.email && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>}
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="label">{t('password')} *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ 
                    position: 'absolute', 
                    left: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input"
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</p>}
              </div>

              {mode === 'register' && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="label">{t('confirmPassword')} *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ 
                      position: 'absolute', 
                      left: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)'
                    }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  {errors.confirmPassword && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</p>}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '1rem',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isLoading ? (
                  <span className="spinner" style={{ width: 20, height: 20 }} />
                ) : (
                  <>
                    {mode === 'login' ? t('loginButton') : t('signupButton')}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Guest Checkout Link */}
            {redirect.includes('checkout') && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                  {t('or')}
                </p>
                <Link
                  href="/checkout"
                  style={{
                    color: 'var(--color-primary)',
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  {t('continueGuest')} →
                </Link>
              </div>
            )}

            {/* Footer Links */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link
                href="/"
                style={{
                  color: 'var(--color-text-light)',
                  fontSize: '0.875rem',
                  textDecoration: 'none'
                }}
              >
                ← {t('backHome')}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><span className="spinner" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
