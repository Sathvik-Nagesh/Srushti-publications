'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, Check, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

// Password requirement rules
const passwordRules = [
  { id: 'length', label: 'ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು (At least 8 characters)', check: (p: string) => p.length >= 8 },
  { id: 'uppercase', label: 'ಒಂದು ದೊಡ್ಡ ಅಕ್ಷರ (One uppercase letter)', check: (p: string) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'ಒಂದು ಸಣ್ಣ ಅಕ್ಷರ (One lowercase letter)', check: (p: string) => /[a-z]/.test(p) },
  { id: 'number', label: 'ಒಂದು ಸಂಖ್ಯೆ (One number)', check: (p: string) => /[0-9]/.test(p) },
  { id: 'special', label: 'ಒಂದು ವಿಶೇಷ ಚಿಹ್ನೆ (One special character: @$!%*?&)', check: (p: string) => /[@$!%*?&]/.test(p) },
]

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Calculate password strength and which rules pass
  const passwordValidation = useMemo(() => {
    const results = passwordRules.map(rule => ({
      ...rule,
      passed: rule.check(formData.password)
    }))
    const passedCount = results.filter(r => r.passed).length
    const strength = passedCount === 0 ? 0 : Math.round((passedCount / passwordRules.length) * 100)
    const isStrong = passedCount >= 4 // At least 4 rules must pass
    return { results, strength, isStrong, passedCount }
  }, [formData.password])

  // Password match check
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

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

    if (!passwordValidation.isStrong) {
      setError('ಪಾಸ್‌ವರ್ಡ್ ಅವಶ್ಯಕತೆಗಳನ್ನು ಪೂರೈಸಿ (Please meet password requirements)')
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

  // Calculate strength bar color
  const getStrengthColor = () => {
    if (passwordValidation.strength < 40) return '#ef4444' // Red
    if (passwordValidation.strength < 80) return '#f59e0b' // Orange
    return '#22c55e' // Green
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Password Strength Bar */}
              {formData.password && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ 
                    height: '4px', 
                    background: '#e5e7eb', 
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{
                        height: '100%',
                        width: `${passwordValidation.strength}%`,
                        background: getStrengthColor(),
                        transition: 'width 0.3s, background 0.3s'
                      }}
                    />
                  </div>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: getStrengthColor(),
                    marginTop: '0.25rem',
                    fontWeight: 500
                  }}>
                    {passwordValidation.strength < 40 && 'ದುರ್ಬಲ (Weak)'}
                    {passwordValidation.strength >= 40 && passwordValidation.strength < 80 && 'ಮಧ್ಯಮ (Medium)'}
                    {passwordValidation.strength >= 80 && 'ಬಲವಾದ (Strong)'}
                  </p>

                  {/* Password Requirements List */}
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                    {passwordValidation.results.map(rule => (
                      <div 
                        key={rule.id}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          color: rule.passed ? '#22c55e' : '#9ca3af',
                          marginBottom: '0.25rem'
                        }}
                      >
                        {rule.passed ? <Check size={14} /> : <X size={14} />}
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="label">ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ (Confirm Password)</label>
              <div style={{ position: 'relative' }}>
                <CheckCircle size={18} style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '1rem', 
                  transform: 'translateY(-50%)', 
                  color: passwordsMatch ? '#22c55e' : 'var(--color-text-muted)' 
                }} />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input" 
                  style={{ 
                    paddingLeft: '2.5rem', 
                    paddingRight: '3rem',
                    borderColor: formData.confirmPassword ? (passwordsMatch ? '#22c55e' : '#ef4444') : undefined
                  }}
                  placeholder="********" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ (Passwords do not match)
                </p>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || !passwordValidation.isStrong || !passwordsMatch}
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

