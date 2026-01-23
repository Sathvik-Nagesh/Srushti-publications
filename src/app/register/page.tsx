'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ (Passwords do not match)')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು (Password must be at least 6 characters)')
      setIsLoading(false)
      return
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      
      if (result.success) {
        toast.success('ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! (Account created successfully)')
        router.push('/') // Redirect to home
      } else {
        setError(result.error || 'ನೋಂದಣಿ ವಿಫಲವಗಿದೆ (Registration failed)')
        toast.error(result.error || 'ನೋಂದಣಿ ವಿಫಲವಗಿದೆ')
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
      <main style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-alt)', padding: '2rem 1rem' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
             <Image 
              src="/logo.jpg" 
              alt="Srushti Publications" 
              width={80} 
              height={80} 
              style={{ borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover' }} 
            />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>ಖಾತೆ ತೆರೆಯಿರಿ (Create Account)</h1>
            <p style={{ color: 'var(--color-text-light)' }}>ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ ಕುಟುಂಬಕ್ಕೆ ಸ್ವಾಗತ</p>
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
              <label className="label">ಹೆಸರು (Full Name)</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="ನಿಮ್ಮ ಹೆಸರು" 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">ಇಮೇಲ್ (Email)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="example@mail.com" 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">ಫೋನ್ ಸಂಖ್ಯೆ (Phone)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="9876543210" 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">ಪಾಸ್‌ವರ್ಡ್ (Password)</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="********" 
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ (Confirm Password)</label>
              <div style={{ position: 'relative' }}>
                <CheckCircle size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="********" 
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLoading ? 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...' : 'ನೋಂದಣಿ ಮಾಡಿ (Register)'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
              ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? (Already have an account?)
            </p>
            <Link href="/login" style={{ display: 'inline-block', marginTop: '0.5rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
              ಲಾಗಿನ್ ಮಾಡಿ (Login here)
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
